package com.aisamrat.examhub.controller;

import com.aisamrat.examhub.dto.CertificateVerifyResponse;
import com.aisamrat.examhub.entity.Certificate;
import com.aisamrat.examhub.entity.Employee;
import com.aisamrat.examhub.entity.User;
import com.aisamrat.examhub.repository.CertificateRepository;
import com.aisamrat.examhub.repository.EmployeeRepository;
import com.aisamrat.examhub.repository.UserRepository;
import com.aisamrat.examhub.service.CertificateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public CertificateController(
            CertificateService certificateService,
            CertificateRepository certificateRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository) {
        this.certificateService = certificateService;
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Public verification endpoint.
     */
    @GetMapping("/verify/{code}")
    public ResponseEntity<CertificateVerifyResponse> verifyCertificate(@PathVariable String code) {
        return ResponseEntity.ok(certificateService.verifyCertificate(code));
    }

    /**
     * Download authentic OpenPDF generated certificate with QR code.
     */
    @GetMapping("/download/{code}")
    public ResponseEntity<byte[]> downloadCertificatePdf(@PathVariable String code) {
        try {
            byte[] pdfBytes = certificateService.generatePdfBytes(code);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"AI_SAMRAT_CERT_" + code + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Admin/Evaluator: retrieve all issued certificates.
     */
    @GetMapping("/all")
    public ResponseEntity<List<CertificateVerifyResponse>> getAllCertificates() {
        List<Certificate> certs = certificateRepository.findAll();
        List<CertificateVerifyResponse> list = certs.stream()
                .map(c -> certificateService.verifyCertificate(c.getCertificateCode()))
                .toList();
        return ResponseEntity.ok(list);
    }

    /**
     * Admin/Evaluator: Revoke an issued certificate with an official reason.
     */
    @PostMapping("/{code}/revoke")
    public ResponseEntity<CertificateVerifyResponse> revokeCertificate(
            @PathVariable String code,
            @RequestBody com.aisamrat.examhub.dto.RevokeCertificateRequest request,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "SUPER_ADMIN";
        Certificate revoked = certificateService.revokeCertificate(code, request.reason(), adminUser);
        return ResponseEntity.ok(certificateService.verifyCertificate(revoked.getCertificateCode()));
    }

    /**
     * Employee's certificates.
     */
    @GetMapping("/my")
    public ResponseEntity<List<CertificateVerifyResponse>> getMyCertificates(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Employee emp = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        List<Certificate> certs = certificateRepository.findByEmployeeIdOrderByIssueDateDesc(emp.getId());
        List<CertificateVerifyResponse> list = certs.stream()
                .map(c -> certificateService.verifyCertificate(c.getCertificateCode()))
                .toList();
        return ResponseEntity.ok(list);
    }
}

