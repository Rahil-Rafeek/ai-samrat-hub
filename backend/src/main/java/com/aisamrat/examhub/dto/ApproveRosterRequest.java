package com.aisamrat.examhub.dto;

import java.util.List;

public record ApproveRosterRequest(
        List<RosterEntryDto> approvedEntries,
        String defaultDepartment
) {}

