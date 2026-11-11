package com.aisamrat.examhub.dto;

import java.util.List;

public record CodeExecutionRequest(
        String language,
        String code,
        String problemId,
        String customInput
) {
    public record TestCaseResult(
            String name,
            String input,
            String expectedOutput,
            String actualOutput,
            boolean passed,
            long executionTimeMs
    ) {}
}

