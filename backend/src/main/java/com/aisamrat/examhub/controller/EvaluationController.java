package com.aisamrat.examhub.controller;

import com.aisamrat.examhub.dto.OfficialCorrectionRequest;
import com.aisamrat.examhub.dto.SubmissionDetailDto;
import com.aisamrat.examhub.entity.Certificate;
import com.aisamrat.examhub.entity.Submission;
import com.aisamrat.examhub.enums.EvaluationStatus;
import com.aisamrat.examhub.repository.SubmissionRepository;
import com.aisamrat.examhub.service.EvaluationService;
import com.aisamrat.examhub.service.ReportingService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluator/submissions")
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final ReportingService reportingService;
    private final SubmissionRepository submissionRepository;

    public EvaluationController(
            EvaluationService evaluationService,
            ReportingService reportingService,
            SubmissionRepository submissionRepository) {
        this.evaluationService = evaluationService;
        this.reportingService = reportingService;
        this.submissionRepository = submissionRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('EVALUATOR', 'SUPER_ADMIN')")
    public ResponseEntity<List<SubmissionDetailDto>> getSubmissions(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) EvaluationStatus status) {
        return ResponseEntity.ok(evaluationService.getAllSubmissions(subject, status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'SUPER_ADMIN')")
    public ResponseEntity<SubmissionDetailDto> getSubmissionDetail(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.getSubmissionDetail(id));
    }

    @GetMapping("/by-attempt/{attemptUuid}")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'SUPER_ADMIN')")
    public ResponseEntity<SubmissionDetailDto> getSubmissionByAttemptUuid(@PathVariable String attemptUuid) {
        return ResponseEntity.ok(evaluationService.getSubmissionByAttemptUuid(attemptUuid));
    }

    @PostMapping("/{id}/correct")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'SUPER_ADMIN')")
    public ResponseEntity<SubmissionDetailDto> correctMarks(
            @PathVariable Long id,
            @RequestBody OfficialCorrectionRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(evaluationService.modifyMarks(id, request, authentication.getName()));
    }

    /**
     * Download comprehensive audit-grade Excel file for an individual employee submission.
     * Includes full candidate details, timestamps, duration, and complete question paper with chosen options.
     */
    @GetMapping("/{id}/export-excel")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'SUPER_ADMIN')")
    public ResponseEntity<byte[]> exportSubmissionExcel(@PathVariable Long id) {
        try {
            byte[] excelBytes = reportingService.generateSubmissionDetailedExcel(id);
            Submission s = submissionRepository.findById(id).orElseThrow();
            String safeCode = s.getEmployee().getEmployeeCode().replaceAll("[^a-zA-Z0-9_-]", "_");
            String safeSub = s.getSubject().replaceAll("[^a-zA-Z0-9_-]", "_");
            String filename = "AI_SAMRAT_Submission_" + safeCode + "_" + safeSub + ".xlsx";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download master submissions roster Excel spreadsheet across all candidates.
     */
    @GetMapping("/export-all-excel")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'SUPER_ADMIN')")
    public ResponseEntity<byte[]> exportAllSubmissionsExcel() {
        try {
            byte[] excelBytes = reportingService.generateExcelReport();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"AI_SAMRAT_Submissions_Master_Roster.xlsx\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Authorize and issue an official tamper-evident digital certificate for a verified submission.
     */
    @PostMapping("/{id}/issue-certificate")
    @PreAuthorize("hasAnyRole('EVALUATOR', 'SUPER_ADMIN')")
    public ResponseEntity<?> issueCertificate(@PathVariable Long id) {
        try {
            Certificate cert = evaluationService.issueCertificateForSubmission(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Official certificate successfully issued and registered.",
                    "certificateCode", cert.getCertificateCode(),
                    "grade", cert.getGrade().getDisplayName(),
                    "score", cert.getScore(),
                    "maxScore", cert.getMaxScore(),
                    "percentage", cert.getPercentage(),
                    "issueDate", cert.getIssueDate().toString()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Failed to issue certificate: " + e.getMessage()));
        }
    }
}

