package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.AttemptQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttemptQuestionRepository extends JpaRepository<AttemptQuestion, Long> {
    List<AttemptQuestion> findByAttemptIdOrderByDisplayOrderAsc(Long attemptId);
    Optional<AttemptQuestion> findByAttemptIdAndDisplayOrder(Long attemptId, Integer displayOrder);

    @Query("SELECT COUNT(aq) FROM AttemptQuestion aq WHERE aq.attempt.id = :attemptId AND aq.selectedOption IS NOT NULL")
    long countAnsweredByAttemptId(@Param("attemptId") Long attemptId);

    @Query("SELECT COUNT(aq) FROM AttemptQuestion aq WHERE aq.attempt.id = :attemptId AND aq.isMarkedForReview = true")
    long countMarkedForReviewByAttemptId(@Param("attemptId") Long attemptId);
}

