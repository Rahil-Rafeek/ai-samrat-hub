package com.aisamrat.examhub.entity;

import com.aisamrat.examhub.enums.AttemptStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "examination_attempts")
public class ExaminationAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attempt_uuid", nullable = false, unique = true, length = 64)
    private String attemptUuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examination_id", nullable = false)
    private Examination examination;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "assigned_set", nullable = false, length = 10)
    private String assignedSet; // "A" or "B"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt = Instant.now();

    @Column(name = "expected_end_time", nullable = false)
    private Instant expectedEndTime;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "duration_seconds_taken")
    private Long durationSecondsTaken;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 50;

    @Column(name = "answered_count", nullable = false)
    private Integer answeredCount = 0;

    @Column(name = "marks_awarded")
    private Double marksAwarded;

    @Column(name = "percentage")
    private Double percentage;

    @Column(name = "is_passed")
    private Boolean isPassed;

    @Column(name = "termination_reason", length = 255)
    private String terminationReason;

    @Column(name = "tab_switch_violations", nullable = false)
    private Integer tabSwitchViolations = 0;

    @Column(name = "fullscreen_exit_violations", nullable = false)
    private Integer fullscreenExitViolations = 0;

    @Column(name = "integrity_score", nullable = false)
    private Double integrityScore = 100.0;

    @Column(name = "last_heartbeat_at")
    private Instant lastHeartbeatAt = Instant.now();

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<AttemptQuestion> attemptQuestions = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ExaminationAttempt() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAttemptUuid() { return attemptUuid; }
    public void setAttemptUuid(String attemptUuid) { this.attemptUuid = attemptUuid; }

    public Examination getExamination() { return examination; }
    public void setExamination(Examination examination) { this.examination = examination; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getAssignedSet() { return assignedSet; }
    public void setAssignedSet(String assignedSet) { this.assignedSet = assignedSet; }

    public AttemptStatus getStatus() { return status; }
    public void setStatus(AttemptStatus status) { this.status = status; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getExpectedEndTime() { return expectedEndTime; }
    public void setExpectedEndTime(Instant expectedEndTime) { this.expectedEndTime = expectedEndTime; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }

    public Long getDurationSecondsTaken() { return durationSecondsTaken; }
    public void setDurationSecondsTaken(Long durationSecondsTaken) { this.durationSecondsTaken = durationSecondsTaken; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getAnsweredCount() { return answeredCount; }
    public void setAnsweredCount(Integer answeredCount) { this.answeredCount = answeredCount; }

    public Double getMarksAwarded() { return marksAwarded; }
    public void setMarksAwarded(Double marksAwarded) { this.marksAwarded = marksAwarded; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public Boolean getPassed() { return isPassed; }
    public void setPassed(Boolean passed) { isPassed = passed; }

    public String getTerminationReason() { return terminationReason; }
    public void setTerminationReason(String terminationReason) { this.terminationReason = terminationReason; }

    public Integer getTabSwitchViolations() { return tabSwitchViolations; }
    public void setTabSwitchViolations(Integer tabSwitchViolations) { this.tabSwitchViolations = tabSwitchViolations; }

    public Integer getFullscreenExitViolations() { return fullscreenExitViolations; }
    public void setFullscreenExitViolations(Integer fullscreenExitViolations) { this.fullscreenExitViolations = fullscreenExitViolations; }

    public Double getIntegrityScore() { return integrityScore; }
    public void setIntegrityScore(Double integrityScore) { this.integrityScore = integrityScore; }

    public Instant getLastHeartbeatAt() { return lastHeartbeatAt; }
    public void setLastHeartbeatAt(Instant lastHeartbeatAt) { this.lastHeartbeatAt = lastHeartbeatAt; }

    public List<AttemptQuestion> getAttemptQuestions() { return attemptQuestions; }
    public void setAttemptQuestions(List<AttemptQuestion> attemptQuestions) { this.attemptQuestions = attemptQuestions; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

