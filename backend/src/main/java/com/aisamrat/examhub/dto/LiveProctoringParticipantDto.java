package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.AttemptStatus;

public record LiveProctoringParticipantDto(
        String attemptUuid,
        String employeeName,
        String employeeCode,
        String department,
        String subject,
        String setName,
        AttemptStatus status,
        Long remainingSeconds,
        Integer totalQuestions,
        Integer answeredCount,
        boolean webcamActive,
        boolean screenShareActive,
        Integer tabSwitchCount,
        Integer fullscreenExitCount,
        Double integrityScore,
        Long lastHeartbeatSecondsAgo,
        boolean isConnected
) {}

