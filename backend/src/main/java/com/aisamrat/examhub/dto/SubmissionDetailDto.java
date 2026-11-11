package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.CertificateGrade;
import com.aisamrat.examhub.enums.EvaluationStatus;

import java.time.Instant;
import java.util.List;

public record SubmissionDetailDto(
        Long submissionId,
        String attemptUuid,
        String employeeName,
        String employeeCode,
        String department,
        String subject,
        String setName,
        Double originalScore,
        Double finalScore,
        Double maxScore,
        Double percentage,
        boolean isPassed,
        CertificateGrade grade,
        EvaluationStatus evaluationStatus,
        Instant startedAt,
        Instant submittedAt,
        Long durationSecondsTaken,
        Double integrityScore,
        Integer tabSwitchViolations,
        Integer fullscreenExitViolations,
        String reviewedBy,
        Instant reviewedAt,
        String remarks,
        List<QuestionReviewDto> reviews,
        List<EvaluationAuditDto> audits
) {}

