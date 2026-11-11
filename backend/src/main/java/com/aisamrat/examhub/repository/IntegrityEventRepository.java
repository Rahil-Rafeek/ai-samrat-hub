package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.IntegrityEvent;
import com.aisamrat.examhub.enums.IntegrityEventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IntegrityEventRepository extends JpaRepository<IntegrityEvent, Long> {
    List<IntegrityEvent> findByAttemptIdOrderByTimestampAsc(Long attemptId);
    long countByAttemptIdAndEventType(Long attemptId, IntegrityEventType eventType);
}

