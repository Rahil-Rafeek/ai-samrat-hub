package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.CertificateGrade;
import com.aisamrat.examhub.enums.CertificateStatus;

import java.time.Instant;
import java.time.LocalDate;

public record CertificateVerifyResponse(
        boolean isValid,
        String certificateCode,
        String employeeName,
        String employeeCode,
        String subject,
        CertificateGrade grade,
        String gradeDisplayName,
        Double score,
        Double maxScore,
        Double percentage,
        LocalDate issueDate,
        LocalDate examDate,
        CertificateStatus status,
        String issuerName,
        String directorName,
        String directorTitle,
        String message,
        Instant revokedAt,
        String revocationReason,
        String qrCodeBase64
) {}

