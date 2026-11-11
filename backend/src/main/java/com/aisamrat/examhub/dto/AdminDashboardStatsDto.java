package com.aisamrat.examhub.dto;

import java.util.List;
import java.util.Map;

public record AdminDashboardStatsDto(
        long totalEmployees,
        long activeExaminations,
        long ongoingExamsCount,
        long completedSubmissions,
        long pendingEvaluations,
        long certificatesIssued,
        Double averageScore,
        Double passPercentage,
        long distinctionCount,
        long activeProctoringAlerts,
        Map<String, Long> subjectWiseCounts,
        Map<String, Double> subjectWiseAvgScores,
        List<Map<String, Object>> scoreDistribution
) {}

