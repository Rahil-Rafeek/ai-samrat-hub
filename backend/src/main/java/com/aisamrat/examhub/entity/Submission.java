package com.aisamrat.examhub.entity;

import com.aisamrat.examhub.enums.EvaluationStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false, unique = true)
    private ExaminationAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(name = "set_name", nullable = false, length = 10)
    private String setName;

    @Column(name = "original_score", nullable = false)
    private Double originalScore;

    @Column(name = "final_score", nullable = false)
    private Double finalScore;

    @Column(name = "max_score", nullable = false)
    private Double maxScore = 100.0;

    @Column(name = "percentage", nullable = false)
    private Double percentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "evaluation_status", nullable = false, length = 30)
    private EvaluationStatus evaluationStatus = EvaluationStatus.APPROVED;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("timestamp DESC")
    private List<EvaluationAudit> evaluationAudits = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Submission() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ExaminationAttempt getAttempt() { return attempt; }
    public void setAttempt(ExaminationAttempt attempt) { this.attempt = attempt; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getSetName() { return setName; }
    public void setSetName(String setName) { this.setName = setName; }

    public Double getOriginalScore() { return originalScore; }
    public void setOriginalScore(Double originalScore) { this.originalScore = originalScore; }

    public Double getFinalScore() { return finalScore; }
    public void setFinalScore(Double finalScore) { this.finalScore = finalScore; }

    public Double getMaxScore() { return maxScore; }
    public void setMaxScore(Double maxScore) { this.maxScore = maxScore; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public EvaluationStatus getEvaluationStatus() { return evaluationStatus; }
    public void setEvaluationStatus(EvaluationStatus evaluationStatus) { this.evaluationStatus = evaluationStatus; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    public Instant getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public List<EvaluationAudit> getEvaluationAudits() { return evaluationAudits; }
    public void setEvaluationAudits(List<EvaluationAudit> evaluationAudits) { this.evaluationAudits = evaluationAudits; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

