package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.Examination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    Optional<Examination> findByCode(String code);
    List<Examination> findByIsActiveTrue();
    List<Examination> findBySubject(String subject);
}

