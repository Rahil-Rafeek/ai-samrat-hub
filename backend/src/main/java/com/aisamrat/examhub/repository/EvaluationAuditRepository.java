package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.EvaluationAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationAuditRepository extends JpaRepository<EvaluationAudit, Long> {
    List<EvaluationAudit> findBySubmissionIdOrderByTimestampDesc(Long submissionId);
}

