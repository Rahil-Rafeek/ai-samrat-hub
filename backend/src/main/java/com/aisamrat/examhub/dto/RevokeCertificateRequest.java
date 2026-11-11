package com.aisamrat.examhub.dto;

import jakarta.validation.constraints.NotBlank;

public record RevokeCertificateRequest(
        @NotBlank(message = "Revocation reason is required")
        String reason
) {}

