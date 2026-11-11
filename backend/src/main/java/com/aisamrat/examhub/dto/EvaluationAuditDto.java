package com.aisamrat.examhub.dto;

import java.time.Instant;

public record EvaluationAuditDto(
        Long id,
        String reviewerUsername,
        String reviewerFullName,
        Double previousScore,
        Double revisedScore,
        String reason,
        String remarks,
        Instant timestamp
) {}

