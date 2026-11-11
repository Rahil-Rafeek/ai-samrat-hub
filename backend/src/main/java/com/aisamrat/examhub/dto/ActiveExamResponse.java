package com.aisamrat.examhub.dto;

import com.aisamrat.examhub.enums.AttemptStatus;
import com.aisamrat.examhub.enums.ProctoringMode;

import java.time.Instant;
import java.util.List;

public record ActiveExamResponse(
        String attemptUuid,
        String employeeName,
        String employeeCode,
        String subject,
        String setName,
        AttemptStatus status,
        Integer durationMinutes,
        Long remainingSeconds,
        Instant startedAt,
        Instant expectedEndTime,
        Integer totalQuestions,
        Integer answeredCount,
        Integer markedForReviewCount,
        Integer unansweredCount,
        Double marksPerQuestion,
        Double totalMarks,
        List<QuestionDisplayDto> questions,
        ProctoringMode proctoringMode,
        Integer tabSwitchLimit,
        Integer fullscreenExitLimit,
        Integer currentTabSwitches,
        Integer currentFullscreenExits
) {}

