package com.aisamrat.examhub.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "evaluation_audits")
public class EvaluationAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @Column(name = "reviewer_username", nullable = false, length = 50)
    private String reviewerUsername;

    @Column(name = "reviewer_full_name", nullable = false, length = 100)
    private String reviewerFullName;

    @Column(name = "previous_score", nullable = false)
    private Double previousScore;

    @Column(name = "revised_score", nullable = false)
    private Double revisedScore;

    @Column(nullable = false, length = 255)
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    public EvaluationAudit() {}

    public EvaluationAudit(Submission submission, String reviewerUsername, String reviewerFullName, Double previousScore, Double revisedScore, String reason, String remarks) {
        this.submission = submission;
        this.reviewerUsername = reviewerUsername;
        this.reviewerFullName = reviewerFullName;
        this.previousScore = previousScore;
        this.revisedScore = revisedScore;
        this.reason = reason;
        this.remarks = remarks;
        this.timestamp = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }

    public String getReviewerUsername() { return reviewerUsername; }
    public void setReviewerUsername(String reviewerUsername) { this.reviewerUsername = reviewerUsername; }

    public String getReviewerFullName() { return reviewerFullName; }
    public void setReviewerFullName(String reviewerFullName) { this.reviewerFullName = reviewerFullName; }

    public Double getPreviousScore() { return previousScore; }
    public void setPreviousScore(Double previousScore) { this.previousScore = previousScore; }

    public Double getRevisedScore() { return revisedScore; }
    public void setRevisedScore(Double revisedScore) { this.revisedScore = revisedScore; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

