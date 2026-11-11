package com.aisamrat.examhub.dto;

import java.util.List;
import java.util.Map;

public record IntelligenceSummaryDto(
        Map<String, Double> subjectAccuracyRate,
        Map<String, Integer> subjectAttemptsCount,
        Map<String, Double> difficultyPassRate,
        Map<String, Double> departmentAverageScores,
        List<QuestionDifficultyInsight> problematicQuestions,
        List<StrategicTrainingNeed> globalTrainingNeeds,
        int totalAssessmentsAnalyzed,
        Double organizationSkillHealthIndex
) {
    public record QuestionDifficultyInsight(
            String questionCode,
            String subject,
            String topic,
            String difficulty,
            Double failureRate,
            String recommendation
    ) {}

    public record StrategicTrainingNeed(
            String domain,
            String department,
            int affectedEmployees,
            String recommendedCurriculum
    ) {}
}

