package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.Employee;
import com.aisamrat.examhub.enums.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByEmployeeCodeIgnoreCase(String employeeCode);
    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findByActivationToken(String activationToken);
    Optional<Employee> findByUserEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);
    long countByAccountStatus(AccountStatus status);
}
