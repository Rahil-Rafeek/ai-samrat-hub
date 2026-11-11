package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.ExaminationAttempt;
import com.aisamrat.examhub.enums.AttemptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExaminationAttemptRepository extends JpaRepository<ExaminationAttempt, Long> {
    Optional<ExaminationAttempt> findByAttemptUuid(String attemptUuid);

    @Query("SELECT a FROM ExaminationAttempt a WHERE a.employee.id = :employeeId AND a.examination.id = :examId ORDER BY a.createdAt DESC")
    List<ExaminationAttempt> findByEmployeeAndExam(@Param("employeeId") Long employeeId, @Param("examId") Long examId);

    @Query("SELECT a FROM ExaminationAttempt a WHERE a.employee.id = :employeeId AND a.examination.id = :examId AND a.status = 'IN_PROGRESS' ORDER BY a.createdAt DESC")
    Optional<ExaminationAttempt> findActiveAttempt(@Param("employeeId") Long employeeId, @Param("examId") Long examId);

    List<ExaminationAttempt> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<ExaminationAttempt> findByStatus(AttemptStatus status);

    @Query("SELECT a FROM ExaminationAttempt a WHERE a.status = 'IN_PROGRESS' AND a.expectedEndTime < :now")
    List<ExaminationAttempt> findExpiredActiveAttempts(@Param("now") Instant now);

    long countByStatus(AttemptStatus status);
}

