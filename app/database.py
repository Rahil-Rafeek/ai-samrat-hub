"""
Database setup for the Examination Platform.
Configured with SQLite WAL (Write-Ahead Logging) mode and busy timeout
for robust multi-user concurrency handling (supporting 100+ simultaneous users).
"""

import sqlite3
import os
import contextlib
from typing import Generator

DB_PATH = os.environ.get("EXAM_DB_PATH", os.path.join(os.path.dirname(__file__), "examination.db"))

def get_db_connection() -> sqlite3.Connection:
    """Creates a connection with WAL mode and row factory enabled."""
    conn = sqlite3.connect(DB_PATH, timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    conn.execute("PRAGMA busy_timeout=30000;")
    return conn

@contextlib.contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """Context manager for database transactions."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initializes schema and tables."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Questions table: stores the 600 master questions
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            subject TEXT NOT NULL,
            set_name TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            topic TEXT NOT NULL,
            question_text TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_option TEXT NOT NULL,
            explanation TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_subject_set ON questions(subject, set_name);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);")

        # Employees table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            department TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Exam Attempts table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS exam_attempts (
            id TEXT PRIMARY KEY,
            employee_id TEXT NOT NULL,
            employee_name TEXT NOT NULL,
            subject TEXT NOT NULL,
            set_name TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED')),
            start_time TIMESTAMP NOT NULL,
            duration_minutes INTEGER NOT NULL DEFAULT 60,
            end_time_expected TIMESTAMP NOT NULL,
            submit_time TIMESTAMP,
            score REAL DEFAULT 0.0,
            total_marks REAL DEFAULT 100.0,
            total_questions INTEGER DEFAULT 50,
            correct_count INTEGER DEFAULT 0,
            incorrect_count INTEGER DEFAULT 0,
            unanswered_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(id)
        );
        """)

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_attempts_emp_subj_set ON exam_attempts(employee_id, subject, set_name);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_attempts_status ON exam_attempts(status);")

        # Attempt Questions table: Persists the exact 50 questions & randomized options for the attempt
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS attempt_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            attempt_id TEXT NOT NULL,
            question_id TEXT NOT NULL,
            display_order INTEGER NOT NULL CHECK(display_order BETWEEN 1 AND 50),
            display_option_a TEXT NOT NULL,
            display_option_b TEXT NOT NULL,
            display_option_c TEXT NOT NULL,
            display_option_d TEXT NOT NULL,
            correct_display_option TEXT NOT NULL CHECK(correct_display_option IN ('A', 'B', 'C', 'D')),
            original_correct_option TEXT NOT NULL,
            option_mapping_json TEXT NOT NULL,
            FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE,
            FOREIGN KEY (question_id) REFERENCES questions(id),
            UNIQUE (attempt_id, display_order),
            UNIQUE (attempt_id, question_id)
        );
        """)

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_attempt_questions_lookup ON attempt_questions(attempt_id, display_order);")

        # Attempt Answers table: Stores autosaved answers
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS attempt_answers (
            attempt_id TEXT NOT NULL,
            display_order INTEGER NOT NULL,
            selected_display_option TEXT CHECK(selected_display_option IN ('A', 'B', 'C', 'D', NULL)),
            is_marked_for_review INTEGER DEFAULT 0,
            is_correct INTEGER,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (attempt_id, display_order),
            FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE
        );
        """)

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_answers_attempt ON attempt_answers(attempt_id);")

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully with WAL mode.")

