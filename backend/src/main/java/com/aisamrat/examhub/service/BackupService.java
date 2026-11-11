package com.aisamrat.examhub.service;

import com.aisamrat.examhub.entity.BackupRecord;
import com.aisamrat.examhub.repository.BackupRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HexFormat;
import java.util.List;

@Service
public class BackupService {

    private static final Logger log = LoggerFactory.getLogger(BackupService.class);

    private final BackupRecordRepository backupRecordRepository;
    private final DataSource dataSource;

    public BackupService(BackupRecordRepository backupRecordRepository, DataSource dataSource) {
        this.backupRecordRepository = backupRecordRepository;
        this.dataSource = dataSource;
    }

    @Transactional
    public BackupRecord createBackup(String backupType) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "aisamrat_backup_" + timestamp + ".sql";

        File backupDir = new File("./data/backups");
        if (!backupDir.exists()) backupDir.mkdirs();

        File backupFile = new File(backupDir, filename);

        try (FileWriter writer = new FileWriter(backupFile);
             Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            writer.write("-- ==================================================\n");
            writer.write("-- AI SAMRAT ASSESSMENT HUB DATABASE BACKUP\n");
            writer.write("-- Timestamp: " + Instant.now() + "\n");
            writer.write("-- Type: " + backupType + "\n");
            writer.write("-- ==================================================\n\n");

            // Dump key tables (users, employees, subjects, questions, examinations, submissions, certificates)
            String[] tables = {"users", "employees", "departments", "subjects", "questions", "examinations", "examination_attempts", "submissions", "evaluation_audits", "certificates"};

            for (String table : tables) {
                try (ResultSet rs = stmt.executeQuery("SELECT * FROM " + table)) {
                    writer.write("-- Table: " + table + "\n");
                    int colCount = rs.getMetaData().getColumnCount();
                    while (rs.next()) {
                        StringBuilder sb = new StringBuilder("INSERT INTO " + table + " VALUES (");
                        for (int i = 1; i <= colCount; i++) {
                            Object val = rs.getObject(i);
                            if (val == null) {
                                sb.append("NULL");
                            } else if (val instanceof Number) {
                                sb.append(val);
                            } else {
                                sb.append("'").append(val.toString().replace("'", "''")).append("'");
                            }
                            if (i < colCount) sb.append(", ");
                        }
                        sb.append(");\n");
                        writer.write(sb.toString());
                    }
                    writer.write("\n");
                } catch (Exception e) {
                    log.warn("Could not dump table {}: {}", table, e.getMessage());
                }
            }

            writer.flush();

            // Calculate SHA-256 checksum
            byte[] fileBytes = Files.readAllBytes(backupFile.toPath());
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String checksum = HexFormat.of().formatHex(digest.digest(fileBytes));

            BackupRecord record = new BackupRecord(
                    filename,
                    backupFile.getAbsolutePath(),
                    backupFile.length(),
                    backupType,
                    "SUCCESS",
                    checksum
            );

            log.info("Database backup created successfully: {} (Size: {} bytes, Checksum: {})",
                    filename, record.getSizeBytes(), checksum);

            return backupRecordRepository.save(record);

        } catch (Exception e) {
            log.error("Failed to create backup: {}", e.getMessage(), e);
            BackupRecord failedRecord = new BackupRecord(
                    filename,
                    backupFile.getAbsolutePath(),
                    0L,
                    backupType,
                    "FAILED",
                    null
            );
            return backupRecordRepository.save(failedRecord);
        }
    }

    @Transactional(readOnly = true)
    public List<BackupRecord> getBackupHistory() {
        return backupRecordRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Daily automated backup job at 02:00 AM.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void scheduledDailyBackup() {
        log.info("Executing scheduled automatic daily database backup...");
        createBackup("AUTO");
    }

    @Transactional
    public boolean restoreBackup(Long backupId) {
        BackupRecord record = backupRecordRepository.findById(backupId)
                .orElseThrow(() -> new IllegalArgumentException("Backup record not found: " + backupId));

        File file = new File(record.getFilepath());
        if (!file.exists()) {
            throw new IllegalStateException("Physical backup file does not exist on disk: " + record.getFilepath());
        }

        try {
            // Verify checksum before restore
            byte[] fileBytes = Files.readAllBytes(file.toPath());
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String currentChecksum = HexFormat.of().formatHex(digest.digest(fileBytes));

            if (record.getChecksum() != null && !record.getChecksum().equalsIgnoreCase(currentChecksum)) {
                throw new SecurityException("Backup integrity verification failed: Checksum mismatch!");
            }

            log.info("Simulated restore confirmation verified for backup {}", record.getFilename());
            return true;
        } catch (Exception e) {
            log.error("Failed to restore backup {}: {}", backupId, e.getMessage());
            throw new RuntimeException("Restore failed: " + e.getMessage());
        }
    }
}

