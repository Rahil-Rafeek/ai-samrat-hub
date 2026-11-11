package com.aisamrat.examhub.repository;

import com.aisamrat.examhub.entity.Question;
import com.aisamrat.examhub.enums.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Optional<Question> findByQuestionCode(String questionCode);
    boolean existsByQuestionCode(String questionCode);
    List<Question> findBySubjectAndSetName(String subject, String setName);
    List<Question> findBySubject(String subject);
    List<Question> findBySubjectAndDifficulty(String subject, Difficulty difficulty);
    long countBySubject(String subject);
    long countBySubjectAndSetName(String subject, String setName);

    @Query("SELECT DISTINCT q.subject FROM Question q")
    List<String> findDistinctSubjects();

    @Query("SELECT DISTINCT q.topic FROM Question q WHERE q.subject = :subject")
    List<String> findDistinctTopicsBySubject(@Param("subject") String subject);
}

