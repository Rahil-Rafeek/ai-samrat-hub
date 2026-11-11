package com.aisamrat.examhub.dto;

import java.util.List;

public record CodeExecutionResponse(
        String status,
        String stdout,
        String stderr,
        long totalExecutionTimeMs,
        int totalTestCases,
        int passedTestCases,
        List<CodeExecutionRequest.TestCaseResult> results,
        String message
) {}

