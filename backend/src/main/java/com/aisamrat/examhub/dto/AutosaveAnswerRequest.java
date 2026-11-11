package com.aisamrat.examhub.dto;

public record AutosaveAnswerRequest(
        Integer displayOrder, // 1 to 50
        String selectedOption, // "A", "B", "C", "D" or null to clear
        Boolean isMarkedForReview,
        Boolean isVisited
) {}

