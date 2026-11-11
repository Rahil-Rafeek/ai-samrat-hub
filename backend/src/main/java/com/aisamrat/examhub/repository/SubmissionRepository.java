package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.Submission;
import com.aisamrat.examhub.enums.EvaluationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Optional<Submission> findByAttemptId(Long attemptId);
    List<Submission> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<Submission> findByEvaluationStatus(EvaluationStatus status);
    List<Submission> findBySubjectOrderByCreatedAtDesc(String subject);

    @Query("SELECT AVG(s.finalScore) FROM Submission s")
    Double getAverageScore();

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.percentage >= 60.0")
    long countPassedSubmissions();

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.percentage >= 90.0")
    long countDistinctionSubmissions();
}

