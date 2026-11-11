package com.aisamrat.examhub.service;

import com.aisamrat.examhub.entity.*;
import com.aisamrat.examhub.enums.Difficulty;
import com.aisamrat.examhub.enums.ProctoringMode;
import com.aisamrat.examhub.enums.Role;
import com.aisamrat.examhub.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class DataInitializerService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializerService.class);

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectRepository subjectRepository;
    private final QuestionRepository questionRepository;
    private final ExaminationRepository examinationRepository;
    private final CertificateRepository certificateRepository;
    private final ExaminationAttemptRepository examinationAttemptRepository;
    private final SubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializerService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            SubjectRepository subjectRepository,
            QuestionRepository questionRepository,
            ExaminationRepository examinationRepository,
            CertificateRepository certificateRepository,
            ExaminationAttemptRepository examinationAttemptRepository,
            SubmissionRepository submissionRepository,
            PasswordEncoder passwordEncoder,
            ObjectMapper objectMapper,
            JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.subjectRepository = subjectRepository;
        this.questionRepository = questionRepository;
        this.examinationRepository = examinationRepository;
        this.certificateRepository = certificateRepository;
        this.examinationAttemptRepository = examinationAttemptRepository;
        this.submissionRepository = submissionRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting AI SAMRAT Assessment Hub seed data initialization...");

        // 0. Ensure schema compatibility for H2/PostgreSQL
        ensureSchemaCompatibility();

        // 1. Seed Departments
        seedDepartments();

        // 2. Seed Users & Demo Accounts
        seedUsersAndEmployees();

        // 3. Seed Subjects
        seedSubjects();

        // 4. Seed 600 Question Bank
        seedQuestionBank();

        // 5. Seed Default Active Examinations
        seedExaminations();

        // 6. Seed Sample Demonstration Certificate
        seedSampleCertificate();

        log.info("AI SAMRAT Assessment Hub seed data initialization complete.");
    }

    private void ensureSchemaCompatibility() {
        if (jdbcTemplate == null) return;
        try {
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN IF NOT EXISTS account_status VARCHAR(30) DEFAULT 'ACTIVE'");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN IF NOT EXISTS exam_eligibility VARCHAR(30) DEFAULT 'ELIGIBLE'");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN IF NOT EXISTS activation_token VARCHAR(128)");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN IF NOT EXISTS activation_token_expiry TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN IF NOT EXISTS joining_date VARCHAR(30)");
            jdbcTemplate.execute("ALTER TABLE employees ADD COLUMN IF NOT EXISTS assigned_exam_ids VARCHAR(500) DEFAULT 'ALL'");
            jdbcTemplate.execute("UPDATE employees SET account_status = 'ACTIVE' WHERE account_status IS NULL");
            jdbcTemplate.execute("UPDATE employees SET exam_eligibility = 'ELIGIBLE' WHERE exam_eligibility IS NULL");
            jdbcTemplate.execute("UPDATE employees SET assigned_exam_ids = 'ALL' WHERE assigned_exam_ids IS NULL");

            // Certificates table compatibility
            jdbcTemplate.execute("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS exam_date DATE");
            jdbcTemplate.execute("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS revocation_reason VARCHAR(500)");
            jdbcTemplate.execute("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS revoked_by VARCHAR(100)");
            jdbcTemplate.execute("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS signatory_name VARCHAR(100) DEFAULT 'Deepak Ganer'");
            jdbcTemplate.execute("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS signatory_title VARCHAR(150) DEFAULT 'Director & Authorised Signatory'");
            jdbcTemplate.execute("UPDATE certificates SET signatory_name = 'Deepak Ganer' WHERE signatory_name IS NULL");
            jdbcTemplate.execute("UPDATE certificates SET signatory_title = 'Director & Authorised Signatory' WHERE signatory_title IS NULL");
            log.info("Schema compatibility verified successfully for employees and certificates tables.");
        } catch (Exception e) {
            log.warn("Schema compatibility notice: {}", e.getMessage());
        }
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            departmentRepository.save(new Department("AI_LAB", "Artificial Intelligence & Robotics", "Core AI Research and Neural Architectures"));
            departmentRepository.save(new Department("DATA_SCI", "Data Science & Analytics", "Big Data Engineering and Statistical Modeling"));
            departmentRepository.save(new Department("ENTERPRISE", "Enterprise Software Engineering", "Cloud-native Java, Distributed Systems & Backend"));
            departmentRepository.save(new Department("DEVOPS", "DevOps & Infrastructure", "Site Reliability, Shell Scripting & Cloud Automation"));
            departmentRepository.save(new Department("FRONTEND", "Web & Interactive Media", "Frontend Engineering, React & UI/UX Systems"));
            log.info("Seeded 5 enterprise departments.");
        }
    }

    private void seedUsersAndEmployees() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", passwordEncoder.encode("Admin@1234"), "Vikramaditya Sharma", "admin@aisamrat.com", Role.SUPER_ADMIN);
            userRepository.save(admin);
            log.info("Seeded Super Admin user: admin / Admin@1234");
        }

        if (!userRepository.existsByUsername("evaluator")) {
            User evaluator = new User("evaluator", passwordEncoder.encode("Eval@1234"), "Prof. Ananya Sen", "evaluator@aisamrat.com", Role.EVALUATOR);
            userRepository.save(evaluator);
            log.info("Seeded Evaluator user: evaluator / Eval@1234");
        }

        // Demo Employees (Emp@1234)
        createEmployeeIfMissing("emp001", "Emp@1234", "EMP-2026-001", "Arjun Mehta", "arjun.m@aisamrat.com", "Artificial Intelligence & Robotics", "Senior AI Engineer", "+91-9876543210");
        createEmployeeIfMissing("emp002", "Emp@1234", "EMP-2026-002", "Rhea Kapoor", "rhea.k@aisamrat.com", "Data Science & Analytics", "Data Scientist", "+91-9876543211");
        createEmployeeIfMissing("emp003", "Emp@1234", "EMP-2026-003", "Devendra Patel", "devendra.p@aisamrat.com", "Enterprise Software Engineering", "Lead Java Architect", "+91-9876543212");
        createEmployeeIfMissing("emp004", "Emp@1234", "EMP-2026-004", "Sneha Roy", "sneha.r@aisamrat.com", "Web & Interactive Media", "Staff Frontend Engineer", "+91-9876543213");
        createEmployeeIfMissing("emp005", "Emp@1234", "EMP-2026-005", "Kabir Das", "kabir.d@aisamrat.com", "DevOps & Infrastructure", "Site Reliability Specialist", "+91-9876543214");
    }

    private void createEmployeeIfMissing(String username, String rawPassword, String code, String name, String email, String dept, String designation, String phone) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User(username, passwordEncoder.encode(rawPassword), name, email, Role.EMPLOYEE);
            user.setEnabled(true);
            user = userRepository.save(user);

            Employee emp = new Employee(user, code, dept, designation, phone);
            emp.setAccountStatus(com.aisamrat.examhub.enums.AccountStatus.ACTIVE);
            emp.setExamEligibility(com.aisamrat.examhub.enums.ExamEligibility.ELIGIBLE);
            emp.setAssignedExamIds("ALL");
            employeeRepository.save(emp);
            log.info("Seeded Employee: {} ({}) / {}", username, code, rawPassword);
        } else {
            userRepository.findByUsername(username).ifPresent(u -> {
                if (!u.isEnabled()) {
                    u.setEnabled(true);
                    userRepository.save(u);
                }
                employeeRepository.findByUserId(u.getId()).ifPresent(e -> {
                    if (e.getAccountStatus() == null || e.getAccountStatus() != com.aisamrat.examhub.enums.AccountStatus.ACTIVE) {
                        e.setAccountStatus(com.aisamrat.examhub.enums.AccountStatus.ACTIVE);
                        employeeRepository.save(e);
                    }
                });
            });
        }
    }

    private void seedSubjects() {
        createSubjectIfMissing("AI", "Artificial Intelligence", "Foundational AI, heuristic search, agent architectures, knowledge representation, game playing, and neural systems.", "BrainCircuit");
        createSubjectIfMissing("ML", "Machine Learning", "Supervised, unsupervised, deep learning, loss optimization, feature engineering, and ensemble methods.", "Cpu");
        createSubjectIfMissing("DS", "Data Science", "Statistical inference, hypothesis testing, Pandas, NumPy, time series, PCA, and high-dimensional analytics.", "BarChart3");
        createSubjectIfMissing("JAVA", "Java Programming", "Java 21 LTS, OOP, Collections, Concurrency, Virtual Threads, JVM internals, memory models, and Streams.", "Coffee");
        createSubjectIfMissing("WEB", "Web Development", "HTML5/CSS3, ES6+, React, DOM, event loops, WebSockets, WebRTC, security headers, and browser APIs.", "Globe");
        createSubjectIfMissing("SHELL", "Shell Scripting", "Bash programming, POSIX utilities, AWK, SED, process management, signals, and automation pipelines.", "Terminal");
    }

    private void createSubjectIfMissing(String code, String name, String description, String icon) {
        if (!subjectRepository.existsByCode(code)) {
            subjectRepository.save(new Subject(code, name, description, icon));
        }
    }

    private void seedQuestionBank() {
        if (questionRepository.count() < 600) {
            try {
                ClassPathResource resource = new ClassPathResource("data/questions_bank_600.json");
                if (resource.exists()) {
                    try (InputStream is = resource.getInputStream()) {
                        List<Map<String, Object>> list = objectMapper.readValue(is, new TypeReference<>() {});
                        for (Map<String, Object> map : list) {
                            String qCode = (String) map.getOrDefault("question_code", map.get("id"));
                            if (qCode != null && !questionRepository.existsByQuestionCode(qCode)) {
                                Question q = new Question();
                                q.setQuestionCode(qCode);
                                q.setSubject((String) map.get("subject"));
                                q.setTopic((String) map.get("topic"));
                                String diffStr = ((String) map.getOrDefault("difficulty", "INTERMEDIATE")).toUpperCase();
                                q.setDifficulty(Difficulty.valueOf(diffStr));
                                q.setQuestionText((String) map.getOrDefault("question_text", map.get("questionText")));
                                q.setOptionA((String) map.getOrDefault("option_a", map.get("optionA")));
                                q.setOptionB((String) map.getOrDefault("option_b", map.get("optionB")));
                                q.setOptionC((String) map.getOrDefault("option_c", map.get("optionC")));
                                q.setOptionD((String) map.getOrDefault("option_d", map.get("optionD")));
                                q.setCorrectOption((String) map.getOrDefault("correct_option", map.get("correctOption")));
                                q.setExplanation((String) map.get("explanation"));
                                q.setMarks(((Number) map.getOrDefault("marks", 2.0)).doubleValue());
                                q.setSetName((String) map.getOrDefault("set_name", map.getOrDefault("setName", "A")));
                                questionRepository.save(q);
                            }
                        }
                        log.info("Successfully loaded 600 questions into database.");
                    }
                }
            } catch (Exception e) {
                log.error("Failed to load 600 question bank seed: {}", e.getMessage(), e);
            }
        }
    }

    private void seedExaminations() {
        if (examinationRepository.count() == 0) {
            List<String> subjects = List.of(
                    "Artificial Intelligence",
                    "Machine Learning",
                    "Data Science",
                    "Java Programming",
                    "Web Development",
                    "Shell Scripting"
            );

            for (String sub : subjects) {
                String subCode = sub.toUpperCase().replace(" ", "_");
                // Set A
                Examination examA = new Examination();
                examA.setTitle(sub + " Technical Competency Assessment (Set A)");
                examA.setCode(subCode + "_EXAM_A");
                examA.setSubject(sub);
                examA.setSetName("A");
                examA.setDurationMinutes(60);
                examA.setTotalQuestions(50);
                examA.setMarksPerQuestion(2.0);
                examA.setTotalMarks(100.0);
                examA.setPassingPercentage(60.0);
                examA.setProctoringMode(ProctoringMode.CALIBRATED);
                examA.setTabSwitchLimit(3);
                examA.setFullscreenExitLimit(3);
                examA.setActive(true);
                examA.setInstructions("Comprehensive technical evaluation for " + sub + ". Ensure full screen is maintained and camera remains active.");
                examinationRepository.save(examA);

                // Set B
                Examination examB = new Examination();
                examB.setTitle(sub + " Technical Competency Assessment (Set B)");
                examB.setCode(subCode + "_EXAM_B");
                examB.setSubject(sub);
                examB.setSetName("B");
                examB.setDurationMinutes(60);
                examB.setTotalQuestions(50);
                examB.setMarksPerQuestion(2.0);
                examB.setTotalMarks(100.0);
                examB.setPassingPercentage(60.0);
                examB.setProctoringMode(ProctoringMode.CALIBRATED);
                examB.setTabSwitchLimit(3);
                examB.setFullscreenExitLimit(3);
                examB.setActive(true);
                examB.setInstructions("Comprehensive technical evaluation for " + sub + ". Ensure full screen is maintained and camera remains active.");
                examinationRepository.save(examB);
            }
            log.info("Seeded 12 standardized active examinations across all 6 subjects.");
        } else {
            List<Examination> allExams = examinationRepository.findAll();
            for (Examination e : allExams) {
                e.setTabSwitchLimit(3);
                e.setFullscreenExitLimit(3);
            }
            examinationRepository.saveAll(allExams);
            log.info("Updated all active examinations to 3-warning security policy.");
        }
    }

    private void seedSampleCertificate() {
        if (!certificateRepository.existsByCertificateCode("AIS-CERT-2026-X8841")) {
            employeeRepository.findByEmployeeCode("EMP-2026-001").ifPresent(emp -> {
                examinationRepository.findAll().stream()
                        .filter(e -> "Artificial Intelligence".equals(e.getSubject()))
                        .findFirst()
                        .ifPresent(exam -> {
                            java.time.Instant now = java.time.Instant.now();
                            ExaminationAttempt attempt = new ExaminationAttempt();
                            attempt.setAttemptUuid(java.util.UUID.randomUUID().toString());
                            attempt.setEmployee(emp);
                            attempt.setExamination(exam);
                            attempt.setAssignedSet("A");
                            attempt.setStatus(com.aisamrat.examhub.enums.AttemptStatus.SUBMITTED);
                            attempt.setStartedAt(now.minusSeconds(3600));
                            attempt.setExpectedEndTime(now);
                            attempt.setSubmittedAt(now.minusSeconds(120));
                            attempt.setDurationSecondsTaken(3480L);
                            attempt.setTotalQuestions(50);
                            attempt.setAnsweredCount(50);
                            attempt.setMarksAwarded(94.0);
                            attempt.setPercentage(94.0);
                            attempt.setPassed(true);
                            attempt.setTabSwitchViolations(0);
                            attempt.setFullscreenExitViolations(0);
                            attempt = examinationAttemptRepository.save(attempt);

                            Submission submission = new Submission();
                            submission.setAttempt(attempt);
                            submission.setEmployee(emp);
                            submission.setSubject(exam.getSubject());
                            submission.setSetName("A");
                            submission.setOriginalScore(94.0);
                            submission.setFinalScore(94.0);
                            submission.setMaxScore(100.0);
                            submission.setPercentage(94.0);
                            submission.setEvaluationStatus(com.aisamrat.examhub.enums.EvaluationStatus.APPROVED);
                            submission.setCreatedAt(now.minusSeconds(120));
                            submission.setReviewedBy("System Automated Evaluator");
                            submission.setReviewedAt(now.minusSeconds(60));
                            submission = submissionRepository.save(submission);

                            Certificate cert = new Certificate();
                            cert.setCertificateCode("AIS-CERT-2026-X8841");
                            cert.setEmployee(emp);
                            cert.setSubject("Artificial Intelligence & Intelligent Systems");
                            cert.setAttempt(attempt);
                            cert.setSubmission(submission);
                            cert.setIssueDate(java.time.LocalDate.now());
                            cert.setGrade(com.aisamrat.examhub.enums.CertificateGrade.DISTINCTION);
                            cert.setScore(94.0);
                            cert.setMaxScore(100.0);
                            cert.setPercentage(94.0);
                            cert.setStatus(com.aisamrat.examhub.enums.CertificateStatus.VALID);
                            certificateRepository.save(cert);
                            log.info("Seeded authentic demonstration certificate AIS-CERT-2026-X8841 for {}", emp.getUser().getFullName());
                        });
            });
        }
    }
}
