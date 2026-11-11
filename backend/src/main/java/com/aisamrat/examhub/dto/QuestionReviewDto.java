package com.aisamrat.examhub.dto;

import java.util.Map;

public record QuestionReviewDto(
        Integer displayOrder,
        String questionCode,
        String subject,
        String topic,
        String difficulty,
        String questionText,
        Map<String, String> options,
        String selectedOption, // What the employee picked
        String correctOption,  // What the correct answer was
        boolean isCorrect,
        Double marksAwarded,
        Double maxMarks,
        String explanation
) {}

