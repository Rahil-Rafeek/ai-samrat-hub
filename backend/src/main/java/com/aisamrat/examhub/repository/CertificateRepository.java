package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.Certificate;
import com.aisamrat.examhub.enums.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateCode(String certificateCode);
    Optional<Certificate> findByAttemptId(Long attemptId);
    List<Certificate> findByEmployeeIdOrderByIssueDateDesc(Long employeeId);
    List<Certificate> findByStatus(CertificateStatus status);
    boolean existsByCertificateCode(String certificateCode);
    long countByStatus(CertificateStatus status);
}

