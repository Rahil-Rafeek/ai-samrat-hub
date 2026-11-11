package com.aisamrat.examhub;

import com.aisamrat.examhub.dto.*;
import com.aisamrat.examhub.entity.Employee;
import com.aisamrat.examhub.entity.User;
import com.aisamrat.examhub.enums.AccountStatus;
import com.aisamrat.examhub.enums.Role;
import com.aisamrat.examhub.repository.EmployeeRepository;
import com.aisamrat.examhub.repository.UserRepository;
import com.aisamrat.examhub.service.EmployeeOnboardingService;
import com.aisamrat.examhub.service.IntelligenceService;
import com.aisamrat.examhub.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class EmployeeOnboardingTest {

    @Autowired
    private EmployeeOnboardingService onboardingService;

    @Autowired
    private AuthService authService;

    @Autowired
    private IntelligenceService intelligenceService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Verify Initial Roster Extraction from Screenshot 1 & 2 (43 Entries)")
    void testRosterExtraction() {
        List<RosterEntryDto> roster = onboardingService.getInitialRosterExtraction();
        assertNotNull(roster);
        assertEquals(43, roster.size(), "Total extracted roster entries from both screenshots must equal 43");

        long needsReviewCount = roster.stream().filter(RosterEntryDto::needsReview).count();
        assertEquals(7, needsReviewCount, "Entries requiring administrator review (missing names/aliases) should be 7");

        long validDirectCount = roster.stream().filter(e -> !e.needsReview()).count();
        assertEquals(36, validDirectCount, "Valid entries with explicit names should be 36");

        // Verify specific entries from screenshots
        assertTrue(roster.stream().anyMatch(e -> e.email().equals("ganeshvallabhm7@gmail.com") && e.fullName().equals("Ganesh Vallabh M")));
        assertTrue(roster.stream().anyMatch(e -> e.email().equals("rahilrafeek255@gmail.com") && e.fullName().equals("Rahil Rafeek")));
        assertTrue(roster.stream().anyMatch(e -> e.email().equals("binducgowda1947@gmail.com") && e.needsReview()));
    }

    @Test
    @DisplayName("Verify Roster Provisioning, Unique AIS-EMP-XXXX Generation, and Secure Account Activation")
    @Transactional
    void testRosterProvisioningAndActivation() {
        // Provision initial roster
        Map<String, Object> provRes = onboardingService.approveAndProvisionRoster(new ApproveRosterRequest(null, "Engineering"), "admin");
        assertNotNull(provRes);
        int imported = (int) provRes.get("importedCount");
        assertTrue(imported >= 40, "Should import roster accounts into PostgreSQL");

        // Pick an unactivated employee
        Employee employee = employeeRepository.findAll().stream()
                .filter(e -> e.getAccountStatus() == AccountStatus.PENDING_ACTIVATION)
                .findFirst()
                .orElseThrow();

        assertNotNull(employee.getActivationToken());
        assertTrue(employee.getEmployeeCode().startsWith("AIS-EMP-"));
        assertFalse(employee.getUser().isEnabled());

        // Perform self-activation
        AccountActivationRequest actReq = new AccountActivationRequest(
                employee.getActivationToken(),
                "NewSecure@Pass2026",
                "NewSecure@Pass2026"
        );
        Map<String, Object> actRes = onboardingService.activateEmployeeAccount(actReq);
        assertTrue((Boolean) actRes.get("success"));

        // Verify employee is now ACTIVE and token is single-use invalidated
        Employee updated = employeeRepository.findById(employee.getId()).orElseThrow();
        assertEquals(AccountStatus.ACTIVE, updated.getAccountStatus());
        assertNull(updated.getActivationToken(), "Activation token must be nullified after single use");
        assertTrue(updated.getUser().isEnabled());
    }

    @Test
    @DisplayName("Verify Skill Matrix Calculation and Training Recommendations")
    @Transactional
    void testSkillMatrix() {
        Employee emp = employeeRepository.findByEmployeeCode("EMP-2026-001").orElseThrow();
        SkillMatrixDto matrix = intelligenceService.getEmployeeSkillMatrix(emp.getId());

        assertNotNull(matrix);
        assertEquals(emp.getEmployeeCode(), matrix.employeeCode());
        assertEquals(6, matrix.subjectProficiencies().size(), "Skill matrix must evaluate all 6 subjects");
        assertNotNull(matrix.recommendations());
    }

    @Test
    @DisplayName("Verify Employee Login Works via Username, Employee Code, and Email")
    @Transactional
    void testEmployeeLoginVariations() {
        // 1. Login via username
        var res1 = authService.login(new com.aisamrat.examhub.dto.AuthRequest("emp001", "Emp@1234"));
        assertNotNull(res1.token());
        assertEquals("emp001", res1.username());
        assertEquals("EMP-2026-001", res1.employeeCode());
        assertEquals(com.aisamrat.examhub.enums.Role.EMPLOYEE, res1.role());

        // 2. Login via employee code
        var res2 = authService.login(new com.aisamrat.examhub.dto.AuthRequest("EMP-2026-001", "Emp@1234"));
        assertNotNull(res2.token());
        assertEquals("EMP-2026-001", res2.employeeCode());

        // 3. Login via email
        var res3 = authService.login(new com.aisamrat.examhub.dto.AuthRequest("arjun.m@aisamrat.com", "Emp@1234"));
        assertNotNull(res3.token());
        assertEquals("EMP-2026-001", res3.employeeCode());

        // 4. Employee 3
        var res4 = authService.login(new com.aisamrat.examhub.dto.AuthRequest("emp003", "Emp@1234"));
        assertNotNull(res4.token());
        assertEquals("EMP-2026-003", res4.employeeCode());
    }
}

