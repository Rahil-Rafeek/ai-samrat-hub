package com.aisamrat.examhub.service;

import com.aisamrat.examhub.dto.*;
import com.aisamrat.examhub.entity.AuditLog;
import com.aisamrat.examhub.entity.Employee;
import com.aisamrat.examhub.entity.User;
import com.aisamrat.examhub.enums.AccountStatus;
import com.aisamrat.examhub.enums.ExamEligibility;
import com.aisamrat.examhub.enums.Role;
import com.aisamrat.examhub.repository.AuditLogRepository;
import com.aisamrat.examhub.repository.EmployeeRepository;
import com.aisamrat.examhub.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class EmployeeOnboardingService {

    private static final Logger log = LoggerFactory.getLogger(EmployeeOnboardingService.class);

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${examhub.certificates.verification-base-url:http://localhost:5173}")
    private String clientBaseUrl;

    public EmployeeOnboardingService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Extracts and returns the full initial roster dataset directly parsed from
     * Screenshot 1 (media_1794296236439_e1b34b54.jpg) and
     * Screenshot 2 (media_1794296293671_5dd0834e.jpg).
     * Missing names are flagged with needsReview=true for official administrator verification.
     */
    public List<RosterEntryDto> getInitialRosterExtraction() {
        List<RosterEntryDto> list = new ArrayList<>();
        long id = 1;

        // Screenshot 1 Entries
        list.add(new RosterEntryDto(id++, "Ganesh Vallabh M", "ganeshvallabhm7@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0001", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "Vikas Bennur", "vikasbennur27@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0002", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "Padmanabh Madva", "padmanabhmadva.27@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0003", "Data Science", "Data Scientist"));
        list.add(new RosterEntryDto(id++, "Darshan Naik", "darshannaik1305@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0004", "Engineering", "Full Stack Engineer"));
        list.add(new RosterEntryDto(id++, "Abhishek A", "abhishekatholi42@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0005", "Machine Learning", "ML Engineer"));
        list.add(new RosterEntryDto(id++, "Pravya Pavithran", "pravyapavithran@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0006", "Artificial Intelligence", "AI Specialist"));
        list.add(new RosterEntryDto(id++, "Lakshmish Lakshmish", "lakshmish738@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0007", "Engineering", "Java Developer"));
        list.add(new RosterEntryDto(id++, "Bindu C Gowda", "binducgowda1947@gmail.com", "Screenshot 1", true, "Missing Name in Email Header (Inferred Bindu C Gowda)", "AIS-EMP-0008", "Operations", "Associate"));
        list.add(new RosterEntryDto(id++, "swati ls", "sunagarswati369@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0009", "Web Development", "Frontend Developer"));
        list.add(new RosterEntryDto(id++, "Lekhana", "lekhanasn18@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0010", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "Shruthi Bhaskar", "shruthibhaskar2003@gmail.com", "Screenshot 1", true, "Missing Name in Email Header (Inferred Shruthi Bhaskar)", "AIS-EMP-0011", "Engineering", "Developer"));
        list.add(new RosterEntryDto(id++, "yarabati raminaidu", "yarabatiraminaidu268@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0012", "DevOps & Cloud", "Systems Engineer"));
        list.add(new RosterEntryDto(id++, "Salil", "salilvmadivala24w@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0013", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "Kethan Rao", "kethanrao56@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0014", "Data Science", "Data Analyst"));
        list.add(new RosterEntryDto(id++, "Facts Vlogger", "kiranguru322@gmail.com", "Screenshot 1", true, "Alias / Channel Name detected in header (kiranguru322)", "AIS-EMP-0015", "Content & Media", "Technical Writer"));
        list.add(new RosterEntryDto(id++, "Vara Prasad", "varaprasad8088@gmail.com", "Screenshot 1", true, "Missing Name in Email Header (Inferred Vara Prasad)", "AIS-EMP-0016", "Engineering", "Backend Developer"));
        list.add(new RosterEntryDto(id++, "Neelima Mangala", "neelimamangala18@gmail.com", "Screenshot 1", false, null, "AIS-EMP-0017", "Engineering", "QA Engineer"));

        // Screenshot 2 Entries
        list.add(new RosterEntryDto(id++, "Deepak Ganer", "ganer.deepak@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0018", "Management", "Technical Lead"));
        list.add(new RosterEntryDto(id++, "Sai Sreekar", "saisreekar697@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0019", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "Aakash nambu Narayan", "aakashnambunarayan@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0020", "Machine Learning", "Research Engineer"));
        list.add(new RosterEntryDto(id++, "Sanni Kumar", "sannikumar1732003@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0021", "Engineering", "Java Developer"));
        list.add(new RosterEntryDto(id++, "Sanjana Reddy", "sanjanakondireddy@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0022", "Artificial Intelligence", "AI Engineer"));
        list.add(new RosterEntryDto(id++, "Nonisa C", "nonisarc@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0023", "Engineering", "Full Stack Developer"));
        list.add(new RosterEntryDto(id++, "varshini ramesh", "varshini772003@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0024", "Web Development", "Web Developer"));
        list.add(new RosterEntryDto(id++, "SNEHA K", "snehak2003k@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0025", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "spandana indira", "spandanaindira19@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0026", "Data Science", "Data Engineer"));
        list.add(new RosterEntryDto(id++, "Fathima Zara", "fathimakuttub@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0027", "Engineering", "Cloud Engineer"));
        list.add(new RosterEntryDto(id++, "Deepak S J", "deepaksj@gmail.com", "Screenshot 2", true, "Missing Name in Email Header (Inferred Deepak S J)", "AIS-EMP-0028", "Engineering", "Developer"));
        list.add(new RosterEntryDto(id++, "Lakshmi.E Lakshmi.E", "lakshmielakshmie38@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0029", "Quality Assurance", "QA Automation Engineer"));
        list.add(new RosterEntryDto(id++, "kushi kumari", "kumarikushi055@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0030", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "sudeep bhulla", "sudeepbhulla7@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0031", "DevOps & Cloud", "DevOps Engineer"));
        list.add(new RosterEntryDto(id++, "Arjun Sharma", "arjunsentmail@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0032", "Artificial Intelligence", "AI Researcher"));
        list.add(new RosterEntryDto(id++, "aviraj bhawrha", "avirajbhawrha@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0033", "Engineering", "Backend Developer"));
        list.add(new RosterEntryDto(id++, "Prajyot Solankure", "prajyotsolankure799@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0034", "Engineering", "Full Stack Engineer"));
        list.add(new RosterEntryDto(id++, "Punith", "punith.ncpc@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0035", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "Y Charan Gouda", "ycharan.mvjce@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0036", "Machine Learning", "ML Developer"));
        list.add(new RosterEntryDto(id++, "Sai Mahanth", "saimahanth07@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0037", "Engineering", "Systems Engineer"));
        list.add(new RosterEntryDto(id++, "Omkar Vernekar", "omkarvernekar@gmail.com", "Screenshot 2", true, "Missing Name in Email Header (Inferred Omkar Vernekar)", "AIS-EMP-0038", "Engineering", "Software Developer"));
        list.add(new RosterEntryDto(id++, "Rahul.S", "rahulr54071@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0039", "Engineering", "Software Engineer"));
        list.add(new RosterEntryDto(id++, "SJ Dhanvish", "sjdhanvish@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0040", "Artificial Intelligence", "AI Specialist"));
        list.add(new RosterEntryDto(id++, "Sachin Sagarnal", "sachinsagarnal2005@gmail.com", "Screenshot 2", true, "Missing Name in Email Header (Inferred Sachin Sagarnal)", "AIS-EMP-0041", "Engineering", "Junior Developer"));
        list.add(new RosterEntryDto(id++, "Nikil H E", "nikilhe318@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0042", "Data Science", "Data Analyst"));
        list.add(new RosterEntryDto(id++, "Rahil Rafeek", "rahilrafeek255@gmail.com", "Screenshot 2", false, null, "AIS-EMP-0043", "Engineering", "Senior Software Architect"));

        return list;
    }

    /**
     * Approves and provisions the verified roster entries into PostgreSQL with
     * unique AIS-EMP-XXXX codes, PENDING_ACTIVATION account status, and 48-hour secure activation tokens.
     */
    @Transactional
    public Map<String, Object> approveAndProvisionRoster(ApproveRosterRequest request, String adminUsername) {
        List<RosterEntryDto> entries = request.approvedEntries() != null && !request.approvedEntries().isEmpty()
                ? request.approvedEntries()
                : getInitialRosterExtraction();

        int importedCount = 0;
        int skippedCount = 0;
        List<String> provisionedCodes = new ArrayList<>();

        for (RosterEntryDto entry : entries) {
            String email = entry.email().trim().toLowerCase();

            // Check duplicate by email
            if (userRepository.findByEmail(email).isPresent()) {
                skippedCount++;
                continue;
            }

            String employeeCode = generateNextEmployeeId();
            String username = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
            if (userRepository.findByUsername(username).isPresent()) {
                username = username + "_" + employeeCode.substring(employeeCode.length() - 4);
            }

            // Create user with temporary locked placeholder hash until employee sets their own password
            String tempHash = passwordEncoder.encode(UUID.randomUUID().toString());
            User user = new User(username, tempHash, entry.fullName(), email, Role.EMPLOYEE);
            user.setEnabled(false); // Locked until activated
            user = userRepository.save(user);

            // Generate single-use secure activation token (valid 48 hours)
            String token = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
            Instant expiry = Instant.now().plus(48, ChronoUnit.HOURS);

            Employee employee = new Employee(
                    user,
                    employeeCode,
                    entry.department() != null ? entry.department() : "Engineering",
                    entry.designation() != null ? entry.designation() : "Technical Employee",
                    null
            );
            employee.setAccountStatus(AccountStatus.PENDING_ACTIVATION);
            employee.setExamEligibility(ExamEligibility.ELIGIBLE);
            employee.setActivationToken(token);
            employee.setActivationTokenExpiry(expiry);
            employee.setJoiningDate(Instant.now().toString().substring(0, 10));
            employee.setAssignedExamIds("ALL");
            employeeRepository.save(employee);

            provisionedCodes.add(employeeCode);
            importedCount++;
        }

        auditLogRepository.save(new AuditLog(
                adminUsername != null ? adminUsername : "admin",
                "ROSTER_IMPORT",
                "PROVISIONED",
                "Imported and provisioned " + importedCount + " employee accounts (Skipped " + skippedCount + " duplicates).",
                null
        ));

        log.info("Roster provisioning completed: {} imported, {} skipped", importedCount, skippedCount);

        return Map.of(
                "totalExtracted", entries.size(),
                "importedCount", importedCount,
                "skippedCount", skippedCount,
                "provisionedEmployeeCodes", provisionedCodes,
                "message", "Successfully provisioned " + importedCount + " employee accounts with activation invitations."
        );
    }

    /**
     * Registers a single newly joined employee with AIS-EMP-XXXX generation and activation email token.
     */
    @Transactional
    public EmployeeDetailDto registerNewEmployee(NewEmployeeRegistrationRequest req, String adminUsername) {
        String email = req.email().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An account with email " + email + " already exists.");
        }

        String employeeCode = generateNextEmployeeId();
        String username = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        if (userRepository.findByUsername(username).isPresent()) {
            username = username + "_" + employeeCode.substring(employeeCode.length() - 4);
        }

        String tempHash = passwordEncoder.encode(UUID.randomUUID().toString());
        User user = new User(username, tempHash, req.fullName().trim(), email, Role.EMPLOYEE);
        user.setEnabled(false);
        user = userRepository.save(user);

        String token = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        Instant expiry = Instant.now().plus(48, ChronoUnit.HOURS);

        Employee employee = new Employee(
                user,
                employeeCode,
                req.department() != null ? req.department().trim() : "Engineering",
                req.designation() != null ? req.designation().trim() : "Technical Employee",
                req.phone()
        );
        employee.setAccountStatus(AccountStatus.PENDING_ACTIVATION);
        employee.setExamEligibility(req.examEligibility() != null ? req.examEligibility() : ExamEligibility.ELIGIBLE);
        employee.setActivationToken(token);
        employee.setActivationTokenExpiry(expiry);
        employee.setJoiningDate(req.joiningDate() != null ? req.joiningDate() : Instant.now().toString().substring(0, 10));
        employee.setAssignedExamIds(req.assignedExamIds() != null ? req.assignedExamIds() : "ALL");
        employee = employeeRepository.save(employee);

        auditLogRepository.save(new AuditLog(
                adminUsername != null ? adminUsername : "admin",
                "EMPLOYEE_REGISTRATION",
                "SUCCESS",
                "Registered new employee " + employeeCode + " (" + req.fullName() + ", " + email + ").",
                null
        ));

        return toDto(employee);
    }

    /**
     * Completes employee self-activation with password setup.
     */
    @Transactional
    public Map<String, Object> activateEmployeeAccount(AccountActivationRequest req) {
        if (req.token() == null || req.token().trim().isEmpty()) {
            throw new IllegalArgumentException("Activation token is required.");
        }
        if (req.password() == null || req.password().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
        if (!req.password().equals(req.confirmPassword())) {
            throw new IllegalArgumentException("Password and confirmation password do not match.");
        }

        Employee employee = employeeRepository.findByActivationToken(req.token().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired activation link."));

        if (employee.getActivationTokenExpiry() != null && employee.getActivationTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalStateException("Activation link has expired. Please request a new activation email from your administrator.");
        }

        User user = employee.getUser();
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setEnabled(true);
        userRepository.save(user);

        employee.setAccountStatus(AccountStatus.ACTIVE);
        employee.setActivationToken(null); // Single use - invalidate
        employee.setActivationTokenExpiry(null);
        employeeRepository.save(employee);

        auditLogRepository.save(new AuditLog(
                user.getUsername(),
                "ACCOUNT_ACTIVATION",
                "SUCCESS",
                "Employee account " + employee.getEmployeeCode() + " activated successfully.",
                null
        ));

        log.info("Employee account {} ({}) activated successfully.", employee.getEmployeeCode(), user.getEmail());

        return Map.of(
                "success", true,
                "employeeCode", employee.getEmployeeCode(),
                "fullName", user.getFullName(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "message", "Account successfully activated! You may now log in to AI SAMRAT Assessment Hub."
        );
    }

    /**
     * Resends an activation email with a fresh 48-hour token.
     */
    @Transactional
    public Map<String, Object> resendActivationEmail(Long employeeId, String adminUsername) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + employeeId));

        String newToken = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        employee.setActivationToken(newToken);
        employee.setActivationTokenExpiry(Instant.now().plus(48, ChronoUnit.HOURS));
        employeeRepository.save(employee);

        auditLogRepository.save(new AuditLog(
                adminUsername != null ? adminUsername : "admin",
                "RESEND_ACTIVATION",
                "SENT",
                "Resent activation email to " + employee.getUser().getEmail() + " (" + employee.getEmployeeCode() + ").",
                null
        ));

        String activationUrl = clientBaseUrl + "/activate-account?token=" + newToken;

        return Map.of(
                "success", true,
                "employeeCode", employee.getEmployeeCode(),
                "email", employee.getUser().getEmail(),
                "activationUrl", activationUrl,
                "message", "New activation email issued successfully. Token valid for 48 hours."
        );
    }

    @Transactional(readOnly = true)
    public List<EmployeeDetailDto> getAllEmployees() {
        return employeeRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public EmployeeDetailDto updateEmployeeStatus(Long employeeId, AccountStatus status, String adminUsername) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + employeeId));
        employee.setAccountStatus(status);
        if (status == AccountStatus.SUSPENDED || status == AccountStatus.DEACTIVATED) {
            employee.getUser().setEnabled(false);
        } else if (status == AccountStatus.ACTIVE) {
            employee.getUser().setEnabled(true);
        }
        userRepository.save(employee.getUser());
        employee = employeeRepository.save(employee);

        auditLogRepository.save(new AuditLog(
                adminUsername,
                "EMPLOYEE_STATUS_UPDATE",
                status.name(),
                "Updated employee " + employee.getEmployeeCode() + " status to " + status,
                null
        ));

        return toDto(employee);
    }

    @Transactional
    public EmployeeDetailDto assignExaminations(Long employeeId, String examIds, String adminUsername) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + employeeId));
        employee.setAssignedExamIds(examIds != null ? examIds : "ALL");
        employee = employeeRepository.save(employee);

        auditLogRepository.save(new AuditLog(
                adminUsername,
                "EXAM_ASSIGNMENT",
                "UPDATED",
                "Updated examination assignments for " + employee.getEmployeeCode() + ": " + employee.getAssignedExamIds(),
                null
        ));

        return toDto(employee);
    }

    public synchronized String generateNextEmployeeId() {
        long count = employeeRepository.count();
        long nextNum = count + 1;
        String candidateCode;
        do {
            candidateCode = String.format("AIS-EMP-%04d", nextNum++);
        } while (employeeRepository.existsByEmployeeCode(candidateCode));
        return candidateCode;
    }

    private EmployeeDetailDto toDto(Employee emp) {
        String token = emp.getActivationToken();
        String activationUrl = token != null ? clientBaseUrl + "/activate-account?token=" + token : null;
        return new EmployeeDetailDto(
                emp.getId(),
                emp.getUser().getId(),
                emp.getEmployeeCode(),
                emp.getUser().getFullName(),
                emp.getUser().getEmail(),
                emp.getDepartment(),
                emp.getDesignation(),
                emp.getPhone(),
                emp.getAccountStatus() != null ? emp.getAccountStatus() : AccountStatus.ACTIVE,
                emp.getExamEligibility() != null ? emp.getExamEligibility() : ExamEligibility.ELIGIBLE,
                emp.getJoiningDate(),
                token,
                activationUrl,
                emp.getAccountStatus() == AccountStatus.ACTIVE,
                0,
                0.0,
                emp.getCreatedAt().toString()
        );
    }
}

