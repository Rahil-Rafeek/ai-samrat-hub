package com.aisamrat.examhub.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(length = 100)
    private String designation;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false, length = 30)
    private com.aisamrat.examhub.enums.AccountStatus accountStatus = com.aisamrat.examhub.enums.AccountStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_eligibility", nullable = false, length = 30)
    private com.aisamrat.examhub.enums.ExamEligibility examEligibility = com.aisamrat.examhub.enums.ExamEligibility.ELIGIBLE;

    @Column(name = "activation_token", length = 128)
    private String activationToken;

    @Column(name = "activation_token_expiry")
    private Instant activationTokenExpiry;

    @Column(name = "joining_date", length = 30)
    private String joiningDate;

    @Column(name = "assigned_exam_ids", length = 500)
    private String assignedExamIds = "ALL";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Employee() {}

    public Employee(User user, String employeeCode, String department, String designation, String phone) {
        this.user = user;
        this.employeeCode = employeeCode;
        this.department = department;
        this.designation = designation;
        this.phone = phone;
        this.accountStatus = com.aisamrat.examhub.enums.AccountStatus.ACTIVE;
        this.examEligibility = com.aisamrat.examhub.enums.ExamEligibility.ELIGIBLE;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public com.aisamrat.examhub.enums.AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(com.aisamrat.examhub.enums.AccountStatus accountStatus) { this.accountStatus = accountStatus; }

    public com.aisamrat.examhub.enums.ExamEligibility getExamEligibility() { return examEligibility; }
    public void setExamEligibility(com.aisamrat.examhub.enums.ExamEligibility examEligibility) { this.examEligibility = examEligibility; }

    public String getActivationToken() { return activationToken; }
    public void setActivationToken(String activationToken) { this.activationToken = activationToken; }

    public Instant getActivationTokenExpiry() { return activationTokenExpiry; }
    public void setActivationTokenExpiry(Instant activationTokenExpiry) { this.activationTokenExpiry = activationTokenExpiry; }

    public String getJoiningDate() { return joiningDate; }
    public void setJoiningDate(String joiningDate) { this.joiningDate = joiningDate; }

    public String getAssignedExamIds() { return assignedExamIds; }
    public void setAssignedExamIds(String assignedExamIds) { this.assignedExamIds = assignedExamIds; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

