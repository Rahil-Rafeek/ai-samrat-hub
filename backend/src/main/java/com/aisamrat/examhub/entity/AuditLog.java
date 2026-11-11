package com.aisamrat.examhub.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy;

    @Column(name = "entity_name", length = 100)
    private String entityName;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(nullable = false, updatable = false)
    private Instant timestamp = Instant.now();

    public AuditLog() {}

    public AuditLog(String performedBy, String action, String entityName, String details, String ipAddress) {
        this.performedBy = performedBy;
        this.action = action;
        this.entityName = entityName;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = Instant.now();
    }

    public AuditLog(String action, String performedBy, String entityName, String entityId, String details, String ipAddress) {
        this.action = action;
        this.performedBy = performedBy;
        this.entityName = entityName;
        this.entityId = entityId;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

