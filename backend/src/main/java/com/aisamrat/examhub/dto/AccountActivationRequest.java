package com.aisamrat.examhub.dto;

public record AccountActivationRequest(
        String token,
        String password,
        String confirmPassword
) {}

