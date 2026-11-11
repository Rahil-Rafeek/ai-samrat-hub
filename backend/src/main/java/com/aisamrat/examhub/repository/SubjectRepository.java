package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCode(String code);
    Optional<Subject> findByName(String name);
    boolean existsByCode(String code);
}

