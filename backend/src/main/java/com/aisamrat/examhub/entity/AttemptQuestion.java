package com.aisamrat.examhub.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "attempt_questions", indexes = {
    @Index(name = "idx_attempt_display_order", columnList = "attempt_id, display_order")
})
public class AttemptQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private ExaminationAttempt attempt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder; // 1 to 50

    // Randomized option texts mapped to A, B, C, D
    @Column(name = "option_a_text", nullable = false, columnDefinition = "TEXT")
    private String optionAText;

    @Column(name = "option_b_text", nullable = false, columnDefinition = "TEXT")
    private String optionBText;

    @Column(name = "option_c_text", nullable = false, columnDefinition = "TEXT")
    private String optionCText;

    @Column(name = "option_d_text", nullable = false, columnDefinition = "TEXT")
    private String optionDText;

    // Secure: correct option letter in this specific shuffled view (A, B, C, or D)
    @Column(name = "correct_option_display", nullable = false, length = 1)
    private String correctOptionDisplay;

    // Employee's response
    @Column(name = "selected_option", length = 1)
    private String selectedOption; // "A", "B", "C", "D" or null

    @Column(name = "is_marked_for_review", nullable = false)
    private boolean isMarkedForReview = false;

    @Column(name = "is_visited", nullable = false)
    private boolean isVisited = false;

    @Column(name = "answered_at")
    private Instant answeredAt;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "marks_awarded")
    private Double marksAwarded = 0.0;

    public AttemptQuestion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ExaminationAttempt getAttempt() { return attempt; }
    public void setAttempt(ExaminationAttempt attempt) { this.attempt = attempt; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getOptionAText() { return optionAText; }
    public void setOptionAText(String optionAText) { this.optionAText = optionAText; }

    public String getOptionBText() { return optionBText; }
    public void setOptionBText(String optionBText) { this.optionBText = optionBText; }

    public String getOptionCText() { return optionCText; }
    public void setOptionCText(String optionCText) { this.optionCText = optionCText; }

    public String getOptionDText() { return optionDText; }
    public void setOptionDText(String optionDText) { this.optionDText = optionDText; }

    public String getCorrectOptionDisplay() { return correctOptionDisplay; }
    public void setCorrectOptionDisplay(String correctOptionDisplay) { this.correctOptionDisplay = correctOptionDisplay; }

    public String getSelectedOption() { return selectedOption; }
    public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }

    public boolean isMarkedForReview() { return isMarkedForReview; }
    public void setMarkedForReview(boolean markedForReview) { isMarkedForReview = markedForReview; }

    public boolean isVisited() { return isVisited; }
    public void setVisited(boolean visited) { isVisited = visited; }

    public Instant getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(Instant answeredAt) { this.answeredAt = answeredAt; }

    public Boolean getCorrect() { return isCorrect; }
    public void setCorrect(Boolean correct) { isCorrect = correct; }

    public Double getMarksAwarded() { return marksAwarded; }
    public void setMarksAwarded(Double marksAwarded) { this.marksAwarded = marksAwarded; }
}

