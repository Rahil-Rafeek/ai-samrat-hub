package com.aisamrat.examhub.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "backup_records")
public class BackupRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String filename;

    @Column(nullable = false, length = 255)
    private String filepath;

    @Column(name = "size_bytes", nullable = false)
    private Long sizeBytes;

    @Column(name = "backup_type", nullable = false, length = 20)
    private String backupType = "MANUAL"; // "MANUAL", "AUTO"

    @Column(nullable = false, length = 20)
    private String status = "SUCCESS";

    @Column(length = 64)
    private String checksum;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public BackupRecord() {}

    public BackupRecord(String filename, String filepath, Long sizeBytes, String backupType, String status, String checksum) {
        this.filename = filename;
        this.filepath = filepath;
        this.sizeBytes = sizeBytes;
        this.backupType = backupType;
        this.status = status;
        this.checksum = checksum;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getFilepath() { return filepath; }
    public void setFilepath(String filepath) { this.filepath = filepath; }

    public Long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }

    public String getBackupType() { return backupType; }
    public void setBackupType(String backupType) { this.backupType = backupType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

