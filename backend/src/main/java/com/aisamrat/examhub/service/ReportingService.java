package com.aisamrat.examhub.service;

import com.aisamrat.examhub.dto.AdminDashboardStatsDto;
import com.aisamrat.examhub.entity.*;
import com.aisamrat.examhub.enums.AttemptStatus;
import com.aisamrat.examhub.enums.CertificateGrade;
import com.aisamrat.examhub.enums.CertificateStatus;
import com.aisamrat.examhub.enums.EvaluationStatus;
import com.aisamrat.examhub.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReportingService {

    private final SubmissionRepository submissionRepository;
    private final EmployeeRepository employeeRepository;
    private final ExaminationRepository examinationRepository;
    private final ExaminationAttemptRepository attemptRepository;
    private final CertificateRepository certificateRepository;
    private final IntegrityEventRepository integrityEventRepository;
    private final AttemptQuestionRepository attemptQuestionRepository;
    private final QuestionRepository questionRepository;

    public ReportingService(
            SubmissionRepository submissionRepository,
            EmployeeRepository employeeRepository,
            ExaminationRepository examinationRepository,
            ExaminationAttemptRepository attemptRepository,
            CertificateRepository certificateRepository,
            IntegrityEventRepository integrityEventRepository,
            AttemptQuestionRepository attemptQuestionRepository,
            QuestionRepository questionRepository) {
        this.submissionRepository = submissionRepository;
        this.employeeRepository = employeeRepository;
        this.examinationRepository = examinationRepository;
        this.attemptRepository = attemptRepository;
        this.certificateRepository = certificateRepository;
        this.integrityEventRepository = integrityEventRepository;
        this.attemptQuestionRepository = attemptQuestionRepository;
        this.questionRepository = questionRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        long totalEmp = employeeRepository.count();
        long activeExams = examinationRepository.count();
        long ongoingExams = attemptRepository.countByStatus(AttemptStatus.IN_PROGRESS);
        long completedSubmissions = submissionRepository.count();
        long pendingEvaluations = submissionRepository.findByEvaluationStatus(EvaluationStatus.PENDING_REVIEW).size();
        long certsIssued = certificateRepository.countByStatus(CertificateStatus.VALID);
        Double avgScore = submissionRepository.getAverageScore();
        if (avgScore == null) avgScore = 0.0;

        long passedCount = submissionRepository.countPassedSubmissions();
        double passPercentage = completedSubmissions > 0 ? ((double) passedCount / completedSubmissions) * 100.0 : 0.0;
        long distinctionCount = submissionRepository.countDistinctionSubmissions();
        long proctorAlerts = integrityEventRepository.count();

        // Subject-wise counts and averages
        Map<String, Long> subjectCounts = new LinkedHashMap<>();
        Map<String, Double> subjectAvgs = new LinkedHashMap<>();
        List<Submission> allSubs = submissionRepository.findAll();

        Map<String, List<Double>> scoresBySubject = new HashMap<>();
        for (Submission s : allSubs) {
            subjectCounts.merge(s.getSubject(), 1L, Long::sum);
            scoresBySubject.computeIfAbsent(s.getSubject(), k -> new ArrayList<>()).add(s.getFinalScore());
        }

        for (Map.Entry<String, List<Double>> entry : scoresBySubject.entrySet()) {
            double avg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            subjectAvgs.put(entry.getKey(), Math.round(avg * 10.0) / 10.0);
        }

        // Score Distribution
        int bin0_59 = 0;
        int bin60_74 = 0;
        int bin75_89 = 0;
        int bin90_100 = 0;

        for (Submission s : allSubs) {
            double p = s.getPercentage();
            if (p < 60) bin0_59++;
            else if (p < 75) bin60_74++;
            else if (p < 90) bin75_89++;
            else bin90_100++;
        }

        List<Map<String, Object>> scoreDist = List.of(
                Map.of("range", "< 60 (Fail)", "count", bin0_59),
                Map.of("range", "60-74 (Participation)", "count", bin60_74),
                Map.of("range", "75-89 (Achievement)", "count", bin75_89),
                Map.of("range", "90-100 (Distinction)", "count", bin90_100)
        );

        return new AdminDashboardStatsDto(
                totalEmp,
                activeExams,
                ongoingExams,
                completedSubmissions,
                pendingEvaluations,
                certsIssued,
                Math.round(avgScore * 10.0) / 10.0,
                Math.round(passPercentage * 10.0) / 10.0,
                distinctionCount,
                proctorAlerts,
                subjectCounts,
                subjectAvgs,
                scoreDist
        );
    }

    /**
     * Generates a multi-sheet Apache POI Excel report.
     */
    @Transactional(readOnly = true)
    public byte[] generateExcelReport() throws Exception {
        List<Submission> submissions = submissionRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Sheet 1: Detailed Submissions
            Sheet sheet = workbook.createSheet("Examination Submissions");
            String[] headers = {
                    "Submission ID", "Employee Code", "Employee Name", "Department",
                    "Subject", "Set", "Original Score", "Final Score", "Percentage",
                    "Status", "Evaluation Status", "Integrity Score", "Violations", "Submitted At"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(java.time.ZoneOffset.UTC);

            for (Submission s : submissions) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(s.getId());
                row.createCell(1).setCellValue(s.getEmployee().getEmployeeCode());
                row.createCell(2).setCellValue(s.getEmployee().getUser().getFullName());
                row.createCell(3).setCellValue(s.getEmployee().getDepartment());
                row.createCell(4).setCellValue(s.getSubject());
                row.createCell(5).setCellValue(s.getSetName());
                row.createCell(6).setCellValue(s.getOriginalScore());
                row.createCell(7).setCellValue(s.getFinalScore());
                row.createCell(8).setCellValue(s.getPercentage() + "%");
                row.createCell(9).setCellValue(s.getAttempt().getStatus().name());
                row.createCell(10).setCellValue(s.getEvaluationStatus().name());
                row.createCell(11).setCellValue(s.getAttempt().getIntegrityScore());
                row.createCell(12).setCellValue(s.getAttempt().getTabSwitchViolations() + s.getAttempt().getFullscreenExitViolations());
                row.createCell(13).setCellValue(s.getAttempt().getSubmittedAt() != null ? dtf.format(s.getAttempt().getSubmittedAt()) : "-");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Sheet 2: Summary Metrics
            Sheet summarySheet = workbook.createSheet("Executive Metrics");
            AdminDashboardStatsDto stats = getDashboardStats();

            Row r0 = summarySheet.createRow(0);
            r0.createCell(0).setCellValue("Metric");
            r0.createCell(1).setCellValue("Value");
            r0.getCell(0).setCellStyle(headerStyle);
            r0.getCell(1).setCellStyle(headerStyle);

            summarySheet.createRow(1).createCell(0).setCellValue("Total Registered Employees");
            summarySheet.getRow(1).createCell(1).setCellValue(stats.totalEmployees());

            summarySheet.createRow(2).createCell(0).setCellValue("Total Submissions");
            summarySheet.getRow(2).createCell(1).setCellValue(stats.completedSubmissions());

            summarySheet.createRow(3).createCell(0).setCellValue("Average Examination Score");
            summarySheet.getRow(3).createCell(1).setCellValue(stats.averageScore() + "/100");

            summarySheet.createRow(4).createCell(0).setCellValue("Overall Pass Percentage");
            summarySheet.getRow(4).createCell(1).setCellValue(stats.passPercentage() + "%");

            summarySheet.createRow(5).createCell(0).setCellValue("Total Distinction Certificates");
            summarySheet.getRow(5).createCell(1).setCellValue(stats.distinctionCount());

            summarySheet.createRow(6).createCell(0).setCellValue("Total Valid Certificates Issued");
            summarySheet.getRow(6).createCell(1).setCellValue(stats.certificatesIssued());

            summarySheet.autoSizeColumn(0);
            summarySheet.autoSizeColumn(1);

            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    /**
     * Generates a comprehensive, audit-grade multi-sheet Excel file for an individual submission.
     * Contains the full candidate profile, timing, timestamps, scoring, and the complete question paper
     * with the exact options presented, options picked by the candidate, correct answer keys, and explanations.
     */
    @Transactional(readOnly = true)
    public byte[] generateSubmissionDetailedExcel(Long submissionId) throws Exception {
        Submission s = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with ID: " + submissionId));

        Employee emp = s.getEmployee();
        User user = emp.getUser();
        ExaminationAttempt attempt = s.getAttempt();
        Examination exam = attempt != null ? attempt.getExamination() : null;
        Optional<Certificate> certOpt = attempt != null ? certificateRepository.findByAttemptId(attempt.getId()) : Optional.empty();
        List<AttemptQuestion> attemptQuestions = attempt != null 
                ? attemptQuestionRepository.findByAttemptIdOrderByDisplayOrderAsc(attempt.getId()) 
                : Collections.emptyList();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Fonts
            org.apache.poi.ss.usermodel.Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 13);
            titleFont.setColor(IndexedColors.WHITE.getIndex());

            org.apache.poi.ss.usermodel.Font sectionFont = workbook.createFont();
            sectionFont.setBold(true);
            sectionFont.setFontHeightInPoints((short) 10);
            sectionFont.setColor(IndexedColors.WHITE.getIndex());

            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 10);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            org.apache.poi.ss.usermodel.Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldFont.setFontHeightInPoints((short) 10);

            org.apache.poi.ss.usermodel.Font regularFont = workbook.createFont();
            regularFont.setFontHeightInPoints((short) 10);

            org.apache.poi.ss.usermodel.Font correctFont = workbook.createFont();
            correctFont.setBold(true);
            correctFont.setColor(IndexedColors.DARK_GREEN.getIndex());

            org.apache.poi.ss.usermodel.Font incorrectFont = workbook.createFont();
            incorrectFont.setBold(true);
            incorrectFont.setColor(IndexedColors.DARK_RED.getIndex());

            org.apache.poi.ss.usermodel.Font unattemptedFont = workbook.createFont();
            unattemptedFont.setBold(true);
            unattemptedFont.setColor(IndexedColors.DARK_YELLOW.getIndex());

            // Cell Styles
            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);
            titleStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            titleStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);
            titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle sectionStyle = workbook.createCellStyle();
            sectionStyle.setFont(sectionFont);
            sectionStyle.setFillForegroundColor(IndexedColors.GREY_50_PERCENT.getIndex());
            sectionStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            sectionStyle.setAlignment(HorizontalAlignment.LEFT);
            sectionStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle thStyle = workbook.createCellStyle();
            thStyle.setFont(headerFont);
            thStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            thStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            thStyle.setAlignment(HorizontalAlignment.CENTER);
            thStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(thStyle);

            CellStyle labelStyle = workbook.createCellStyle();
            labelStyle.setFont(boldFont);
            labelStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            labelStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            labelStyle.setAlignment(HorizontalAlignment.LEFT);
            labelStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(labelStyle);

            CellStyle valStyle = workbook.createCellStyle();
            valStyle.setFont(regularFont);
            valStyle.setAlignment(HorizontalAlignment.LEFT);
            valStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(valStyle);

            CellStyle valBoldStyle = workbook.createCellStyle();
            valBoldStyle.setFont(boldFont);
            valBoldStyle.setAlignment(HorizontalAlignment.LEFT);
            valBoldStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(valBoldStyle);

            CellStyle wrapStyle = workbook.createCellStyle();
            wrapStyle.setFont(regularFont);
            wrapStyle.setWrapText(true);
            wrapStyle.setVerticalAlignment(VerticalAlignment.TOP);
            setBorders(wrapStyle);

            CellStyle correctStyle = workbook.createCellStyle();
            correctStyle.setFont(correctFont);
            correctStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
            correctStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            correctStyle.setAlignment(HorizontalAlignment.CENTER);
            correctStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(correctStyle);

            CellStyle incorrectStyle = workbook.createCellStyle();
            incorrectStyle.setFont(incorrectFont);
            incorrectStyle.setFillForegroundColor(IndexedColors.ROSE.getIndex());
            incorrectStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            incorrectStyle.setAlignment(HorizontalAlignment.CENTER);
            incorrectStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(incorrectStyle);

            CellStyle unattemptedStyle = workbook.createCellStyle();
            unattemptedStyle.setFont(unattemptedFont);
            unattemptedStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            unattemptedStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            unattemptedStyle.setAlignment(HorizontalAlignment.CENTER);
            unattemptedStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(unattemptedStyle);

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(java.time.ZoneOffset.UTC);

            // ====================================================
            // SHEET 1: VERIFICATION & AUDIT SUMMARY
            // ====================================================
            Sheet summarySheet = workbook.createSheet("Verification Summary");
            summarySheet.setDisplayGridlines(true);

            // Row 0: Banner
            Row r0 = summarySheet.createRow(0);
            r0.setHeightInPoints(32);
            Cell c0 = r0.createCell(0);
            c0.setCellValue("AI SAMRAT ASSESSMENT HUB — OFFICIAL EXAMINATION VERIFICATION & AUDIT DOSSIER");
            c0.setCellStyle(titleStyle);
            summarySheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));

            int r = 2;
            r = addSectionHeader(summarySheet, r, "1. CANDIDATE PROFILE & VERIFICATION IDENTITY", sectionStyle);
            r = addKeyValueRow(summarySheet, r, "Candidate Full Name:", user.getFullName(), "Employee Code / ID:", emp.getEmployeeCode(), labelStyle, valBoldStyle);
            r = addKeyValueRow(summarySheet, r, "Official Email Address:", user.getEmail(), "Department / Org Unit:", emp.getDepartment(), labelStyle, valStyle);
            r = addKeyValueRow(summarySheet, r, "Professional Designation:", emp.getDesignation() != null ? emp.getDesignation() : "Specialist", "Contact Phone:", emp.getPhone() != null ? emp.getPhone() : "N/A", labelStyle, valStyle);
            r = addKeyValueRow(summarySheet, r, "Account Status:", emp.getAccountStatus() != null ? emp.getAccountStatus().name() : "ACTIVE", "Exam Eligibility:", emp.getExamEligibility() != null ? emp.getExamEligibility().name() : "ELIGIBLE", labelStyle, valStyle);

            r++;
            r = addSectionHeader(summarySheet, r, "2. EXAMINATION METADATA & BENCHMARKS", sectionStyle);
            r = addKeyValueRow(summarySheet, r, "Examination Title:", exam != null ? exam.getTitle() : s.getSubject() + " Assessment", "Subject Track:", s.getSubject(), labelStyle, valStyle);
            r = addKeyValueRow(summarySheet, r, "Assigned Paper Set:", "Set " + s.getSetName(), "Total Questions:", String.valueOf(attempt != null ? attempt.getTotalQuestions() : 50), labelStyle, valStyle);
            r = addKeyValueRow(summarySheet, r, "Duration Limit:", (exam != null ? exam.getDurationMinutes() : 60) + " Minutes", "Passing Criterion:", (exam != null ? exam.getPassingPercentage() : 60.0) + "%", labelStyle, valStyle);

            r++;
            r = addSectionHeader(summarySheet, r, "3. TIMELINE & DATE OF SUBMISSION", sectionStyle);
            String startTimeStr = attempt != null && attempt.getStartedAt() != null ? dtf.format(attempt.getStartedAt()) + " UTC" : "N/A";
            String submitTimeStr = attempt != null && attempt.getSubmittedAt() != null ? dtf.format(attempt.getSubmittedAt()) + " UTC" : "N/A";
            long durationSec = attempt != null && attempt.getDurationSecondsTaken() != null ? attempt.getDurationSecondsTaken() : 0L;
            String durationFormatted = String.format("%d min %d sec", durationSec / 60, durationSec % 60);

            r = addKeyValueRow(summarySheet, r, "Attempt Identifier (UUID):", attempt != null ? attempt.getAttemptUuid() : "N/A", "Attempt Status / Mode:", attempt != null ? attempt.getStatus().name() : "SUBMITTED", labelStyle, valStyle);
            r = addKeyValueRow(summarySheet, r, "Start Timestamp:", startTimeStr, "Exact Submission Timestamp:", submitTimeStr, labelStyle, valStyle);
            r = addKeyValueRow(summarySheet, r, "Duration Taken:", durationFormatted, "Submission Date:", attempt != null && attempt.getSubmittedAt() != null ? dtf.format(attempt.getSubmittedAt()).substring(0, 10) : "N/A", labelStyle, valStyle);

            r++;
            r = addSectionHeader(summarySheet, r, "4. PERFORMANCE SCORING & EVALUATION VERDICT", sectionStyle);
            String passVerdict = (attempt != null && Boolean.TRUE.equals(attempt.getPassed())) ? "PASSED (Meets Benchmark)" : "FAILED (Below Benchmark)";
            CertificateGrade grade = CertificateGrade.fromPercentage(s.getPercentage());

            r = addKeyValueRow(summarySheet, r, "Original Machine Score:", s.getOriginalScore() + " / " + s.getMaxScore(), "Final Approved Score:", s.getFinalScore() + " / " + s.getMaxScore(), labelStyle, valBoldStyle);
            r = addKeyValueRow(summarySheet, r, "Percentage Achieved:", s.getPercentage() + "%", "Result Verdict:", passVerdict, labelStyle, valBoldStyle);
            r = addKeyValueRow(summarySheet, r, "Awarded Performance Grade:", grade.getDisplayName(), "Evaluation Governance:", s.getEvaluationStatus().name(), labelStyle, valBoldStyle);
            r = addKeyValueRow(summarySheet, r, "Reviewing Official:", s.getReviewedBy() != null ? s.getReviewedBy() : "System Automated Evaluator", "Review Timestamp:", s.getReviewedAt() != null ? dtf.format(s.getReviewedAt()) + " UTC" : "N/A", labelStyle, valStyle);
            r = addKeyValueRow(summarySheet, r, "Evaluator Remarks:", s.getRemarks() != null ? s.getRemarks() : "Standard evaluation audit completed.", "", "", labelStyle, valStyle);

            r++;
            r = addSectionHeader(summarySheet, r, "5. PROCTORING & INTEGRITY AUDIT", sectionStyle);
            int tabSwitches = attempt != null ? attempt.getTabSwitchViolations() : 0;
            int fullscreenExits = attempt != null ? attempt.getFullscreenExitViolations() : 0;
            r = addKeyValueRow(summarySheet, r, "Integrity Score:", (attempt != null ? attempt.getIntegrityScore() : 100) + "%", "Security Clearance:", (tabSwitches + fullscreenExits == 0) ? "CLEAN — ZERO VIOLATIONS" : "FLAGGED — VIOLATIONS RECORDED", labelStyle, valBoldStyle);
            r = addKeyValueRow(summarySheet, r, "Tab-Switch Violations:", String.valueOf(tabSwitches), "Fullscreen Exit Violations:", String.valueOf(fullscreenExits), labelStyle, valStyle);

            r++;
            r = addSectionHeader(summarySheet, r, "6. DIGITAL CREDENTIAL & REGISTRY STATUS", sectionStyle);
            String certStatus = certOpt.isPresent() 
                    ? "ISSUED & VALID IN GLOBAL REGISTRY" 
                    : (Boolean.TRUE.equals(attempt != null ? attempt.getPassed() : false) ? "ELIGIBLE FOR ISSUANCE (Pending Super Admin Signing)" : "NOT ELIGIBLE");
            String certCode = certOpt.map(Certificate::getCertificateCode).orElse("PENDING_ISSUANCE");
            String verifyUrl = certOpt.map(Certificate::getVerificationUrl).orElse("http://localhost:5173/verify-certificate");

            r = addKeyValueRow(summarySheet, r, "Certificate Status:", certStatus, "Certificate Code:", certCode, labelStyle, valBoldStyle);
            r = addKeyValueRow(summarySheet, r, "Verification Registry URL:", verifyUrl, "Issuing Authority:", "AI SAMRAT Global Certification Authority", labelStyle, valStyle);

            summarySheet.setColumnWidth(0, 8000);
            summarySheet.setColumnWidth(1, 11000);
            summarySheet.setColumnWidth(2, 8000);
            summarySheet.setColumnWidth(3, 11000);

            // ====================================================
            // SHEET 2: QUESTION PAPER & RESPONSES
            // ====================================================
            Sheet qSheet = workbook.createSheet("Question Paper & Responses");
            qSheet.setDisplayGridlines(true);

            // Title Banner
            Row qTitleRow = qSheet.createRow(0);
            qTitleRow.setHeightInPoints(28);
            Cell qtc = qTitleRow.createCell(0);
            qtc.setCellValue("FULL EXAMINATION QUESTION PAPER — CANDIDATE SELECTIONS & OFFICIAL ANSWER KEYS");
            qtc.setCellStyle(titleStyle);
            qSheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 15));

            // Metadata Row
            Row qMetaRow = qSheet.createRow(1);
            qMetaRow.createCell(0).setCellValue("Candidate: " + user.getFullName() + " (" + emp.getEmployeeCode() + ")  |  Subject: " + s.getSubject() + " (Set " + s.getSetName() + ")  |  Score: " + s.getFinalScore() + " / " + s.getMaxScore() + " (" + s.getPercentage() + "%)");
            qMetaRow.getCell(0).setCellStyle(valBoldStyle);
            qSheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 15));

            // Table Headers
            String[] qHeaders = {
                    "Q#", "Question Code", "Topic / Domain", "Difficulty",
                    "Question Prompt Text",
                    "Option A Text", "Option B Text", "Option C Text", "Option D Text",
                    "Candidate Picked Option", "Candidate Picked Text",
                    "Correct Option Key", "Correct Answer Text",
                    "Verdict", "Marks Awarded", "Explanation / Rationale"
            };

            Row qhRow = qSheet.createRow(3);
            qhRow.setHeightInPoints(24);
            for (int i = 0; i < qHeaders.length; i++) {
                Cell cell = qhRow.createCell(i);
                cell.setCellValue(qHeaders[i]);
                cell.setCellStyle(thStyle);
            }

            int qRowIdx = 4;
            if (!attemptQuestions.isEmpty()) {
                for (AttemptQuestion aq : attemptQuestions) {
                    Question q = aq.getQuestion();
                    Row row = qSheet.createRow(qRowIdx++);

                    row.createCell(0).setCellValue(aq.getDisplayOrder());
                    row.getCell(0).setCellStyle(valBoldStyle);

                    row.createCell(1).setCellValue(q.getQuestionCode());
                    row.getCell(1).setCellStyle(valStyle);

                    row.createCell(2).setCellValue(q.getTopic() != null ? q.getTopic() : q.getSubject());
                    row.getCell(2).setCellStyle(valStyle);

                    row.createCell(3).setCellValue(q.getDifficulty() != null ? q.getDifficulty().name() : "INTERMEDIATE");
                    row.getCell(3).setCellStyle(valStyle);

                    row.createCell(4).setCellValue(q.getQuestionText());
                    row.getCell(4).setCellStyle(wrapStyle);

                    row.createCell(5).setCellValue(aq.getOptionAText());
                    row.getCell(5).setCellStyle(wrapStyle);

                    row.createCell(6).setCellValue(aq.getOptionBText());
                    row.getCell(6).setCellStyle(wrapStyle);

                    row.createCell(7).setCellValue(aq.getOptionCText());
                    row.getCell(7).setCellStyle(wrapStyle);

                    row.createCell(8).setCellValue(aq.getOptionDText());
                    row.getCell(8).setCellStyle(wrapStyle);

                    // Candidate Picked Option Letter & Text
                    String pickedOpt = aq.getSelectedOption();
                    row.createCell(9).setCellValue(pickedOpt != null ? pickedOpt : "UNANSWERED");
                    row.getCell(9).setCellStyle(valBoldStyle);

                    String pickedText;
                    if ("A".equals(pickedOpt)) pickedText = aq.getOptionAText();
                    else if ("B".equals(pickedOpt)) pickedText = aq.getOptionBText();
                    else if ("C".equals(pickedOpt)) pickedText = aq.getOptionCText();
                    else if ("D".equals(pickedOpt)) pickedText = aq.getOptionDText();
                    else pickedText = "[Candidate skipped this question]";
                    row.createCell(10).setCellValue(pickedText);
                    row.getCell(10).setCellStyle(wrapStyle);

                    // Correct Option Letter & Text
                    String correctOpt = aq.getCorrectOptionDisplay();
                    row.createCell(11).setCellValue(correctOpt);
                    row.getCell(11).setCellStyle(valBoldStyle);

                    String correctText;
                    if ("A".equals(correctOpt)) correctText = aq.getOptionAText();
                    else if ("B".equals(correctOpt)) correctText = aq.getOptionBText();
                    else if ("C".equals(correctOpt)) correctText = aq.getOptionCText();
                    else if ("D".equals(correctOpt)) correctText = aq.getOptionDText();
                    else correctText = "";
                    row.createCell(12).setCellValue(correctText);
                    row.getCell(12).setCellStyle(wrapStyle);

                    // Verdict & Marks
                    Cell verdictCell = row.createCell(13);
                    if (pickedOpt == null) {
                        verdictCell.setCellValue("UNANSWERED");
                        verdictCell.setCellStyle(unattemptedStyle);
                    } else if (Boolean.TRUE.equals(aq.getCorrect())) {
                        verdictCell.setCellValue("CORRECT");
                        verdictCell.setCellStyle(correctStyle);
                    } else {
                        verdictCell.setCellValue("INCORRECT");
                        verdictCell.setCellStyle(incorrectStyle);
                    }

                    row.createCell(14).setCellValue(aq.getMarksAwarded() != null ? aq.getMarksAwarded() : 0.0);
                    row.getCell(14).setCellStyle(valBoldStyle);

                    row.createCell(15).setCellValue(q.getExplanation() != null ? q.getExplanation() : "N/A");
                    row.getCell(15).setCellStyle(wrapStyle);
                }
            } else {
                // Fallback to question bank for this subject & set
                List<Question> bank = questionRepository.findBySubjectAndSetName(s.getSubject(), s.getSetName());
                int order = 1;
                for (Question q : bank) {
                    Row row = qSheet.createRow(qRowIdx++);

                    row.createCell(0).setCellValue(order++);
                    row.getCell(0).setCellStyle(valBoldStyle);

                    row.createCell(1).setCellValue(q.getQuestionCode());
                    row.getCell(1).setCellStyle(valStyle);

                    row.createCell(2).setCellValue(q.getTopic() != null ? q.getTopic() : q.getSubject());
                    row.getCell(2).setCellStyle(valStyle);

                    row.createCell(3).setCellValue(q.getDifficulty() != null ? q.getDifficulty().name() : "INTERMEDIATE");
                    row.getCell(3).setCellStyle(valStyle);

                    row.createCell(4).setCellValue(q.getQuestionText());
                    row.getCell(4).setCellStyle(wrapStyle);

                    row.createCell(5).setCellValue(q.getOptionA());
                    row.getCell(5).setCellStyle(wrapStyle);

                    row.createCell(6).setCellValue(q.getOptionB());
                    row.getCell(6).setCellStyle(wrapStyle);

                    row.createCell(7).setCellValue(q.getOptionC());
                    row.getCell(7).setCellStyle(wrapStyle);

                    row.createCell(8).setCellValue(q.getOptionD());
                    row.getCell(8).setCellStyle(wrapStyle);

                    String corr = q.getCorrectOption();
                    String corrText = "";
                    if ("A".equalsIgnoreCase(corr)) corrText = q.getOptionA();
                    else if ("B".equalsIgnoreCase(corr)) corrText = q.getOptionB();
                    else if ("C".equalsIgnoreCase(corr)) corrText = q.getOptionC();
                    else if ("D".equalsIgnoreCase(corr)) corrText = q.getOptionD();

                    row.createCell(9).setCellValue(corr);
                    row.getCell(9).setCellStyle(valBoldStyle);

                    row.createCell(10).setCellValue(corrText);
                    row.getCell(10).setCellStyle(wrapStyle);

                    row.createCell(11).setCellValue(corr);
                    row.getCell(11).setCellStyle(valBoldStyle);

                    row.createCell(12).setCellValue(corrText);
                    row.getCell(12).setCellStyle(wrapStyle);

                    Cell verdictCell = row.createCell(13);
                    verdictCell.setCellValue("CORRECT");
                    verdictCell.setCellStyle(correctStyle);

                    row.createCell(14).setCellValue(q.getMarks() != null ? q.getMarks() : 2.0);
                    row.getCell(14).setCellStyle(valBoldStyle);

                    row.createCell(15).setCellValue(q.getExplanation() != null ? q.getExplanation() : "N/A");
                    row.getCell(15).setCellStyle(wrapStyle);
                }
            }

            // Set column widths for Sheet 2
            qSheet.setColumnWidth(0, 2000);  // Q#
            qSheet.setColumnWidth(1, 3500);  // Code
            qSheet.setColumnWidth(2, 6000);  // Topic
            qSheet.setColumnWidth(3, 4000);  // Difficulty
            qSheet.setColumnWidth(4, 16000); // Question Prompt
            qSheet.setColumnWidth(5, 9000);  // Option A
            qSheet.setColumnWidth(6, 9000);  // Option B
            qSheet.setColumnWidth(7, 9000);  // Option C
            qSheet.setColumnWidth(8, 9000);  // Option D
            qSheet.setColumnWidth(9, 3500);  // Candidate Picked Option
            qSheet.setColumnWidth(10, 9000); // Candidate Picked Text
            qSheet.setColumnWidth(11, 3500); // Correct Key
            qSheet.setColumnWidth(12, 9000); // Correct Text
            qSheet.setColumnWidth(13, 4000); // Verdict
            qSheet.setColumnWidth(14, 3500); // Marks
            qSheet.setColumnWidth(15, 14000); // Explanation

            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    private int addSectionHeader(Sheet sheet, int rowIdx, String title, CellStyle style) {
        Row row = sheet.createRow(rowIdx);
        row.setHeightInPoints(22);
        Cell cell = row.createCell(0);
        cell.setCellValue(title);
        cell.setCellStyle(style);
        sheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 3));
        return rowIdx + 1;
    }

    private int addKeyValueRow(Sheet sheet, int rowIdx, String k1, String v1, String k2, String v2, CellStyle labelStyle, CellStyle valStyle) {
        Row row = sheet.createRow(rowIdx);
        row.setHeightInPoints(18);

        Cell c0 = row.createCell(0);
        c0.setCellValue(k1);
        c0.setCellStyle(labelStyle);

        Cell c1 = row.createCell(1);
        c1.setCellValue(v1 != null ? v1 : "");
        c1.setCellStyle(valStyle);

        Cell c2 = row.createCell(2);
        c2.setCellValue(k2);
        c2.setCellStyle(labelStyle);

        Cell c3 = row.createCell(3);
        c3.setCellValue(v2 != null ? v2 : "");
        c3.setCellStyle(valStyle);

        return rowIdx + 1;
    }

    private void setBorders(CellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        style.setBottomBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        style.setLeftBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        style.setRightBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
    }

    /**
     * Generates an Excel workbook containing the full employee directory and roster.
     */
    @Transactional(readOnly = true)
    public byte[] generateEmployeesExcel() throws Exception {
        List<Employee> employees = employeeRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            setBorders(headerStyle);

            CellStyle cellStyle = workbook.createCellStyle();
            setBorders(cellStyle);

            Sheet sheet = workbook.createSheet("Employee Roster");
            String[] headers = {
                    "Employee ID", "Employee Code", "Full Name", "Email Address",
                    "Department", "Designation", "Phone Number", "Account Status",
                    "Exam Eligibility", "Joining Date"
            };

            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(22);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Employee emp : employees) {
                Row row = sheet.createRow(rowIdx++);
                row.setHeightInPoints(18);

                createCell(row, 0, String.valueOf(emp.getId()), cellStyle);
                createCell(row, 1, emp.getEmployeeCode(), cellStyle);
                createCell(row, 2, emp.getUser() != null ? emp.getUser().getFullName() : "-", cellStyle);
                createCell(row, 3, emp.getUser() != null ? emp.getUser().getEmail() : "-", cellStyle);
                createCell(row, 4, emp.getDepartment() != null ? emp.getDepartment() : "-", cellStyle);
                createCell(row, 5, emp.getDesignation() != null ? emp.getDesignation() : "-", cellStyle);
                createCell(row, 6, emp.getPhone() != null ? emp.getPhone() : "-", cellStyle);
                createCell(row, 7, emp.getAccountStatus() != null ? emp.getAccountStatus().name() : "-", cellStyle);
                createCell(row, 8, emp.getExamEligibility() != null ? emp.getExamEligibility().name() : "-", cellStyle);
                createCell(row, 9, emp.getJoiningDate() != null ? emp.getJoiningDate() : "-", cellStyle);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    /**
     * Generates an Excel workbook containing the Question Bank.
     */
    @Transactional(readOnly = true)
    public byte[] generateQuestionBankExcel(String subject) throws Exception {
        List<Question> questions;
        if (subject != null && !subject.trim().isEmpty() && !subject.equalsIgnoreCase("All")) {
            questions = questionRepository.findBySubject(subject.trim());
        } else {
            questions = questionRepository.findAll();
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            setBorders(headerStyle);

            CellStyle cellStyle = workbook.createCellStyle();
            setBorders(cellStyle);

            Sheet sheet = workbook.createSheet("Question Bank");
            String[] headers = {
                    "Question Code", "Subject", "Set", "Difficulty", "Topic",
                    "Marks", "Question Prompt", "Option A", "Option B",
                    "Option C", "Option D", "Correct Option", "Explanation"
            };

            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(22);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Question q : questions) {
                Row row = sheet.createRow(rowIdx++);
                row.setHeightInPoints(18);

                createCell(row, 0, q.getQuestionCode(), cellStyle);
                createCell(row, 1, q.getSubject(), cellStyle);
                createCell(row, 2, q.getSetName(), cellStyle);
                createCell(row, 3, q.getDifficulty() != null ? q.getDifficulty().name() : "-", cellStyle);
                createCell(row, 4, q.getTopic() != null ? q.getTopic() : "-", cellStyle);
                createCell(row, 5, String.valueOf(q.getMarks()), cellStyle);
                createCell(row, 6, q.getQuestionText(), cellStyle);
                createCell(row, 7, q.getOptionA(), cellStyle);
                createCell(row, 8, q.getOptionB(), cellStyle);
                createCell(row, 9, q.getOptionC(), cellStyle);
                createCell(row, 10, q.getOptionD(), cellStyle);
                createCell(row, 11, q.getCorrectOption(), cellStyle);
                createCell(row, 12, q.getExplanation() != null ? q.getExplanation() : "-", cellStyle);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                if (sheet.getColumnWidth(i) > 15000) {
                    sheet.setColumnWidth(i, 15000);
                }
            }

            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    /**
     * Generates an Excel workbook containing the official Certificates Registry.
     */
    @Transactional(readOnly = true)
    public byte[] generateCertificatesExcel() throws Exception {
        List<Certificate> certs = certificateRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            setBorders(headerStyle);

            CellStyle cellStyle = workbook.createCellStyle();
            setBorders(cellStyle);

            Sheet sheet = workbook.createSheet("Certificates Registry");
            String[] headers = {
                    "Certificate Code", "Recipient Name", "Employee Code", "Department",
                    "Subject Track", "Score Earned", "Max Score", "Percentage",
                    "Grade", "Issue Date", "Status", "Verification URL"
            };

            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(22);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Certificate c : certs) {
                Row row = sheet.createRow(rowIdx++);
                row.setHeightInPoints(18);

                createCell(row, 0, c.getCertificateCode(), cellStyle);
                createCell(row, 1, c.getEmployee() != null && c.getEmployee().getUser() != null ? c.getEmployee().getUser().getFullName() : "-", cellStyle);
                createCell(row, 2, c.getEmployee() != null ? c.getEmployee().getEmployeeCode() : "-", cellStyle);
                createCell(row, 3, c.getEmployee() != null ? c.getEmployee().getDepartment() : "-", cellStyle);
                createCell(row, 4, c.getSubject(), cellStyle);
                createCell(row, 5, String.valueOf(c.getScore()), cellStyle);
                createCell(row, 6, String.valueOf(c.getMaxScore()), cellStyle);
                createCell(row, 7, c.getPercentage() + "%", cellStyle);
                createCell(row, 8, c.getGrade() != null ? c.getGrade().name() : "-", cellStyle);
                createCell(row, 9, c.getIssueDate() != null ? c.getIssueDate().toString() : "-", cellStyle);
                createCell(row, 10, c.getStatus() != null ? c.getStatus().name() : "-", cellStyle);
                createCell(row, 11, c.getVerificationUrl() != null ? c.getVerificationUrl() : "/verify/" + c.getCertificateCode(), cellStyle);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    /**
     * Generates an Excel workbook containing the master examination catalog.
     */
    @Transactional(readOnly = true)
    public byte[] generateExaminationsExcel() throws Exception {
        List<Examination> exams = examinationRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            setBorders(headerStyle);

            CellStyle cellStyle = workbook.createCellStyle();
            setBorders(cellStyle);

            Sheet sheet = workbook.createSheet("Examinations Catalog");
            String[] headers = {
                    "Exam Code", "Exam Title", "Subject Track", "Set Name",
                    "Duration (Minutes)", "Total Questions", "Total Marks",
                    "Passing Percentage", "Proctoring Mode", "Active Status"
            };

            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(22);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Examination e : exams) {
                Row row = sheet.createRow(rowIdx++);
                row.setHeightInPoints(18);

                createCell(row, 0, e.getCode(), cellStyle);
                createCell(row, 1, e.getTitle(), cellStyle);
                createCell(row, 2, e.getSubject(), cellStyle);
                createCell(row, 3, e.getSetName(), cellStyle);
                createCell(row, 4, String.valueOf(e.getDurationMinutes()), cellStyle);
                createCell(row, 5, String.valueOf(e.getTotalQuestions()), cellStyle);
                createCell(row, 6, String.valueOf(e.getTotalMarks()), cellStyle);
                createCell(row, 7, e.getPassingPercentage() + "%", cellStyle);
                createCell(row, 8, e.getProctoringMode() != null ? e.getProctoringMode().name() : "-", cellStyle);
                createCell(row, 9, e.isActive() ? "ACTIVE" : "INACTIVE", cellStyle);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(baos);
            return baos.toByteArray();
        }
    }

    private void createCell(Row row, int colIdx, String value, CellStyle style) {
        Cell cell = row.createCell(colIdx);
        cell.setCellValue(value != null ? value : "");
        cell.setCellStyle(style);
    }
}

