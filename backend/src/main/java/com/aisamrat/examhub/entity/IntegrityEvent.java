package com.aisamrat.examhub.entity;

import com.aisamrat.examhub.enums.IntegrityEventType;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "integrity_events")
public class IntegrityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private ExaminationAttempt attempt;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 50)
    private IntegrityEventType eventType;

    @Column(name = "violation_number")
    private Integer violationNumber;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    public IntegrityEvent() {}

    public IntegrityEvent(ExaminationAttempt attempt, IntegrityEventType eventType, Integer violationNumber, String message, String metadataJson) {
        this.attempt = attempt;
        this.eventType = eventType;
        this.violationNumber = violationNumber;
        this.message = message;
        this.metadataJson = metadataJson;
        this.timestamp = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ExaminationAttempt getAttempt() { return attempt; }
    public void setAttempt(ExaminationAttempt attempt) { this.attempt = attempt; }

    public IntegrityEventType getEventType() { return eventType; }
    public void setEventType(IntegrityEventType eventType) { this.eventType = eventType; }

    public Integer getViolationNumber() { return violationNumber; }
    public void setViolationNumber(Integer violationNumber) { this.violationNumber = violationNumber; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getMetadataJson() { return metadataJson; }
    public void setMetadataJson(String metadataJson) { this.metadataJson = metadataJson; }
}

