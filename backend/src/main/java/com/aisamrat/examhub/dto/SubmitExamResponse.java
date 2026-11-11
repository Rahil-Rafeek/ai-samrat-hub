package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.AttemptStatus;
import com.aisamrat.examhub.enums.CertificateGrade;

public record SubmitExamResponse(
        String attemptUuid,
        AttemptStatus status,
        Double score,
        Double maxScore,
        Double percentage,
        boolean isPassed,
        CertificateGrade grade,
        String gradeDisplayName,
        String certificateCode,
        String message
) {}

