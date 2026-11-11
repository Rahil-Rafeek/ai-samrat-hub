"""
Core examination business logic engine:
- Manages exam lifecycle (start, resume, autosave, submit, review)
- Randomizes question sequence per attempt
- Randomizes A/B/C/D options per attempt while preserving exact correct mapping
- Persists the 50-question paper snapshot permanently in the database
- Idempotent on reconnect/refresh (never regenerates active papers)
- Accurate timer enforcement (60 minutes) with auto-submission on expiration
- Exact scoring: 50 questions * 2 marks = 100 marks max, no negative marking
"""

import uuid
import json
import random
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, Tuple, List
from .database import get_db, get_db_connection

EXAM_DURATION_MINUTES = 60
TOTAL_QUESTIONS = 50
MARKS_PER_QUESTION = 2.0
MAX_SCORE = TOTAL_QUESTIONS * MARKS_PER_QUESTION  # 100.0

def utc_now() -> datetime:
    """Current UTC datetime."""
    return datetime.now(timezone.utc)

def parse_iso(ts_str: str) -> datetime:
    """Safely parse ISO or SQLite timestamp into UTC datetime."""
    if not ts_str:
        return utc_now()
    if ts_str.endswith("Z"):
        ts_str = ts_str[:-1] + "+00:00"
    try:
        dt = datetime.fromisoformat(ts_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        # Fallback for sqlite formats like 'YYYY-MM-DD HH:MM:SS'
        dt = datetime.strptime(ts_str.split(".")[0], "%Y-%m-%d %H:%M:%S")
        return dt.replace(tzinfo=timezone.utc)

def start_or_resume_exam(employee_id: str, employee_name: str, subject: str, set_name: str) -> Dict[str, Any]:
    """
    Starts a new exam attempt or returns the existing active attempt.
    CRITICAL: Never regenerates paper if an active attempt exists!
    """
    employee_id = employee_id.strip()
    employee_name = employee_name.strip()
    subject = subject.strip()
    set_name = set_name.strip().upper()

    with get_db() as conn:
        cursor = conn.cursor()

        # 1. Ensure employee record exists
        cursor.execute("""
            INSERT INTO employees (id, name)
            VALUES (?, ?)
            ON CONFLICT(id) DO UPDATE SET name=excluded.name;
        """, (employee_id, employee_name))

        # 2. Check for existing active or submitted attempt
        cursor.execute("""
            SELECT id, status, start_time, duration_minutes, end_time_expected, submit_time
            FROM exam_attempts
            WHERE employee_id = ? AND subject = ? AND set_name = ?
            ORDER BY created_at DESC LIMIT 1;
        """, (employee_id, subject, set_name))
        existing_attempt = cursor.fetchone()

        now = utc_now()

        if existing_attempt:
            attempt_id = existing_attempt["id"]
            status = existing_attempt["status"]
            start_time = parse_iso(existing_attempt["start_time"])
            end_time_expected = parse_iso(existing_attempt["end_time_expected"])

            # Check if active attempt has timed out
            if status == "IN_PROGRESS":
                if now >= end_time_expected:
                    # Auto-submit expired exam
                    auto_submit_attempt(attempt_id, conn)
                    return {"attempt_id": attempt_id, "status": "SUBMITTED", "expired": True}
                else:
                    # Return existing active exam without regenerating
                    return get_active_exam_data(attempt_id, conn)
            elif status in ("SUBMITTED", "EXPIRED"):
                return {"attempt_id": attempt_id, "status": status, "already_completed": True}

        # 3. Create NEW attempt with 50 randomized questions and randomized options
        cursor.execute("""
            SELECT id, subject, set_name, difficulty, topic, question_text,
                   option_a, option_b, option_c, option_d, correct_option
            FROM questions
            WHERE subject = ? AND set_name = ?;
        """, (subject, set_name))
        available_questions = cursor.fetchall()

        if len(available_questions) < TOTAL_QUESTIONS:
            raise ValueError(f"Insufficient approved questions for {subject} Set {set_name}. Found {len(available_questions)}, required {TOTAL_QUESTIONS}.")

        # Select exactly 50 questions (if set has more, sample 50; if exactly 50, all 50)
        selected_questions = list(available_questions)
        if len(selected_questions) > TOTAL_QUESTIONS:
            selected_questions = random.sample(selected_questions, TOTAL_QUESTIONS)
        else:
            random.shuffle(selected_questions)

        attempt_id = str(uuid.uuid4())
        start_time_iso = now.isoformat()
        end_time = now + timedelta(minutes=EXAM_DURATION_MINUTES)
        end_time_iso = end_time.isoformat()

        cursor.execute("""
            INSERT INTO exam_attempts (
                id, employee_id, employee_name, subject, set_name,
                status, start_time, duration_minutes, end_time_expected,
                total_marks, total_questions
            ) VALUES (?, ?, ?, ?, ?, 'IN_PROGRESS', ?, ?, ?, ?, ?);
        """, (attempt_id, employee_id, employee_name, subject, set_name,
              start_time_iso, EXAM_DURATION_MINUTES, end_time_iso, MAX_SCORE, TOTAL_QUESTIONS))

        # Insert 50 questions with independently randomized question order & randomized A/B/C/D options
        letters = ['A', 'B', 'C', 'D']
        for display_order, q in enumerate(selected_questions, start=1):
            q_id = q["id"]
            orig_correct = q["correct_option"].upper()

            orig_options = [
                ('A', q["option_a"]),
                ('B', q["option_b"]),
                ('C', q["option_c"]),
                ('D', q["option_d"])
            ]
            
            # Shuffle options independently for this question in this attempt
            shuffled_options = random.sample(orig_options, k=4)
            
            # Map shuffled options to display letters A, B, C, D
            display_options = {}
            correct_display_letter = None
            mapping = {}

            for idx, (orig_letter, text) in enumerate(shuffled_options):
                disp_letter = letters[idx]
                display_options[disp_letter] = text
                mapping[disp_letter] = orig_letter
                if orig_letter == orig_correct:
                    correct_display_letter = disp_letter

            cursor.execute("""
                INSERT INTO attempt_questions (
                    attempt_id, question_id, display_order,
                    display_option_a, display_option_b, display_option_c, display_option_d,
                    correct_display_option, original_correct_option, option_mapping_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                attempt_id, q_id, display_order,
                display_options['A'], display_options['B'], display_options['C'], display_options['D'],
                correct_display_letter, orig_correct, json.dumps(mapping)
            ))

        return get_active_exam_data(attempt_id, conn)

def get_active_exam_data(attempt_id: str, conn: Optional[sqlite3.Connection] = None) -> Dict[str, Any]:
    """
    Fetches the active exam paper.
    SECURITY GUARANTEE: Never exposes correct options or explanations!
    """
    should_close = False
    if conn is None:
        conn = get_db_connection()
        should_close = True

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, employee_id, employee_name, subject, set_name,
                   status, start_time, duration_minutes, end_time_expected
            FROM exam_attempts
            WHERE id = ?;
        """, (attempt_id,))
        attempt = cursor.fetchone()
        if not attempt:
            raise KeyError("Attempt not found")

        now = utc_now()
        start_time = parse_iso(attempt["start_time"])
        end_time_expected = parse_iso(attempt["end_time_expected"])

        remaining_seconds = max(0, int((end_time_expected - now).total_seconds()))
        duration_seconds = attempt["duration_minutes"] * 60

        # Auto-submit if expired and still in progress
        if attempt["status"] == "IN_PROGRESS" and remaining_seconds <= 0:
            auto_submit_attempt(attempt_id, conn)
            return {"attempt_id": attempt_id, "status": "SUBMITTED", "expired": True}

        # Fetch stored answers
        cursor.execute("""
            SELECT display_order, selected_display_option, is_marked_for_review
            FROM attempt_answers
            WHERE attempt_id = ?;
        """, (attempt_id,))
        answers_map = {row["display_order"]: row for row in cursor.fetchall()}

        # Fetch 50 questions in persistent display_order
        cursor.execute("""
            SELECT aq.display_order, aq.question_id, aq.display_option_a, aq.display_option_b,
                   aq.display_option_c, aq.display_option_d,
                   q.subject, q.difficulty, q.topic, q.question_text
            FROM attempt_questions aq
            JOIN questions q ON aq.question_id = q.id
            WHERE aq.attempt_id = ?
            ORDER BY aq.display_order ASC;
        """, (attempt_id,))
        questions_rows = cursor.fetchall()

        questions_list = []
        answered_count = 0
        marked_count = 0

        for r in questions_rows:
            order = r["display_order"]
            ans_info = answers_map.get(order)
            sel_opt = ans_info["selected_display_option"] if ans_info else None
            is_marked = bool(ans_info["is_marked_for_review"]) if ans_info else False

            if sel_opt:
                answered_count += 1
            if is_marked:
                marked_count += 1

            questions_list.append({
                "display_order": order,
                "question_id": r["question_id"],
                "subject": r["subject"],
                "difficulty": r["difficulty"],
                "topic": r["topic"],
                "question_text": r["question_text"],
                "options": {
                    "A": r["display_option_a"],
                    "B": r["display_option_b"],
                    "C": r["display_option_c"],
                    "D": r["display_option_d"]
                },
                "selected_option": sel_opt,
                "is_marked_for_review": is_marked
            })

        return {
            "attempt_id": attempt["id"],
            "employee_id": attempt["employee_id"],
            "employee_name": attempt["employee_name"],
            "subject": attempt["subject"],
            "set_name": attempt["set_name"],
            "status": attempt["status"],
            "start_time": attempt["start_time"],
            "duration_minutes": attempt["duration_minutes"],
            "duration_seconds": duration_seconds,
            "remaining_seconds": remaining_seconds,
            "total_questions": TOTAL_QUESTIONS,
            "marks_per_question": MARKS_PER_QUESTION,
            "total_marks": MAX_SCORE,
            "questions": questions_list,
            "summary": {
                "total": TOTAL_QUESTIONS,
                "answered": answered_count,
                "unanswered": TOTAL_QUESTIONS - answered_count,
                "marked_for_review": marked_count
            }
        }
    finally:
        if should_close:
            conn.close()

def autosave_answer(attempt_id: str, display_order: int, selected_option: Optional[str], is_marked_for_review: bool) -> Dict[str, Any]:
    """
    Autosaves an answer immediately to SQLite with WAL mode.
    Rejects update if exam is already submitted or expired.
    """
    if display_order < 1 or display_order > TOTAL_QUESTIONS:
        raise ValueError("Invalid display order (must be 1-50)")

    if selected_option is not None:
        selected_option = selected_option.strip().upper()
        if selected_option not in ('A', 'B', 'C', 'D'):
            selected_option = None

    with get_db() as conn:
        cursor = conn.cursor()

        # Check attempt status and expiration
        cursor.execute("SELECT status, end_time_expected FROM exam_attempts WHERE id = ?;", (attempt_id,))
        attempt = cursor.fetchone()
        if not attempt:
            raise KeyError("Attempt not found")

        if attempt["status"] != "IN_PROGRESS":
            raise ValueError(f"Exam cannot be updated; status is {attempt['status']}")

        end_time_expected = parse_iso(attempt["end_time_expected"])
        # Allow 30 seconds network grace period for autosave in-flight
        if utc_now() > end_time_expected + timedelta(seconds=30):
            auto_submit_attempt(attempt_id, conn)
            raise ValueError("Exam time has expired; attempt auto-submitted")

        now_iso = utc_now().isoformat()
        cursor.execute("""
            INSERT INTO attempt_answers (attempt_id, display_order, selected_display_option, is_marked_for_review, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(attempt_id, display_order) DO UPDATE SET
                selected_display_option = excluded.selected_display_option,
                is_marked_for_review = excluded.is_marked_for_review,
                updated_at = excluded.updated_at;
        """, (attempt_id, display_order, selected_option, 1 if is_marked_for_review else 0, now_iso))

        return {
            "status": "saved",
            "attempt_id": attempt_id,
            "display_order": display_order,
            "selected_option": selected_option,
            "is_marked_for_review": is_marked_for_review,
            "saved_at": now_iso
        }

def submit_attempt(attempt_id: str) -> Dict[str, Any]:
    """
    Submits an exam attempt and computes the final score.
    Each correct question carries 2 marks (max 100 marks).
    No negative marking.
    """
    with get_db() as conn:
        return auto_submit_attempt(attempt_id, conn)

def auto_submit_attempt(attempt_id: str, conn: sqlite3.Connection) -> Dict[str, Any]:
    """Internal submission and evaluation logic."""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, employee_id, employee_name, subject, set_name, status, start_time, total_marks
        FROM exam_attempts WHERE id = ?;
    """, (attempt_id,))
    attempt = cursor.fetchone()
    if not attempt:
        raise KeyError("Attempt not found")

    if attempt["status"] == "SUBMITTED":
        return get_exam_results(attempt_id, conn)

    # Fetch stored randomized correct options and student's selected options
    cursor.execute("""
        SELECT aq.display_order, aq.correct_display_option,
               ans.selected_display_option
        FROM attempt_questions aq
        LEFT JOIN attempt_answers ans ON (aq.attempt_id = ans.attempt_id AND aq.display_order = ans.display_order)
        WHERE aq.attempt_id = ?
        ORDER BY aq.display_order ASC;
    """, (attempt_id,))
    rows = cursor.fetchall()

    correct_count = 0
    incorrect_count = 0
    unanswered_count = 0

    for r in rows:
        disp_order = r["display_order"]
        correct_disp = r["correct_display_option"]
        selected_disp = r["selected_display_option"]

        if selected_disp is None or selected_disp == "":
            unanswered_count += 1
            is_correct = 0
        elif selected_disp.upper() == correct_disp.upper():
            correct_count += 1
            is_correct = 1
        else:
            incorrect_count += 1
            is_correct = 0

        # Update attempt_answers row with correctness
        cursor.execute("""
            INSERT INTO attempt_answers (attempt_id, display_order, selected_display_option, is_correct)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(attempt_id, display_order) DO UPDATE SET
                is_correct = excluded.is_correct;
        """, (attempt_id, disp_order, selected_disp, is_correct))

    final_score = correct_count * MARKS_PER_QUESTION
    now_iso = utc_now().isoformat()

    cursor.execute("""
        UPDATE exam_attempts SET
            status = 'SUBMITTED',
            submit_time = ?,
            score = ?,
            correct_count = ?,
            incorrect_count = ?,
            unanswered_count = ?
        WHERE id = ?;
    """, (now_iso, final_score, correct_count, incorrect_count, unanswered_count, attempt_id))

    return get_exam_results(attempt_id, conn)

def get_exam_results(attempt_id: str, conn: Optional[sqlite3.Connection] = None) -> Dict[str, Any]:
    """
    Fetches full scorecard and question-by-question review with technical explanations.
    Available ONLY after submission.
    """
    should_close = False
    if conn is None:
        conn = get_db_connection()
        should_close = True

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, employee_id, employee_name, subject, set_name, status,
                   start_time, submit_time, score, total_marks, total_questions,
                   correct_count, incorrect_count, unanswered_count
            FROM exam_attempts WHERE id = ?;
        """, (attempt_id,))
        attempt = cursor.fetchone()
        if not attempt:
            raise KeyError("Attempt not found")

        if attempt["status"] != "SUBMITTED":
            raise PermissionError("Results are only accessible after exam submission")

        cursor.execute("""
            SELECT aq.display_order, aq.question_id,
                   aq.display_option_a, aq.display_option_b, aq.display_option_c, aq.display_option_d,
                   aq.correct_display_option,
                   ans.selected_display_option,
                   q.subject, q.difficulty, q.topic, q.question_text, q.explanation
            FROM attempt_questions aq
            JOIN questions q ON aq.question_id = q.id
            LEFT JOIN attempt_answers ans ON (aq.attempt_id = ans.attempt_id AND aq.display_order = ans.display_order)
            WHERE aq.attempt_id = ?
            ORDER BY aq.display_order ASC;
        """, (attempt_id,))
        rows = cursor.fetchall()

        reviews = []
        diff_stats = {
            "Beginner": {"total": 0, "correct": 0},
            "Intermediate": {"total": 0, "correct": 0},
            "Advanced": {"total": 0, "correct": 0}
        }

        for r in rows:
            diff = r["difficulty"]
            if diff in diff_stats:
                diff_stats[diff]["total"] += 1

            selected = r["selected_display_option"]
            correct = r["correct_display_option"]
            is_correct = (selected is not None and selected.upper() == correct.upper())

            if is_correct and diff in diff_stats:
                diff_stats[diff]["correct"] += 1

            marks = MARKS_PER_QUESTION if is_correct else 0.0

            reviews.append({
                "display_order": r["display_order"],
                "question_id": r["question_id"],
                "subject": r["subject"],
                "difficulty": r["difficulty"],
                "topic": r["topic"],
                "question_text": r["question_text"],
                "options": {
                    "A": r["display_option_a"],
                    "B": r["display_option_b"],
                    "C": r["display_option_c"],
                    "D": r["display_option_d"]
                },
                "selected_option": selected,
                "correct_option": correct,
                "is_correct": is_correct,
                "marks_awarded": marks,
                "explanation": r["explanation"]
            })

        percentage = round((attempt["score"] / attempt["total_marks"]) * 100.0, 2)

        return {
            "attempt_id": attempt["id"],
            "employee_id": attempt["employee_id"],
            "employee_name": attempt["employee_name"],
            "subject": attempt["subject"],
            "set_name": attempt["set_name"],
            "status": attempt["status"],
            "start_time": attempt["start_time"],
            "submit_time": attempt["submit_time"],
            "score": attempt["score"],
            "total_marks": attempt["total_marks"],
            "percentage": percentage,
            "total_questions": attempt["total_questions"],
            "correct_count": attempt["correct_count"],
            "incorrect_count": attempt["incorrect_count"],
            "unanswered_count": attempt["unanswered_count"],
            "difficulty_breakdown": diff_stats,
            "reviews": reviews
        }
    finally:
        if should_close:
            conn.close()

