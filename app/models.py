"""
Pydantic data models for Examination System API.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class StartExamRequest(BaseModel):
    employee_id: str = Field(..., min_length=2, max_length=50, description="Employee identifier")
    employee_name: str = Field(..., min_length=2, max_length=100, description="Employee full name")
    subject: str = Field(..., description="Subject name")
    set_name: str = Field(..., pattern="^(A|B)$", description="Question Set: A or B")

class AutosaveAnswerRequest(BaseModel):
    display_order: int = Field(..., ge=1, le=50, description="Question number 1 to 50")
    selected_option: Optional[str] = Field(None, pattern="^(A|B|C|D)?$", description="Selected option A, B, C, D or null to clear")
    is_marked_for_review: bool = Field(False, description="Whether marked for review")

class QuestionDisplayItem(BaseModel):
    display_order: int
    question_id: str
    subject: str
    difficulty: str
    topic: str
    question_text: str
    options: Dict[str, str]  # {"A": text, "B": text, "C": text, "D": text}
    selected_option: Optional[str] = None
    is_marked_for_review: bool = False

class ActiveExamResponse(BaseModel):
    attempt_id: str
    employee_id: str
    employee_name: str
    subject: str
    set_name: str
    status: str
    start_time: str
    duration_minutes: int
    duration_seconds: int
    remaining_seconds: int
    total_questions: int
    marks_per_question: float
    total_marks: float
    questions: List[QuestionDisplayItem]
    summary: Dict[str, int]  # answered, unanswered, marked

class QuestionReviewItem(BaseModel):
    display_order: int
    question_id: str
    subject: str
    difficulty: str
    topic: str
    question_text: str
    options: Dict[str, str]
    selected_option: Optional[str]
    correct_option: str
    is_correct: bool
    marks_awarded: float
    explanation: str

class ExamResultResponse(BaseModel):
    attempt_id: str
    employee_id: str
    employee_name: str
    subject: str
    set_name: str
    status: str
    start_time: str
    submit_time: Optional[str]
    score: float
    total_marks: float
    percentage: float
    total_questions: int
    correct_count: int
    incorrect_count: int
    unanswered_count: int
    difficulty_breakdown: Dict[str, Dict[str, int]]
    reviews: List[QuestionReviewItem]

class SubjectInfo(BaseModel):
    name: str
    sets_available: List[str]
    total_questions_per_set: int

