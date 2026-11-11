package com.aisamrat.examhub.dto;

public record OfficialCorrectionRequest(
        Double revisedScore,
        String reason,
        String remarks
) {}

