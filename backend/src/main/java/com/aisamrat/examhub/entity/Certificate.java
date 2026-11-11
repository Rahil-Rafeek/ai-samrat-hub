package com.aisamrat.examhub.entity;

import com.aisamrat.examhub.enums.CertificateGrade;
import com.aisamrat.examhub.enums.CertificateStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_code", nullable = false, unique = true, length = 64)
    private String certificateCode; // e.g. AIS-CERT-2026-X8Y2K

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 100)
    private String subject;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false, unique = true)
    private ExaminationAttempt attempt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CertificateGrade grade;

    @Column(nullable = false)
    private Double score;

    @Column(name = "max_score", nullable = false)
    private Double maxScore = 100.0;

    @Column(nullable = false)
    private Double percentage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CertificateStatus status = CertificateStatus.VALID;

    @Column(name = "qr_code_base64", columnDefinition = "TEXT")
    private String qrCodeBase64;

    @Column(name = "pdf_path", length = 255)
    private String pdfPath;

    @Column(name = "verification_url", length = 255)
    private String verificationUrl;

    @Column(name = "exam_date")
    private LocalDate examDate;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "revocation_reason", length = 500)
    private String revocationReason;

    @Column(name = "revoked_by", length = 100)
    private String revokedBy;

    @Column(name = "signatory_name", length = 100)
    private String signatoryName = "Deepak Ganer";

    @Column(name = "signatory_title", length = 150)
    private String signatoryTitle = "Director & Authorised Signatory";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Certificate() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCertificateCode() { return certificateCode; }
    public void setCertificateCode(String certificateCode) { this.certificateCode = certificateCode; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public ExaminationAttempt getAttempt() { return attempt; }
    public void setAttempt(ExaminationAttempt attempt) { this.attempt = attempt; }

    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public CertificateGrade getGrade() { return grade; }
    public void setGrade(CertificateGrade grade) { this.grade = grade; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public Double getMaxScore() { return maxScore; }
    public void setMaxScore(Double maxScore) { this.maxScore = maxScore; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public CertificateStatus getStatus() { return status; }
    public void setStatus(CertificateStatus status) { this.status = status; }

    public String getQrCodeBase64() { return qrCodeBase64; }
    public void setQrCodeBase64(String qrCodeBase64) { this.qrCodeBase64 = qrCodeBase64; }

    public String getPdfPath() { return pdfPath; }
    public void setPdfPath(String pdfPath) { this.pdfPath = pdfPath; }

    public String getVerificationUrl() { return verificationUrl; }
    public void setVerificationUrl(String verificationUrl) { this.verificationUrl = verificationUrl; }

    public LocalDate getExamDate() { return examDate; }
    public void setExamDate(LocalDate examDate) { this.examDate = examDate; }

    public Instant getRevokedAt() { return revokedAt; }
    public void setRevokedAt(Instant revokedAt) { this.revokedAt = revokedAt; }

    public String getRevocationReason() { return revocationReason; }
    public void setRevocationReason(String revocationReason) { this.revocationReason = revocationReason; }

    public String getRevokedBy() { return revokedBy; }
    public void setRevokedBy(String revokedBy) { this.revokedBy = revokedBy; }

    public String getSignatoryName() { return signatoryName; }
    public void setSignatoryName(String signatoryName) { this.signatoryName = signatoryName; }

    public String getSignatoryTitle() { return signatoryTitle; }
    public void setSignatoryTitle(String signatoryTitle) { this.signatoryTitle = signatoryTitle; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

