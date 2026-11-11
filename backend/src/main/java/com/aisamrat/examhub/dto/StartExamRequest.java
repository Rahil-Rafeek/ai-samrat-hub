package com.aisamrat.examhub.dto;

public record StartExamRequest(
        Long examinationId,
        String subject,
        String setName // "A" or "B" or null (null randomly assigns)
) {}

