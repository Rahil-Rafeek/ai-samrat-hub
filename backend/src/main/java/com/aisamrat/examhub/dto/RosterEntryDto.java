package com.aisamrat.examhub.dto;

public record RosterEntryDto(
        Long id,
        String fullName,
        String email,
        String source,
        boolean needsReview,
        String reviewReason,
        String suggestedEmployeeId,
        String department,
        String designation
) {}

