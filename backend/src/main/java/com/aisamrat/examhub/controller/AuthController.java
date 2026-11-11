package com.aisamrat.examhub.controller;

import com.aisamrat.examhub.dto.AuthRequest;
import com.aisamrat.examhub.dto.AuthResponse;
import com.aisamrat.examhub.entity.Employee;
import com.aisamrat.examhub.entity.User;
import com.aisamrat.examhub.enums.Role;
import com.aisamrat.examhub.repository.EmployeeRepository;
import com.aisamrat.examhub.repository.UserRepository;
import com.aisamrat.examhub.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final com.aisamrat.examhub.service.EmployeeOnboardingService onboardingService;

    public AuthController(
            AuthService authService,
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            com.aisamrat.examhub.service.EmployeeOnboardingService onboardingService) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.onboardingService = onboardingService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register-candidate")
    public ResponseEntity<AuthResponse> registerCandidate(@RequestBody com.aisamrat.examhub.dto.CandidateSelfRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerCandidate(request));
    }

    @PostMapping("/activate")
    public ResponseEntity<java.util.Map<String, Object>> activateAccount(@RequestBody com.aisamrat.examhub.dto.AccountActivationRequest request) {
        return ResponseEntity.ok(onboardingService.activateEmployeeAccount(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        Employee emp = null;
        if (user.getRole() == Role.EMPLOYEE) {
            emp = employeeRepository.findByUserId(user.getId()).orElse(null);
        }

        return ResponseEntity.ok(new AuthResponse(
                null,
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                user.getId(),
                emp != null ? emp.getId() : null,
                emp != null ? emp.getEmployeeCode() : null,
                emp != null ? emp.getDepartment() : "Administration",
                emp != null ? emp.getDesignation() : user.getRole().name()
        ));
    }
}

