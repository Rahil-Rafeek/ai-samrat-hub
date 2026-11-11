package com.aisamrat.examhub.service;

import com.aisamrat.examhub.dto.*;
import com.aisamrat.examhub.entity.*;
import com.aisamrat.examhub.enums.*;
import com.aisamrat.examhub.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class ExaminationEngineService {

    private static final Logger log = LoggerFactory.getLogger(ExaminationEngineService.class);

    private final ExaminationRepository examinationRepository;
    private final ExaminationAttemptRepository attemptRepository;
    private final AttemptQuestionRepository attemptQuestionRepository;
    private final QuestionRepository questionRepository;
    private final EmployeeRepository employeeRepository;
    private final SubmissionRepository submissionRepository;
    private final IntegrityEventRepository integrityEventRepository;
    private final CertificateService certificateService;
    private final SimpMessagingTemplate messagingTemplate;
    private final SecureRandom secureRandom = new SecureRandom();

    public ExaminationEngineService(
            ExaminationRepository examinationRepository,
            ExaminationAttemptRepository attemptRepository,
            AttemptQuestionRepository attemptQuestionRepository,
            QuestionRepository questionRepository,
            EmployeeRepository employeeRepository,
            SubmissionRepository submissionRepository,
            IntegrityEventRepository integrityEventRepository,
            CertificateService certificateService,
            SimpMessagingTemplate messagingTemplate) {
        this.examinationRepository = examinationRepository;
        this.attemptRepository = attemptRepository;
        this.attemptQuestionRepository = attemptQuestionRepository;
        this.questionRepository = questionRepository;
        this.employeeRepository = employeeRepository;
        this.submissionRepository = submissionRepository;
        this.integrityEventRepository = integrityEventRepository;
        this.certificateService = certificateService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Starts a new exam or resumes an active exam attempt.
     * IDEMPOTENT: Never regenerates questions/shuffling on refresh!
     */
    @Transactional
    public ActiveExamResponse startOrResumeExam(Long employeeId, StartExamRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));

        Examination exam;
        if (request.examinationId() != null) {
            exam = examinationRepository.findById(request.examinationId())
                    .orElseThrow(() -> new IllegalArgumentException("Examination not found with ID: " + request.examinationId()));
        } else if (request.subject() != null) {
            String setChoice = (request.setName() != null && !request.setName().isBlank()) ? request.setName().toUpperCase() : "A";
            String code = request.subject().replace(" ", "_").toUpperCase() + "_EXAM_" + setChoice;
            exam = examinationRepository.findByCode(code)
                    .orElseGet(() -> examinationRepository.findBySubject(request.subject()).stream()
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("No examination available for subject: " + request.subject())));
        } else {
            throw new IllegalArgumentException("Either examinationId or subject must be provided");
        }

        Instant now = Instant.now();

        // 1. Check for existing active attempt
        Optional<ExaminationAttempt> existingOpt = attemptRepository.findActiveAttempt(employee.getId(), exam.getId());
        if (existingOpt.isPresent()) {
            ExaminationAttempt existing = existingOpt.get();

            // If time expired, auto-submit
            if (now.isAfter(existing.getExpectedEndTime())) {
                submitExamInternal(existing, "Auto-submitted: Examination time expired.");
                return buildActiveExamResponse(existing, now);
            }

            // Update heartbeat and return existing snapshot
            existing.setLastHeartbeatAt(now);
            attemptRepository.save(existing);
            return buildActiveExamResponse(existing, now);
        }

        // 2. Create NEW Attempt with Backend-side Randomization
        String assignedSet = request.setName();
        if (assignedSet == null || (!assignedSet.equalsIgnoreCase("A") && !assignedSet.equalsIgnoreCase("B"))) {
            // Randomly assign Set A or Set B
            assignedSet = secureRandom.nextBoolean() ? "A" : "B";
        } else {
            assignedSet = assignedSet.toUpperCase();
        }

        List<Question> pool = questionRepository.findBySubjectAndSetName(exam.getSubject(), assignedSet);
        if (pool.isEmpty()) {
            // Fallback to all questions for subject if set-specific is empty
            pool = questionRepository.findBySubject(exam.getSubject());
        }

        if (pool.size() < 50) {
            throw new IllegalStateException("Question bank has insufficient questions for " + exam.getSubject() + " Set " + assignedSet + " (Available: " + pool.size() + ", Required: 50)");
        }

        // Shuffle Question order independently
        List<Question> randomizedQuestions = new ArrayList<>(pool);
        Collections.shuffle(randomizedQuestions, secureRandom);
        if (randomizedQuestions.size() > 50) {
            randomizedQuestions = randomizedQuestions.subList(0, 50);
        }

        ExaminationAttempt attempt = new ExaminationAttempt();
        attempt.setAttemptUuid(UUID.randomUUID().toString());
        attempt.setExamination(exam);
        attempt.setEmployee(employee);
        attempt.setAssignedSet(assignedSet);
        attempt.setStatus(AttemptStatus.IN_PROGRESS);
        attempt.setStartedAt(now);
        attempt.setExpectedEndTime(now.plusSeconds((long) exam.getDurationMinutes() * 60));
        attempt.setTotalQuestions(50);
        attempt.setAnsweredCount(0);
        attempt.setTabSwitchViolations(0);
        attempt.setFullscreenExitViolations(0);
        attempt.setIntegrityScore(100.0);
        attempt.setLastHeartbeatAt(now);

        attempt = attemptRepository.save(attempt);

        // Build randomized AttemptQuestions
        List<AttemptQuestion> attemptQuestions = new ArrayList<>();
        int order = 1;
        for (Question q : randomizedQuestions) {
            AttemptQuestion aq = new AttemptQuestion();
            aq.setAttempt(attempt);
            aq.setQuestion(q);
            aq.setDisplayOrder(order++);

            // Shuffle Options A, B, C, D independently while preserving correct mapping
            Map<String, String> originalOptions = new LinkedHashMap<>();
            originalOptions.put("A", q.getOptionA());
            originalOptions.put("B", q.getOptionB());
            originalOptions.put("C", q.getOptionC());
            originalOptions.put("D", q.getOptionD());

            String correctText = originalOptions.get(q.getCorrectOption());

            List<String> shuffledTexts = new ArrayList<>(originalOptions.values());
            Collections.shuffle(shuffledTexts, secureRandom);

            aq.setOptionAText(shuffledTexts.get(0));
            aq.setOptionBText(shuffledTexts.get(1));
            aq.setOptionCText(shuffledTexts.get(2));
            aq.setOptionDText(shuffledTexts.get(3));

            // Find which letter corresponds to correctText in shuffled options
            String correctOptionDisplay = "A";
            if (shuffledTexts.get(0).equals(correctText)) correctOptionDisplay = "A";
            else if (shuffledTexts.get(1).equals(correctText)) correctOptionDisplay = "B";
            else if (shuffledTexts.get(2).equals(correctText)) correctOptionDisplay = "C";
            else if (shuffledTexts.get(3).equals(correctText)) correctOptionDisplay = "D";

            aq.setCorrectOptionDisplay(correctOptionDisplay);
            aq.setVisited(false);
            aq.setMarkedForReview(false);
            aq.setSelectedOption(null);

            attemptQuestions.add(aq);
        }

        attemptQuestionRepository.saveAll(attemptQuestions);
        attempt.setAttemptQuestions(attemptQuestions);

        // Notify proctors of new participant via WebSocket
        broadcastProctoringUpdate(attempt);

        log.info("Created new randomized attempt {} for employee {} (Exam: {}, Set: {})",
                attempt.getAttemptUuid(), employee.getEmployeeCode(), exam.getCode(), assignedSet);

        return buildActiveExamResponse(attempt, now);
    }

    /**
     * Autosaves answer and interaction state immediately.
     */
    @Transactional
    public void autosaveAnswer(String attemptUuid, AutosaveAnswerRequest request) {
        ExaminationAttempt attempt = attemptRepository.findByAttemptUuid(attemptUuid)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found: " + attemptUuid));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new IllegalStateException("Attempt is not in progress (Current status: " + attempt.getStatus() + ")");
        }

        AttemptQuestion aq = attemptQuestionRepository.findByAttemptIdAndDisplayOrder(attempt.getId(), request.displayOrder())
                .orElseThrow(() -> new IllegalArgumentException("Question not found at order: " + request.displayOrder()));

        if (request.selectedOption() != null) {
            String opt = request.selectedOption().trim().toUpperCase();
            if (opt.matches("^[A-D]$")) {
                aq.setSelectedOption(opt);
                aq.setAnsweredAt(Instant.now());
            } else if (opt.isEmpty()) {
                aq.setSelectedOption(null);
            }
        } else if (Boolean.TRUE.equals(request.isVisited()) && request.selectedOption() == null) {
            // Only visited or cleared
            if (aq.getSelectedOption() != null && request.displayOrder() != null) {
                // If caller explicitly sent null, clear selection
                aq.setSelectedOption(null);
            }
        }

        if (request.isMarkedForReview() != null) {
            aq.setMarkedForReview(request.isMarkedForReview());
        }

        if (request.isVisited() != null) {
            aq.setVisited(request.isVisited());
        }

        attemptQuestionRepository.save(aq);

        // Update attempt answered count and heartbeat
        long answeredCount = attemptQuestionRepository.countAnsweredByAttemptId(attempt.getId());
        attempt.setAnsweredCount((int) answeredCount);
        attempt.setLastHeartbeatAt(Instant.now());
        attemptRepository.save(attempt);

        // Update live proctoring wall
        broadcastProctoringUpdate(attempt);
    }

    /**
     * Heartbeat ping to verify connectivity.
     */
    @Transactional
    public Map<String, Object> heartbeat(String attemptUuid) {
        ExaminationAttempt attempt = attemptRepository.findByAttemptUuid(attemptUuid)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found: " + attemptUuid));

        Instant now = Instant.now();
        attempt.setLastHeartbeatAt(now);

        long remainingSeconds = Math.max(0, Duration.between(now, attempt.getExpectedEndTime()).getSeconds());
        if (remainingSeconds == 0 && attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            submitExamInternal(attempt, "Auto-submitted on heartbeat: Timer expired.");
        } else {
            attemptRepository.save(attempt);
        }

        broadcastProctoringUpdate(attempt);

        return Map.of(
                "status", attempt.getStatus().name(),
                "remainingSeconds", remainingSeconds,
                "serverTime", now.toString()
        );
    }

    /**
     * Records violation events (Tab switch, Fullscreen exit, Media disconnections).
     * Implements 3 Warnings + 4th Violation Auto-Termination policy.
     */
    @Transactional
    public Map<String, Object> recordViolation(String attemptUuid, ProctoringEventDto dto) {
        ExaminationAttempt attempt = attemptRepository.findByAttemptUuid(attemptUuid)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found: " + attemptUuid));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            return Map.of("status", attempt.getStatus().name(), "terminated", true);
        }

        int violationNum = 1;
        boolean shouldTerminate = false;
        String warningMessage = "";

        int limit = (attempt.getExamination() != null && attempt.getExamination().getTabSwitchLimit() != null)
                ? attempt.getExamination().getTabSwitchLimit() : 3;

        int current = attempt.getTabSwitchViolations() + 1;
        attempt.setTabSwitchViolations(current);
        violationNum = current;

        double penalty = 8.0;
        String violationDesc = "Security violation";

        switch (dto.eventType()) {
            case TAB_SWITCH -> {
                violationDesc = "Navigated away or switched browser window";
                penalty = 8.0;
            }
            case FULLSCREEN_EXIT -> {
                violationDesc = "Exited full-screen examination mode";
                penalty = 8.0;
                attempt.setFullscreenExitViolations(attempt.getFullscreenExitViolations() + 1);
            }
            case FACE_NOT_DETECTED -> {
                violationDesc = "Candidate face not detected in camera frame";
                penalty = 7.0;
            }
            case UNUSUAL_MOVEMENT -> {
                violationDesc = "Looking away or unusual head movement detected";
                penalty = 6.0;
            }
            case MULTIPLE_FACES_DETECTED -> {
                violationDesc = "Multiple faces detected in camera frame";
                penalty = 10.0;
            }
            default -> {
                violationDesc = dto.message() != null ? dto.message() : "Integrity alert recorded";
                penalty = 5.0;
            }
        }

        attempt.setIntegrityScore(Math.max(0, attempt.getIntegrityScore() - penalty));

        if (current < limit) {
            warningMessage = "WARNING " + current + "/" + limit + ": " + violationDesc + ". Remaining warnings: " + (limit - current) + ".";
        } else if (current == limit) {
            warningMessage = "FINAL WARNING " + limit + "/" + limit + ": " + violationDesc + ". This is your final warning (" + limit + "/" + limit + ")! Any further malpractice will immediately terminate your examination.";
        } else {
            shouldTerminate = true;
            warningMessage = "EXAMINATION TERMINATED: Repeated malpractice violations exceeded maximum limit of " + limit + " warnings (" + violationDesc + ").";
        }

        // Save event to permanent audit log
        IntegrityEvent event = new IntegrityEvent(
                attempt,
                dto.eventType(),
                violationNum,
                dto.message() != null ? dto.message() : warningMessage,
                dto.metadata()
        );
        integrityEventRepository.save(event);

        if (shouldTerminate) {
            attempt.setStatus(AttemptStatus.TERMINATED_VIOLATION);
            attempt.setTerminationReason(warningMessage);
            submitExamInternal(attempt, warningMessage);
        } else {
            attemptRepository.save(attempt);
        }

        // Broadcast alert to admin proctoring wall
        broadcastViolationAlert(attempt, event, warningMessage);

        return Map.of(
                "violationNumber", violationNum,
                "warningMessage", warningMessage,
                "isTerminated", shouldTerminate,
                "currentStatus", attempt.getStatus().name(),
                "integrityScore", attempt.getIntegrityScore()
        );
    }

    /**
     * Submits examination, computes final score, saves permanent submission,
     * and triggers automated certificate issuance if passing criteria met.
     */
    @Transactional
    public SubmitExamResponse submitExam(String attemptUuid) {
        ExaminationAttempt attempt = attemptRepository.findByAttemptUuid(attemptUuid)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found: " + attemptUuid));

        if (attempt.getStatus() == AttemptStatus.SUBMITTED || attempt.getStatus() == AttemptStatus.TERMINATED_VIOLATION) {
            Submission existing = submissionRepository.findByAttemptId(attempt.getId()).orElse(null);
            if (existing != null) {
                return buildSubmitExamResponse(attempt, existing);
            }
        }

        Submission submission = submitExamInternal(attempt, "Normal employee submission.");
        return buildSubmitExamResponse(attempt, submission);
    }

    private Submission submitExamInternal(ExaminationAttempt attempt, String remarks) {
        Instant now = Instant.now();
        List<AttemptQuestion> questions = attemptQuestionRepository.findByAttemptIdOrderByDisplayOrderAsc(attempt.getId());

        double totalScore = 0.0;
        int answered = 0;

        for (AttemptQuestion aq : questions) {
            if (aq.getSelectedOption() != null && !aq.getSelectedOption().isBlank()) {
                answered++;
                boolean isCorrect = aq.getSelectedOption().equalsIgnoreCase(aq.getCorrectOptionDisplay());
                aq.setCorrect(isCorrect);
                if (isCorrect) {
                    double marks = aq.getQuestion().getMarks() != null ? aq.getQuestion().getMarks() : 2.0;
                    aq.setMarksAwarded(marks);
                    totalScore += marks;
                } else {
                    aq.setMarksAwarded(0.0);
                }
            } else {
                aq.setCorrect(false);
                aq.setMarksAwarded(0.0);
            }
        }
        attemptQuestionRepository.saveAll(questions);

        double maxScore = attempt.getExamination().getTotalMarks();
        double percentage = (totalScore / maxScore) * 100.0;
        boolean passed = percentage >= attempt.getExamination().getPassingPercentage();

        if (attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            attempt.setStatus(AttemptStatus.SUBMITTED);
        }
        attempt.setSubmittedAt(now);
        attempt.setDurationSecondsTaken(Duration.between(attempt.getStartedAt(), now).getSeconds());
        attempt.setMarksAwarded(totalScore);
        attempt.setPercentage(percentage);
        attempt.setPassed(passed);
        attempt.setAnsweredCount(answered);
        attemptRepository.save(attempt);

        // Create or Update Permanent Immutable Submission record
        Submission submission = submissionRepository.findByAttemptId(attempt.getId()).orElseGet(Submission::new);
        submission.setAttempt(attempt);
        submission.setEmployee(attempt.getEmployee());
        submission.setSubject(attempt.getExamination().getSubject());
        submission.setSetName(attempt.getAssignedSet());
        submission.setOriginalScore(totalScore);
        submission.setFinalScore(totalScore);
        submission.setMaxScore(maxScore);
        submission.setPercentage(percentage);
        submission.setEvaluationStatus(EvaluationStatus.APPROVED);
        submission.setReviewedBy("System Automated Evaluator");
        submission.setReviewedAt(now);
        submission.setRemarks(remarks);
        submission = submissionRepository.save(submission);

        // Generate Certificate if passed
        if (passed) {
            try {
                certificateService.generateCertificateForSubmission(submission);
            } catch (Exception e) {
                log.error("Failed to generate certificate for submission {}: {}", submission.getId(), e.getMessage(), e);
            }
        }

        // Broadcast to proctors
        broadcastProctoringUpdate(attempt);

        log.info("Submitted attempt {} - Score: {}/{} ({}%) Passed: {}",
                attempt.getAttemptUuid(), totalScore, maxScore, percentage, passed);

        return submission;
    }

    /**
     * Automatic submission background daemon for expired attempts.
     */
    @Scheduled(fixedRate = 15000)
    @Transactional
    public void autoSubmitExpiredExams() {
        Instant now = Instant.now();
        List<ExaminationAttempt> expired = attemptRepository.findExpiredActiveAttempts(now);
        for (ExaminationAttempt attempt : expired) {
            try {
                log.info("Auto-submitting expired exam attempt: {}", attempt.getAttemptUuid());
                submitExamInternal(attempt, "Automatically submitted by system: 60-minute duration expired.");
            } catch (Exception e) {
                log.error("Error auto-submitting attempt {}: {}", attempt.getAttemptUuid(), e.getMessage());
            }
        }
    }

    private ActiveExamResponse buildActiveExamResponse(ExaminationAttempt attempt, Instant now) {
        long remaining = Math.max(0, Duration.between(now, attempt.getExpectedEndTime()).getSeconds());
        List<AttemptQuestion> questions = attemptQuestionRepository.findByAttemptIdOrderByDisplayOrderAsc(attempt.getId());

        int answered = 0;
        int marked = 0;
        List<QuestionDisplayDto> dtos = new ArrayList<>();

        for (AttemptQuestion aq : questions) {
            if (aq.getSelectedOption() != null && !aq.getSelectedOption().isBlank()) {
                answered++;
            }
            if (aq.isMarkedForReview()) {
                marked++;
            }

            Map<String, String> opts = new LinkedHashMap<>();
            opts.put("A", aq.getOptionAText());
            opts.put("B", aq.getOptionBText());
            opts.put("C", aq.getOptionCText());
            opts.put("D", aq.getOptionDText());

            // STRICT SECURITY: Do NOT expose correctOption or explanation!
            dtos.add(new QuestionDisplayDto(
                    aq.getDisplayOrder(),
                    aq.getQuestion().getQuestionCode(),
                    aq.getQuestion().getSubject(),
                    aq.getQuestion().getTopic(),
                    aq.getQuestion().getDifficulty().name(),
                    aq.getQuestion().getQuestionText(),
                    opts,
                    aq.getSelectedOption(),
                    aq.isMarkedForReview(),
                    aq.isVisited()
            ));
        }

        int unanswered = attempt.getTotalQuestions() - answered;

        return new ActiveExamResponse(
                attempt.getAttemptUuid(),
                attempt.getEmployee().getUser().getFullName(),
                attempt.getEmployee().getEmployeeCode(),
                attempt.getExamination().getSubject(),
                attempt.getAssignedSet(),
                attempt.getStatus(),
                attempt.getExamination().getDurationMinutes(),
                remaining,
                attempt.getStartedAt(),
                attempt.getExpectedEndTime(),
                attempt.getTotalQuestions(),
                answered,
                marked,
                unanswered,
                attempt.getExamination().getMarksPerQuestion(),
                attempt.getExamination().getTotalMarks(),
                dtos,
                attempt.getExamination().getProctoringMode(),
                attempt.getExamination().getTabSwitchLimit(),
                attempt.getExamination().getFullscreenExitLimit(),
                attempt.getTabSwitchViolations(),
                attempt.getFullscreenExitViolations()
        );
    }

    private SubmitExamResponse buildSubmitExamResponse(ExaminationAttempt attempt, Submission submission) {
        CertificateGrade grade = CertificateGrade.fromPercentage(submission.getPercentage());
        String certCode = null;
        if (attempt.getPassed()) {
            certCode = certificateService.getCertificateCodeForAttempt(attempt.getId());
        }

        return new SubmitExamResponse(
                attempt.getAttemptUuid(),
                attempt.getStatus(),
                submission.getFinalScore(),
                submission.getMaxScore(),
                submission.getPercentage(),
                attempt.getPassed(),
                grade,
                grade.getDisplayName(),
                certCode,
                attempt.getTerminationReason() != null ? attempt.getTerminationReason() : "Examination submitted successfully."
        );
    }

    private void broadcastProctoringUpdate(ExaminationAttempt attempt) {
        try {
            long remaining = Math.max(0, Duration.between(Instant.now(), attempt.getExpectedEndTime()).getSeconds());
            long hbSecsAgo = Duration.between(attempt.getLastHeartbeatAt(), Instant.now()).getSeconds();

            LiveProctoringParticipantDto dto = new LiveProctoringParticipantDto(
                    attempt.getAttemptUuid(),
                    attempt.getEmployee().getUser().getFullName(),
                    attempt.getEmployee().getEmployeeCode(),
                    attempt.getEmployee().getDepartment(),
                    attempt.getExamination().getSubject(),
                    attempt.getAssignedSet(),
                    attempt.getStatus(),
                    remaining,
                    attempt.getTotalQuestions(),
                    attempt.getAnsweredCount(),
                    true, // webcam
                    true, // screen
                    attempt.getTabSwitchViolations(),
                    attempt.getFullscreenExitViolations(),
                    attempt.getIntegrityScore(),
                    hbSecsAgo,
                    hbSecsAgo < 60
            );

            messagingTemplate.convertAndSend("/topic/proctoring/participants", dto);
        } catch (Exception e) {
            log.debug("WebSocket broadcast error: {}", e.getMessage());
        }
    }

    private void broadcastViolationAlert(ExaminationAttempt attempt, IntegrityEvent event, String warning) {
        try {
            Map<String, Object> alert = Map.of(
                    "attemptUuid", attempt.getAttemptUuid(),
                    "employeeName", attempt.getEmployee().getUser().getFullName(),
                    "employeeCode", attempt.getEmployee().getEmployeeCode(),
                    "eventType", event.getEventType().name(),
                    "violationNumber", event.getViolationNumber(),
                    "message", warning,
                    "timestamp", event.getTimestamp().toString(),
                    "integrityScore", attempt.getIntegrityScore(),
                    "status", attempt.getStatus().name()
            );
            messagingTemplate.convertAndSend("/topic/proctoring/alerts", alert);
        } catch (Exception e) {
            log.debug("WebSocket alert error: {}", e.getMessage());
        }
    }
}

