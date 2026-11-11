package com.aisamrat.examhub.service;

import com.aisamrat.examhub.dto.*;
import com.aisamrat.examhub.entity.*;
import com.aisamrat.examhub.enums.CertificateGrade;
import com.aisamrat.examhub.enums.EvaluationStatus;
import com.aisamrat.examhub.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class EvaluationService {

    private static final Logger log = LoggerFactory.getLogger(EvaluationService.class);

    private final SubmissionRepository submissionRepository;
    private final EvaluationAuditRepository evaluationAuditRepository;
    private final AttemptQuestionRepository attemptQuestionRepository;
    private final UserRepository userRepository;
    private final CertificateService certificateService;
    private final QuestionRepository questionRepository;

    public EvaluationService(
            SubmissionRepository submissionRepository,
            EvaluationAuditRepository evaluationAuditRepository,
            AttemptQuestionRepository attemptQuestionRepository,
            UserRepository userRepository,
            CertificateService certificateService,
            QuestionRepository questionRepository) {
        this.submissionRepository = submissionRepository;
        this.evaluationAuditRepository = evaluationAuditRepository;
        this.attemptQuestionRepository = attemptQuestionRepository;
        this.userRepository = userRepository;
        this.certificateService = certificateService;
        this.questionRepository = questionRepository;
    }

    @Transactional(readOnly = true)
    public List<SubmissionDetailDto> getAllSubmissions(String subject, EvaluationStatus status) {
        List<Submission> list;
        if (subject != null && !subject.isBlank()) {
            list = submissionRepository.findBySubjectOrderByCreatedAtDesc(subject);
        } else if (status != null) {
            list = submissionRepository.findByEvaluationStatus(status);
        } else {
            list = submissionRepository.findAll();
        }

        return list.stream().map(this::mapToDetailDtoBasic).toList();
    }

    @Transactional(readOnly = true)
    public SubmissionDetailDto getSubmissionDetail(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + submissionId));

        return mapToDetailDtoFull(submission);
    }

    @Transactional(readOnly = true)
    public SubmissionDetailDto getSubmissionByAttemptUuid(String attemptUuid) {
        Submission submission = submissionRepository.findAll().stream()
                .filter(s -> s.getAttempt().getAttemptUuid().equals(attemptUuid))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Submission not found for attempt: " + attemptUuid));

        return mapToDetailDtoFull(submission);
    }

    /**
     * Official mark adjustment with mandatory immutable audit record.
     * NEVER overwrites original score!
     */
    @Transactional
    public SubmissionDetailDto modifyMarks(Long submissionId, OfficialCorrectionRequest request, String reviewerUsername) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + submissionId));

        User reviewer = userRepository.findByUsername(reviewerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer user not found: " + reviewerUsername));

        double previousScore = submission.getFinalScore();
        double revisedScore = request.revisedScore();
        if (revisedScore < 0 || revisedScore > submission.getMaxScore()) {
            throw new IllegalArgumentException("Revised score must be between 0 and " + submission.getMaxScore());
        }

        double newPercentage = (revisedScore / submission.getMaxScore()) * 100.0;

        submission.setFinalScore(revisedScore);
        submission.setPercentage(newPercentage);
        submission.setEvaluationStatus(EvaluationStatus.REVISED);
        submission.setReviewedBy(reviewer.getFullName() + " (" + reviewer.getUsername() + ")");
        submission.setReviewedAt(Instant.now());
        if (request.remarks() != null && !request.remarks().isBlank()) {
            submission.setRemarks(request.remarks());
        }
        submissionRepository.save(submission);

        // Record Permanent Audit Log
        EvaluationAudit audit = new EvaluationAudit(
                submission,
                reviewer.getUsername(),
                reviewer.getFullName(),
                previousScore,
                revisedScore,
                request.reason(),
                request.remarks()
        );
        evaluationAuditRepository.save(audit);

        // Update Attempt passed status if changed
        ExaminationAttempt attempt = submission.getAttempt();
        boolean passed = newPercentage >= attempt.getExamination().getPassingPercentage();
        attempt.setPassed(passed);
        attempt.setMarksAwarded(revisedScore);
        attempt.setPercentage(newPercentage);

        // If newly passed, issue certificate
        if (passed) {
            try {
                certificateService.generateCertificateForSubmission(submission);
            } catch (Exception e) {
                log.error("Failed to generate certificate on revision: {}", e.getMessage());
            }
        }

        log.info("Official mark correction for submission {} by {}: {} -> {} (Reason: {})",
                submissionId, reviewerUsername, previousScore, revisedScore, request.reason());

        return mapToDetailDtoFull(submission);
    }

    @Transactional
    public Certificate issueCertificateForSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + submissionId));

        if (submission.getEvaluationStatus() != EvaluationStatus.APPROVED) {
            submission.setEvaluationStatus(EvaluationStatus.APPROVED);
            submission = submissionRepository.save(submission);
        }

        Certificate cert = certificateService.generateCertificateForSubmission(submission);
        if (cert == null) {
            throw new IllegalStateException("Candidate percentage (" + submission.getPercentage() + "%) is below the passing criteria for certification.");
        }
        return cert;
    }

    private SubmissionDetailDto mapToDetailDtoBasic(Submission s) {
        CertificateGrade grade = CertificateGrade.fromPercentage(s.getPercentage());
        return new SubmissionDetailDto(
                s.getId(),
                s.getAttempt().getAttemptUuid(),
                s.getEmployee().getUser().getFullName(),
                s.getEmployee().getEmployeeCode(),
                s.getEmployee().getDepartment(),
                s.getSubject(),
                s.getSetName(),
                s.getOriginalScore(),
                s.getFinalScore(),
                s.getMaxScore(),
                s.getPercentage(),
                s.getAttempt().getPassed() != null ? s.getAttempt().getPassed() : false,
                grade,
                s.getEvaluationStatus(),
                s.getAttempt().getStartedAt(),
                s.getAttempt().getSubmittedAt(),
                s.getAttempt().getDurationSecondsTaken(),
                s.getAttempt().getIntegrityScore(),
                s.getAttempt().getTabSwitchViolations(),
                s.getAttempt().getFullscreenExitViolations(),
                s.getReviewedBy(),
                s.getReviewedAt(),
                s.getRemarks(),
                Collections.emptyList(),
                Collections.emptyList()
        );
    }

    private SubmissionDetailDto mapToDetailDtoFull(Submission s) {
        CertificateGrade grade = CertificateGrade.fromPercentage(s.getPercentage());
        List<AttemptQuestion> questions = attemptQuestionRepository.findByAttemptIdOrderByDisplayOrderAsc(s.getAttempt().getId());

        List<QuestionReviewDto> reviews = new ArrayList<>();
        for (AttemptQuestion aq : questions) {
            Map<String, String> opts = new LinkedHashMap<>();
            opts.put("A", aq.getOptionAText());
            opts.put("B", aq.getOptionBText());
            opts.put("C", aq.getOptionCText());
            opts.put("D", aq.getOptionDText());

            reviews.add(new QuestionReviewDto(
                    aq.getDisplayOrder(),
                    aq.getQuestion().getQuestionCode(),
                    aq.getQuestion().getSubject(),
                    aq.getQuestion().getTopic(),
                    aq.getQuestion().getDifficulty().name(),
                    aq.getQuestion().getQuestionText(),
                    opts,
                    aq.getSelectedOption(),
                    aq.getCorrectOptionDisplay(),
                    Boolean.TRUE.equals(aq.getCorrect()),
                    aq.getMarksAwarded(),
                    aq.getQuestion().getMarks() != null ? aq.getQuestion().getMarks() : 2.0,
                    aq.getQuestion().getExplanation()
            ));
        }

        if (reviews.isEmpty()) {
            List<Question> bank = questionRepository.findBySubjectAndSetName(s.getSubject(), s.getSetName());
            int order = 1;
            for (Question q : bank) {
                Map<String, String> opts = new LinkedHashMap<>();
                opts.put("A", q.getOptionA());
                opts.put("B", q.getOptionB());
                opts.put("C", q.getOptionC());
                opts.put("D", q.getOptionD());
                String corr = q.getCorrectOption();
                reviews.add(new QuestionReviewDto(
                        order++,
                        q.getQuestionCode(),
                        q.getSubject(),
                        q.getTopic(),
                        q.getDifficulty().name(),
                        q.getQuestionText(),
                        opts,
                        corr,
                        corr,
                        true,
                        q.getMarks() != null ? q.getMarks() : 2.0,
                        q.getMarks() != null ? q.getMarks() : 2.0,
                        q.getExplanation()
                ));
            }
        }

        List<EvaluationAudit> audits = evaluationAuditRepository.findBySubmissionIdOrderByTimestampDesc(s.getId());
        List<EvaluationAuditDto> auditDtos = audits.stream()
                .map(a -> new EvaluationAuditDto(
                        a.getId(),
                        a.getReviewerUsername(),
                        a.getReviewerFullName(),
                        a.getPreviousScore(),
                        a.getRevisedScore(),
                        a.getReason(),
                        a.getRemarks(),
                        a.getTimestamp()
                )).toList();

        return new SubmissionDetailDto(
                s.getId(),
                s.getAttempt().getAttemptUuid(),
                s.getEmployee().getUser().getFullName(),
                s.getEmployee().getEmployeeCode(),
                s.getEmployee().getDepartment(),
                s.getSubject(),
                s.getSetName(),
                s.getOriginalScore(),
                s.getFinalScore(),
                s.getMaxScore(),
                s.getPercentage(),
                s.getAttempt().getPassed() != null ? s.getAttempt().getPassed() : false,
                grade,
                s.getEvaluationStatus(),
                s.getAttempt().getStartedAt(),
                s.getAttempt().getSubmittedAt(),
                s.getAttempt().getDurationSecondsTaken(),
                s.getAttempt().getIntegrityScore(),
                s.getAttempt().getTabSwitchViolations(),
                s.getAttempt().getFullscreenExitViolations(),
                s.getReviewedBy(),
                s.getReviewedAt(),
                s.getRemarks(),
                reviews,
                auditDtos
        );
    }
}

