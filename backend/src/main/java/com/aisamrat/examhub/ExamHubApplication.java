package com.aisamrat.examhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ExamHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExamHubApplication.class, args);
    }
}

