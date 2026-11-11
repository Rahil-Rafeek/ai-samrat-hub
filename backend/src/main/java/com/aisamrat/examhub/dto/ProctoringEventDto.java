package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.IntegrityEventType;

public record ProctoringEventDto(
        String attemptUuid,
        IntegrityEventType eventType,
        Integer violationNumber,
        String message,
        String metadata
) {}

