package com.aisamrat.examhub.dto;

import java.util.Map;

/**
 * Question presentation object for active examination.
 * STRICT SECURITY: Never exposes correct option, explanation, or scoring status.
 */
public record QuestionDisplayDto(
        Integer displayOrder,
        String questionCode,
        String subject,
        String topic,
        String difficulty,
        String questionText,
        Map<String, String> options, // {"A": text, "B": text, "C": text, "D": text}
        String selectedOption, // "A", "B", "C", "D" or null
        boolean isMarkedForReview,
        boolean isVisited
) {}

