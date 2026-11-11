package com.aisamrat.examhub.dto;

public record CandidateSelfRegistrationRequest(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String semester,
        String stream,
        String password
) {}

