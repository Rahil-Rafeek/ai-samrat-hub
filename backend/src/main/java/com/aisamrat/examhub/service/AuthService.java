package com.aisamrat.examhub.service;

import com.aisamrat.examhub.dto.AuthRequest;
import com.aisamrat.examhub.dto.AuthResponse;
import com.aisamrat.examhub.entity.Employee;
import com.aisamrat.examhub.entity.User;
import com.aisamrat.examhub.enums.Role;
import com.aisamrat.examhub.repository.EmployeeRepository;
import com.aisamrat.examhub.repository.UserRepository;
import com.aisamrat.examhub.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        String input = request.username() != null ? request.username().trim() : "";
        if (input.isEmpty() || request.password() == null) {
            throw new BadCredentialsException("Username/Email/Employee ID and password are required.");
        }

        // Support lookup by:
        // 1. Exact or case-insensitive username (e.g. emp001, admin, evaluator)
        // 2. Email address (e.g. arjun.m@aisamrat.com, ganeshvallabhm7@gmail.com)
        // 3. Employee ID / Code (e.g. AIS-EMP-0001, EMP-2026-001)
        User user = userRepository.findByUsername(input)
                .or(() -> userRepository.findByUsernameIgnoreCase(input))
                .or(() -> userRepository.findByEmailIgnoreCase(input))
                .or(() -> employeeRepository.findByEmployeeCodeIgnoreCase(input).map(Employee::getUser))
                .orElseThrow(() -> new BadCredentialsException("Invalid username, email, or employee ID."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password. Please check your credentials.");
        }

        if (!user.isEnabled()) {
            throw new BadCredentialsException("This account is pending activation or disabled. Please activate your account first.");
        }

        Employee employee = null;
        if (user.getRole() == Role.EMPLOYEE) {
            employee = employeeRepository.findByUserId(user.getId()).orElse(null);
        }

        Long employeeId = employee != null ? employee.getId() : null;
        String employeeCode = employee != null ? employee.getEmployeeCode() : null;
        String department = employee != null ? employee.getDepartment() : "Administration";
        String designation = employee != null ? employee.getDesignation() : user.getRole().name();

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole(), user.getId(), employeeId);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                user.getId(),
                employeeId,
                employeeCode,
                department,
                designation
        );
    }

    @Transactional
    public AuthResponse registerCandidate(com.aisamrat.examhub.dto.CandidateSelfRegistrationRequest req) {
        String email = req.email() != null ? req.email().trim().toLowerCase() : "";
        if (email.isEmpty()) {
            throw new IllegalArgumentException("Valid email address is required.");
        }
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new IllegalArgumentException("An account with email " + email + " already exists. Please sign in.");
        }

        String fName = req.firstName() != null ? req.firstName().trim() : "";
        String lName = req.lastName() != null ? req.lastName().trim() : "";
        String fullName = (fName + " " + lName).trim();
        if (fullName.isEmpty()) {
            fullName = email.split("@")[0];
        }

        String username = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        if (userRepository.findByUsernameIgnoreCase(username).isPresent()) {
            username = username + "_" + (System.currentTimeMillis() % 10000);
        }

        long count = employeeRepository.count() + 1;
        String employeeCode = String.format("AIS-STU-%04d", count);

        User user = new User(
                username,
                passwordEncoder.encode(req.password() != null && !req.password().isBlank() ? req.password() : "Pass@1234"),
                fullName,
                email,
                Role.EMPLOYEE
        );
        user.setEnabled(true);
        user = userRepository.save(user);

        Employee employee = new Employee();
        employee.setUser(user);
        employee.setEmployeeCode(employeeCode);
        employee.setDepartment(req.stream() != null && !req.stream().isBlank() ? req.stream() : "Computer Science & Engineering");
        employee.setDesignation(req.semester() != null && !req.semester().isBlank() ? req.semester() : "Student Candidate");
        employee.setPhone(req.phoneNumber());
        employee.setAccountStatus(com.aisamrat.examhub.enums.AccountStatus.ACTIVE);
        employee.setExamEligibility(com.aisamrat.examhub.enums.ExamEligibility.ELIGIBLE);
        employee.setAssignedExamIds("ALL");
        employee = employeeRepository.save(employee);

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole(), user.getId(), employee.getId());

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                user.getId(),
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getDepartment(),
                employee.getDesignation()
        );
    }
}
