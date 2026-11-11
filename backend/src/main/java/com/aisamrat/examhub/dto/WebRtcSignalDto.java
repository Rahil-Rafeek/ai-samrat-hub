package com.aisamrat.examhub.dto;

public record WebRtcSignalDto(
        String targetAttemptUuid,
        String senderRole, // "EMPLOYEE" or "PROCTOR"
        String type,       // "OFFER", "ANSWER", "CANDIDATE", "PING"
        String sdp,
        Object candidate
) {}

