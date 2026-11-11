package com.aisamrat.examhub.entity;

import com.aisamrat.examhub.enums.ProctoringMode;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "examinations")
public class Examination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(name = "set_name", nullable = false, length = 10)
    private String setName = "A"; // "A" or "B" or "RANDOM"

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 60;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 50;

    @Column(name = "marks_per_question", nullable = false)
    private Double marksPerQuestion = 2.0;

    @Column(name = "total_marks", nullable = false)
    private Double totalMarks = 100.0;

    @Column(name = "passing_percentage", nullable = false)
    private Double passingPercentage = 60.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "proctoring_mode", nullable = false, length = 20)
    private ProctoringMode proctoringMode = ProctoringMode.CALIBRATED;

    @Column(name = "allow_reconnection_grace_seconds", nullable = false)
    private Integer allowReconnectionGraceSeconds = 120;

    @Column(name = "tab_switch_limit", nullable = false)
    private Integer tabSwitchLimit = 3;

    @Column(name = "fullscreen_exit_limit", nullable = false)
    private Integer fullscreenExitLimit = 3;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Examination() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getSetName() { return setName; }
    public void setSetName(String setName) { this.setName = setName; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Double getMarksPerQuestion() { return marksPerQuestion; }
    public void setMarksPerQuestion(Double marksPerQuestion) { this.marksPerQuestion = marksPerQuestion; }

    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }

    public Double getPassingPercentage() { return passingPercentage; }
    public void setPassingPercentage(Double passingPercentage) { this.passingPercentage = passingPercentage; }

    public ProctoringMode getProctoringMode() { return proctoringMode; }
    public void setProctoringMode(ProctoringMode proctoringMode) { this.proctoringMode = proctoringMode; }

    public Integer getAllowReconnectionGraceSeconds() { return allowReconnectionGraceSeconds; }
    public void setAllowReconnectionGraceSeconds(Integer allowReconnectionGraceSeconds) { this.allowReconnectionGraceSeconds = allowReconnectionGraceSeconds; }

    public Integer getTabSwitchLimit() { return tabSwitchLimit; }
    public void setTabSwitchLimit(Integer tabSwitchLimit) { this.tabSwitchLimit = tabSwitchLimit; }

    public Integer getFullscreenExitLimit() { return fullscreenExitLimit; }
    public void setFullscreenExitLimit(Integer fullscreenExitLimit) { this.fullscreenExitLimit = fullscreenExitLimit; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

