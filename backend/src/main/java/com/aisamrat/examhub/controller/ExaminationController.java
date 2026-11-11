package com.aisamrat.examhub.controller;

import com.aisamrat.examhub.dto.*;
import com.aisamrat.examhub.entity.Employee;
import com.aisamrat.examhub.entity.Examination;
import com.aisamrat.examhub.entity.ExaminationAttempt;
import com.aisamrat.examhub.entity.User;
import com.aisamrat.examhub.repository.EmployeeRepository;
import com.aisamrat.examhub.repository.ExaminationAttemptRepository;
import com.aisamrat.examhub.repository.ExaminationRepository;
import com.aisamrat.examhub.repository.UserRepository;
import com.aisamrat.examhub.service.ExaminationEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/employee/examinations")
public class ExaminationController {

    private final ExaminationEngineService examEngine;
    private final ExaminationRepository examinationRepository;
    private final ExaminationAttemptRepository attemptRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final com.aisamrat.examhub.service.IntelligenceService intelligenceService;

    public ExaminationController(
            ExaminationEngineService examEngine,
            ExaminationRepository examinationRepository,
            ExaminationAttemptRepository attemptRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            com.aisamrat.examhub.service.IntelligenceService intelligenceService) {
        this.examEngine = examEngine;
        this.examinationRepository = examinationRepository;
        this.attemptRepository = attemptRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.intelligenceService = intelligenceService;
    }

    @GetMapping
    public ResponseEntity<List<Examination>> getAvailableExaminations(Authentication authentication) {
        Employee employee = getEmployeeFromAuth(authentication);
        List<Examination> all = examinationRepository.findByIsActiveTrue();
        
        // If employee has specific assigned exams
        if (employee != null && employee.getAssignedExamIds() != null && !employee.getAssignedExamIds().equals("ALL")) {
            Set<Long> allowedIds = new HashSet<>();
            for (String s : employee.getAssignedExamIds().split(",")) {
                try { allowedIds.add(Long.parseLong(s.trim())); } catch (Exception ignored) {}
            }
            if (!allowedIds.isEmpty()) {
                all = all.stream().filter(e -> allowedIds.contains(e.getId())).toList();
            }
        }
        return ResponseEntity.ok(all);
    }

    @GetMapping("/skill-matrix")
    public ResponseEntity<com.aisamrat.examhub.dto.SkillMatrixDto> getSkillMatrix(Authentication authentication) {
        Employee employee = getEmployeeFromAuth(authentication);
        return ResponseEntity.ok(intelligenceService.getEmployeeSkillMatrix(employee.getId()));
    }

    @PostMapping("/start")
    public ResponseEntity<ActiveExamResponse> startOrResumeExam(
            Authentication authentication,
            @RequestBody StartExamRequest request) {
        Employee employee = getEmployeeFromAuth(authentication);
        return ResponseEntity.ok(examEngine.startOrResumeExam(employee.getId(), request));
    }

    @PostMapping("/{attemptUuid}/autosave")
    public ResponseEntity<Map<String, String>> autosaveAnswer(
            @PathVariable String attemptUuid,
            @RequestBody AutosaveAnswerRequest request) {
        examEngine.autosaveAnswer(attemptUuid, request);
        return ResponseEntity.ok(Map.of("status", "SAVED"));
    }

    @PostMapping("/{attemptUuid}/heartbeat")
    public ResponseEntity<Map<String, Object>> heartbeat(@PathVariable String attemptUuid) {
        return ResponseEntity.ok(examEngine.heartbeat(attemptUuid));
    }

    @PostMapping("/{attemptUuid}/violation")
    public ResponseEntity<Map<String, Object>> recordViolation(
            @PathVariable String attemptUuid,
            @RequestBody ProctoringEventDto dto) {
        return ResponseEntity.ok(examEngine.recordViolation(attemptUuid, dto));
    }

    @PostMapping("/{attemptUuid}/submit")
    public ResponseEntity<SubmitExamResponse> submitExam(@PathVariable String attemptUuid) {
        return ResponseEntity.ok(examEngine.submitExam(attemptUuid));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ExaminationAttempt>> getMyExaminationHistory(Authentication authentication) {
        Employee employee = getEmployeeFromAuth(authentication);
        return ResponseEntity.ok(attemptRepository.findByEmployeeIdOrderByCreatedAtDesc(employee.getId()));
    }

    private Employee getEmployeeFromAuth(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + auth.getName()));
        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Employee profile not found for user: " + auth.getName()));
    }
}

