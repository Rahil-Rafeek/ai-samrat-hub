package com.aisamrat.examhub.dto;

import java.util.List;
import java.util.Map;

public record SkillMatrixDto(
        String employeeCode,
        String fullName,
        String department,
        Map<String, SubjectSkillDetail> subjectProficiencies,
        List<String> topStrengths,
        List<String> identifiedSkillGaps,
        List<TrainingRecommendation> recommendations,
        Double overallProficiencyScore
) {
    public record SubjectSkillDetail(
            String subject,
            Double latestScore,
            Double previousScore,
            Double percentage,
            String proficiencyLevel, // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
            int assessmentsTaken,
            String trend // IMPROVING, STABLE, NEEDS_ATTENTION
    ) {}

    public record TrainingRecommendation(
            String subject,
            String topic,
            String rationale,
            String priority // HIGH, MEDIUM, LOW
    ) {}
}

