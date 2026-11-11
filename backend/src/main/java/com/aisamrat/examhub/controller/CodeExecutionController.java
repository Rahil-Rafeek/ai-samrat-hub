package com.aisamrat.examhub.controller;

import com.aisamrat.examhub.dto.CodeExecutionRequest;
import com.aisamrat.examhub.dto.CodeExecutionResponse;
import com.aisamrat.examhub.service.CodeExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coding")
@CrossOrigin(origins = "*")
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    public CodeExecutionController(CodeExecutionService codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }

    @GetMapping("/problems")
    public ResponseEntity<List<CodeExecutionService.CodingProblem>> getCodingProblems() {
        return ResponseEntity.ok(codeExecutionService.getAllProblems());
    }

    @GetMapping("/problems/{id}")
    public ResponseEntity<CodeExecutionService.CodingProblem> getProblemById(@PathVariable String id) {
        CodeExecutionService.CodingProblem problem = codeExecutionService.getProblem(id);
        if (problem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(problem);
    }

    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(@RequestBody CodeExecutionRequest request) {
        CodeExecutionResponse response = codeExecutionService.executeCode(request);
        return ResponseEntity.ok(response);
    }
}

