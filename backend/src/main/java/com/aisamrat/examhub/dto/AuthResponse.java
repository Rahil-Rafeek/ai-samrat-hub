package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.Role;

public record AuthResponse(
        String token,
        String username,
        String fullName,
        Role role,
        Long userId,
        Long employeeId,
        String employeeCode,
        String department,
        String designation
) {}

