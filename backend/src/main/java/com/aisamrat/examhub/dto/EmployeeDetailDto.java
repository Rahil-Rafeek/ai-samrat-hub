package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.AccountStatus;
import com.aisamrat.examhub.enums.ExamEligibility;

public record EmployeeDetailDto(
        Long id,
        Long userId,
        String employeeCode,
        String fullName,
        String email,
        String department,
        String designation,
        String phone,
        AccountStatus accountStatus,
        ExamEligibility examEligibility,
        String joiningDate,
        String activationToken,
        String activationUrl,
        boolean isEmailVerified,
        int completedExamsCount,
        Double averageScore,
        String createdAt
) {}

