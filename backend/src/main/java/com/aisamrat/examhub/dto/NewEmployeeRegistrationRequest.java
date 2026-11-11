package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.ExamEligibility;

public record NewEmployeeRegistrationRequest(
        String fullName,
        String email,
        String department,
        String designation,
        String phone,
        String joiningDate,
        ExamEligibility examEligibility,
        String assignedExamIds
) {}

