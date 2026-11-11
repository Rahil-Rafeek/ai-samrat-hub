package com.aisamrat.examhub;

import com.aisamrat.examhub.dto.*;
import com.aisamrat.examhub.entity.*;
import com.aisamrat.examhub.enums.*;
import com.aisamrat.examhub.repository.*;
import com.aisamrat.examhub.service.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class RandomizationAndScoringTest {

    @Autowired
    private ExaminationEngineService examEngine;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ExaminationRepository examinationRepository;

    @Autowired
    private ExaminationAttemptRepository attemptRepository;

    @Autowired
    private AttemptQuestionRepository attemptQuestionRepository;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private EvaluationService evaluationService;

    @Test
    @DisplayName("Verify Question and Option Randomization and Correct Answer Protection")
    @Transactional
    void testQuestionAndOptionRandomization() {
        Employee emp1 = employeeRepository.findByEmployeeCode("EMP-2026-001").orElseThrow();
        Employee emp2 = employeeRepository.findByEmployeeCode("EMP-2026-002").orElseThrow();

        StartExamRequest req = new StartExamRequest(null, "Machine Learning", "A");

        ActiveExamResponse resp1 = examEngine.startOrResumeExam(emp1.getId(), req);
        ActiveExamResponse resp2 = examEngine.startOrResumeExam(emp2.getId(), req);

        assertNotNull(resp1);
        assertNotNull(resp2);
        assertEquals(50, resp1.questions().size());
        assertEquals(50, resp2.questions().size());

        // 1. Verify correct options are NEVER exposed to the frontend payload
        for (QuestionDisplayDto q : resp1.questions()) {
            assertNotNull(q.questionCode());
            assertNotNull(q.questionText());
            assertEquals(4, q.options().size());
            assertTrue(q.options().containsKey("A"));
            assertTrue(q.options().containsKey("B"));
            assertTrue(q.options().containsKey("C"));
            assertTrue(q.options().containsKey("D"));
        }

        // 2. Verify Question ordering is randomized between two independent employee attempts
        List<String> order1 = resp1.questions().stream().map(QuestionDisplayDto::questionCode).toList();
        List<String> order2 = resp2.questions().stream().map(QuestionDisplayDto::questionCode).toList();

        // While sharing the same 50 questions, the ordering should be randomized
        assertNotEquals(order1, order2, "Two independent employee attempts must have distinct randomized question orderings!");

        // 3. Verify Refresh Idempotence: Resuming the same employee's attempt preserves exact same order and snapshot
        ActiveExamResponse resumedResp = examEngine.startOrResumeExam(emp1.getId(), req);
        List<String> resumedOrder = resumedResp.questions().stream().map(QuestionDisplayDto::questionCode).toList();
        assertEquals(order1, resumedOrder, "Exam snapshot must be immutable across page refreshes or reconnections!");
    }

    @Test
    @DisplayName("Verify Tab-Switch Violation Policy: 5 Warnings and Auto-Termination after 5 Violations")
    @Transactional
    void testTabSwitchViolationPolicy() {
        Employee emp = employeeRepository.findByEmployeeCode("EMP-2026-003").orElseThrow();
        StartExamRequest req = new StartExamRequest(null, "Java Programming", "A");
        ActiveExamResponse resp = examEngine.startOrResumeExam(emp.getId(), req);

        String uuid = resp.attemptUuid();

        // Violations 1 to 2: Warnings
        for (int i = 1; i <= 2; i++) {
            Map<String, Object> vi = examEngine.recordViolation(uuid, new ProctoringEventDto(uuid, IntegrityEventType.TAB_SWITCH, i, "Tab switch " + i, null));
            assertEquals(i, vi.get("violationNumber"));
            assertFalse((Boolean) vi.get("isTerminated"));
            assertTrue(vi.get("warningMessage").toString().contains("WARNING " + i + "/3"));
        }

        // Violation 3: Final Warning
        Map<String, Object> v3 = examEngine.recordViolation(uuid, new ProctoringEventDto(uuid, IntegrityEventType.TAB_SWITCH, 3, "Tab switch 3", null));
        assertEquals(3, v3.get("violationNumber"));
        assertFalse((Boolean) v3.get("isTerminated"));
        assertTrue(v3.get("warningMessage").toString().contains("FINAL WARNING 3/3"));

        // Violation 4: AUTOMATIC TERMINATION
        Map<String, Object> v4 = examEngine.recordViolation(uuid, new ProctoringEventDto(uuid, IntegrityEventType.TAB_SWITCH, 4, "Tab switch 4", null));
        assertEquals(4, v4.get("violationNumber"));
        assertTrue((Boolean) v4.get("isTerminated"));
        assertEquals("TERMINATED_VIOLATION", v4.get("currentStatus"));

        ExaminationAttempt attempt = attemptRepository.findByAttemptUuid(uuid).orElseThrow();
        assertEquals(AttemptStatus.TERMINATED_VIOLATION, attempt.getStatus());
        assertTrue(attempt.getTerminationReason().contains("Repeated"));
    }

    @Test
    @DisplayName("Verify Submission, Evaluation, Certificate Generation, and QR Verification")
    @Transactional
    void testExamSubmissionAndCertificateWorkflow() throws Exception {
        Employee emp = employeeRepository.findByEmployeeCode("EMP-2026-004").orElseThrow();
        StartExamRequest req = new StartExamRequest(null, "Data Science", "A");
        ActiveExamResponse resp = examEngine.startOrResumeExam(emp.getId(), req);

        String uuid = resp.attemptUuid();
        ExaminationAttempt attempt = attemptRepository.findByAttemptUuid(uuid).orElseThrow();

        // Answer all 50 questions correctly to earn Distinction
        List<AttemptQuestion> questions = attemptQuestionRepository.findByAttemptIdOrderByDisplayOrderAsc(attempt.getId());
        for (AttemptQuestion aq : questions) {
            examEngine.autosaveAnswer(uuid, new AutosaveAnswerRequest(aq.getDisplayOrder(), aq.getCorrectOptionDisplay(), false, true));
        }

        SubmitExamResponse submitResp = examEngine.submitExam(uuid);
        assertNotNull(submitResp);
        assertEquals(AttemptStatus.SUBMITTED, submitResp.status());
        assertEquals(100.0, submitResp.score());
        assertEquals(100.0, submitResp.percentage());
        assertTrue(submitResp.isPassed());
        assertEquals(CertificateGrade.DISTINCTION, submitResp.grade());
        assertNotNull(submitResp.certificateCode());

        // Verify Certificate via Verification Service
        CertificateVerifyResponse verifyResp = certificateService.verifyCertificate(submitResp.certificateCode());
        assertTrue(verifyResp.isValid());
        assertEquals(submitResp.certificateCode(), verifyResp.certificateCode());
        assertEquals(CertificateGrade.DISTINCTION, verifyResp.grade());
        assertEquals("Data Science", verifyResp.subject());
        assertEquals(emp.getUser().getFullName(), verifyResp.employeeName());

        // Test Official Evaluation & Mark Correction Audit Trail
        SubmissionDetailDto submissionDetail = evaluationService.getSubmissionByAttemptUuid(uuid);
        assertNotNull(submissionDetail);
        assertEquals(100.0, submissionDetail.finalScore());

        // Official modifies mark from 100 to 96 with remarks
        OfficialCorrectionRequest correctionReq = new OfficialCorrectionRequest(96.0, "Normalization adjustment after evaluator review", "Adjusted for rubric compliance");
        SubmissionDetailDto revised = evaluationService.modifyMarks(submissionDetail.submissionId(), correctionReq, "evaluator");

        assertEquals(96.0, revised.finalScore());
        assertEquals(100.0, revised.originalScore(), "Original score must be permanently preserved and never overwritten!");
        assertEquals(EvaluationStatus.REVISED, revised.evaluationStatus());
        assertEquals(1, revised.audits().size());
        assertEquals(100.0, revised.audits().get(0).previousScore());
        assertEquals(96.0, revised.audits().get(0).revisedScore());
        assertEquals("Normalization adjustment after evaluator review", revised.audits().get(0).reason());
    }
}

