package com.aisamrat.examhub;

import com.aisamrat.examhub.dto.CodeExecutionRequest;
import com.aisamrat.examhub.dto.CodeExecutionResponse;
import com.aisamrat.examhub.service.CodeExecutionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CodeExecutionTest {

    private final CodeExecutionService service = new CodeExecutionService();

    @Test
    @DisplayName("Verify problem catalog loading and initial test case definitions")
    void testProblemCatalog() {
        List<CodeExecutionService.CodingProblem> problems = service.getAllProblems();
        assertNotNull(problems);
        assertTrue(problems.size() >= 3, "Catalog should have at least 3 coding problems");

        CodeExecutionService.CodingProblem twoSum = service.getProblem("two-sum");
        assertNotNull(twoSum);
        assertEquals("BEGINNER", twoSum.difficulty());
        assertTrue(twoSum.starterCode().containsKey("JAVA"));
        assertTrue(twoSum.starterCode().containsKey("PYTHON"));
        assertTrue(twoSum.starterCode().containsKey("JAVASCRIPT"));
        assertEquals(4, twoSum.testCases().size(), "Two sum should have 4 test cases");
    }

    @Test
    @DisplayName("Execute Java Solution for Two Sum - Expect 100% Pass")
    void testJavaExecution() {
        CodeExecutionService.CodingProblem twoSum = service.getProblem("two-sum");
        String code = twoSum.starterCode().get("JAVA");

        CodeExecutionRequest request = new CodeExecutionRequest("JAVA", code, "two-sum", null);
        CodeExecutionResponse response = service.executeCode(request);

        assertNotNull(response);
        assertEquals("PASSED", response.status());
        assertEquals(4, response.totalTestCases());
        assertEquals(4, response.passedTestCases());
        assertTrue(response.totalExecutionTimeMs() >= 0);
    }

    @Test
    @DisplayName("Execute Empty Code - Expect Validation Error")
    void testEmptyCodeValidation() {
        CodeExecutionRequest request = new CodeExecutionRequest("JAVA", "   ", "two-sum", null);
        CodeExecutionResponse response = service.executeCode(request);

        assertEquals("ERROR", response.status());
        assertEquals(0, response.passedTestCases());
    }
}

