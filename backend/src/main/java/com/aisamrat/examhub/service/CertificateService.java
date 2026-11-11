package com.aisamrat.examhub.service;

import com.aisamrat.examhub.dto.CertificateVerifyResponse;
import com.aisamrat.examhub.entity.*;
import com.aisamrat.examhub.enums.CertificateGrade;
import com.aisamrat.examhub.enums.CertificateStatus;
import com.aisamrat.examhub.repository.CertificateRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Optional;

@Service
public class CertificateService {

    private static final Logger log = LoggerFactory.getLogger(CertificateService.class);

    private final CertificateRepository certificateRepository;
    private final String verificationBaseUrl;
    private final String issuerName;
    private final String directorName;
    private final String directorTitle;
    private final SecureRandom secureRandom = new SecureRandom();

    public CertificateService(
            CertificateRepository certificateRepository,
            @Value("${examhub.certificates.verification-base-url:http://localhost:5173/verify}") String verificationBaseUrl,
            @Value("${examhub.certificates.issuer-name:AI SAMRAT PRIVATE LIMITED}") String issuerName,
            @Value("${examhub.certificates.director-name:Deepak Ganer}") String directorName,
            @Value("${examhub.certificates.director-title:Director & Authorised Signatory}") String directorTitle) {
        this.certificateRepository = certificateRepository;
        this.verificationBaseUrl = verificationBaseUrl;
        this.issuerName = issuerName;
        this.directorName = directorName;
        this.directorTitle = directorTitle;
    }

    @Transactional
    public Certificate generateCertificateForSubmission(Submission submission) {
        // Prevent duplicate certificate
        Optional<Certificate> existing = certificateRepository.findByAttemptId(submission.getAttempt().getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        CertificateGrade grade = CertificateGrade.fromPercentage(submission.getPercentage());
        if (grade == CertificateGrade.NONE) {
            log.info("Submission {} with score {}% does not qualify for a certificate (minimum 60.0% required).",
                    submission.getId(), submission.getPercentage());
            return null;
        }

        String certCode = generateUniqueCertCode();
        String verifyUrl = verificationBaseUrl.contains("?")
                ? verificationBaseUrl + "&code=" + certCode
                : verificationBaseUrl + "?code=" + certCode;

        // Generate QR code base64 pointing to actual verification URL
        String qrBase64 = generateQrCodeBase64(verifyUrl, 250, 250);

        LocalDate examDate = LocalDate.now();
        if (submission.getAttempt() != null && submission.getAttempt().getSubmittedAt() != null) {
            examDate = submission.getAttempt().getSubmittedAt().atZone(ZoneId.systemDefault()).toLocalDate();
        }

        Certificate certificate = new Certificate();
        certificate.setCertificateCode(certCode);
        certificate.setEmployee(submission.getEmployee());
        certificate.setSubject(submission.getSubject());
        certificate.setAttempt(submission.getAttempt());
        certificate.setSubmission(submission);
        certificate.setIssueDate(LocalDate.now());
        certificate.setExamDate(examDate);
        certificate.setGrade(grade);
        certificate.setScore(submission.getFinalScore());
        certificate.setMaxScore(submission.getMaxScore());
        certificate.setPercentage(submission.getPercentage());
        certificate.setStatus(CertificateStatus.VALID);
        certificate.setQrCodeBase64(qrBase64);
        certificate.setVerificationUrl(verifyUrl);
        certificate.setSignatoryName(directorName);
        certificate.setSignatoryTitle(directorTitle);

        // Generate and save physical PDF to disk
        try {
            String pdfPath = createPdfFile(certificate, qrBase64);
            certificate.setPdfPath(pdfPath);
        } catch (Exception e) {
            log.error("Failed to generate PDF file for certificate {}: {}", certCode, e.getMessage());
        }

        certificate = certificateRepository.save(certificate);
        log.info("Issued Certificate {} to employee {} for {} ({})",
                certCode, submission.getEmployee().getEmployeeCode(), submission.getSubject(), grade);

        return certificate;
    }

    public String getCertificateCodeForAttempt(Long attemptId) {
        return certificateRepository.findByAttemptId(attemptId)
                .map(Certificate::getCertificateCode)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public CertificateVerifyResponse verifyCertificate(String certificateCode) {
        Optional<Certificate> certOpt = certificateRepository.findByCertificateCode(certificateCode.trim().toUpperCase());

        if (certOpt.isEmpty()) {
            return new CertificateVerifyResponse(
                    false,
                    certificateCode,
                    null, null, null, null, null, null, null, null, null, null,
                    null,
                    issuerName, directorName, directorTitle,
                    "CERTIFICATE NOT FOUND: The provided certificate ID is not recorded in the official AI SAMRAT credential registry.",
                    null, null, null
            );
        }

        Certificate cert = certOpt.get();
        boolean isValid = cert.getStatus() == CertificateStatus.VALID;
        String msg;
        if (cert.getStatus() == CertificateStatus.REVOKED) {
            msg = "REVOKED CERTIFICATE: This credential was revoked by administrative governance. Reason: " +
                    (cert.getRevocationReason() != null ? cert.getRevocationReason() : "Official governance administrative decision.");
        } else if (isValid) {
            msg = "AUTHENTIC & VERIFIED: This official AI SAMRAT Enterprise Technical Certificate is valid, active and verifiable.";
        } else {
            msg = "INACTIVE CERTIFICATE: Credential status is " + cert.getStatus();
        }

        return new CertificateVerifyResponse(
                isValid,
                cert.getCertificateCode(),
                cert.getEmployee().getUser().getFullName(),
                cert.getEmployee().getEmployeeCode(),
                cert.getSubject(),
                cert.getGrade(),
                cert.getGrade().getDisplayName(),
                cert.getScore(),
                cert.getMaxScore(),
                cert.getPercentage(),
                cert.getIssueDate(),
                cert.getExamDate() != null ? cert.getExamDate() : cert.getIssueDate(),
                cert.getStatus(),
                issuerName,
                cert.getSignatoryName() != null ? cert.getSignatoryName() : directorName,
                cert.getSignatoryTitle() != null ? cert.getSignatoryTitle() : directorTitle,
                msg,
                cert.getRevokedAt(),
                cert.getRevocationReason(),
                cert.getQrCodeBase64()
        );
    }

    @Transactional
    public Certificate revokeCertificate(String certificateCode, String reason, String revokedBy) {
        Certificate cert = certificateRepository.findByCertificateCode(certificateCode.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found: " + certificateCode));

        cert.setStatus(CertificateStatus.REVOKED);
        cert.setRevocationReason(reason);
        cert.setRevokedAt(Instant.now());
        cert.setRevokedBy(revokedBy != null ? revokedBy : "SUPER_ADMIN");

        // Update PDF to reflect revoked status
        try {
            String pdfPath = createPdfFile(cert, cert.getQrCodeBase64());
            cert.setPdfPath(pdfPath);
        } catch (Exception e) {
            log.warn("Could not regenerate revoked PDF: {}", e.getMessage());
        }

        return certificateRepository.save(cert);
    }

    @Transactional(readOnly = true)
    public byte[] generatePdfBytes(String certificateCode) throws Exception {
        Certificate cert = certificateRepository.findByCertificateCode(certificateCode.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found: " + certificateCode));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        writePdfToStream(cert, cert.getQrCodeBase64(), baos);
        return baos.toByteArray();
    }

    private String createPdfFile(Certificate cert, String qrBase64) throws Exception {
        File dir = new File("./data/certificates");
        if (!dir.exists()) dir.mkdirs();

        File pdfFile = new File(dir, cert.getCertificateCode() + ".pdf");
        try (FileOutputStream fos = new FileOutputStream(pdfFile)) {
            writePdfToStream(cert, qrBase64, fos);
        }
        return pdfFile.getAbsolutePath();
    }

    private void writePdfToStream(Certificate cert, String qrBase64, java.io.OutputStream out) throws Exception {
        // Landscape A4 for enterprise certificate (842 x 595 points)
        Document document = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
        PdfWriter writer = PdfWriter.getInstance(document, out);
        document.open();

        PdfContentByte cb = writer.getDirectContent();
        float pageWidth = PageSize.A4.rotate().getWidth();
        float pageHeight = PageSize.A4.rotate().getHeight();

        // 1. Subtle warm ivory background wash
        cb.setColorFill(new Color(252, 252, 250));
        cb.rectangle(0, 0, pageWidth, pageHeight);
        cb.fill();

        // 2. Refined Geometric Double Border: Outer Charcoal Navy + Inner Gold
        cb.setColorStroke(new Color(15, 23, 42)); // Deep Charcoal Navy
        cb.setLineWidth(3.5f);
        cb.rectangle(20, 20, pageWidth - 40, pageHeight - 40);
        cb.stroke();

        cb.setColorStroke(new Color(217, 119, 6)); // Warm Gold Accent
        cb.setLineWidth(1.2f);
        cb.rectangle(26, 26, pageWidth - 52, pageHeight - 52);
        cb.stroke();

        // Delicate corner ornamental brackets
        float[][] corners = {
                {26, 26}, {pageWidth - 26, 26}, {26, pageHeight - 26}, {pageWidth - 26, pageHeight - 26}
        };
        cb.setColorStroke(new Color(180, 83, 9));
        cb.setLineWidth(1.5f);
        for (float[] c : corners) {
            float x = c[0];
            float y = c[1];
            float dx = (x < pageWidth / 2) ? 12 : -12;
            float dy = (y < pageHeight / 2) ? 12 : -12;
            cb.moveTo(x, y + dy);
            cb.lineTo(x, y);
            cb.lineTo(x + dx, y);
            cb.stroke();
        }

        // 3. Subtle background watermark using the official AI SAMRAT logo
        byte[] logoRawBytes = null;
        try (InputStream is = getClass().getResourceAsStream("/logo.png")) {
            if (is != null) {
                logoRawBytes = is.readAllBytes();
            }
        } catch (Exception e) {
            log.warn("Logo resource read exception: {}", e.getMessage());
        }

        if (logoRawBytes != null) {
            try {
                Image wmImg = Image.getInstance(logoRawBytes);
                wmImg.scaleToFit(380, 140);
                float wmX = (pageWidth - wmImg.getScaledWidth()) / 2;
                float wmY = (pageHeight - wmImg.getScaledHeight()) / 2 + 10;
                wmImg.setAbsolutePosition(wmX, wmY);

                PdfGState gstate = new PdfGState();
                gstate.setFillOpacity(0.045f);
                cb.saveState();
                cb.setGState(gstate);
                cb.addImage(wmImg);
                cb.restoreState();
            } catch (Exception e) {
                log.warn("Watermark render exception: {}", e.getMessage());
            }
        }

        // 4. Header: Official AI SAMRAT Logo
        if (logoRawBytes != null) {
            try {
                Image logoTop = Image.getInstance(logoRawBytes);
                logoTop.scaleToFit(160, 48);
                logoTop.setAlignment(Element.ALIGN_CENTER);
                document.add(logoTop);
            } catch (Exception e) {
                Paragraph logoFallback = new Paragraph("AI SAMRAT",
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Font.NORMAL, new Color(0, 82, 204)));
                logoFallback.setAlignment(Element.ALIGN_CENTER);
                document.add(logoFallback);
            }
        }

        Paragraph orgName = new Paragraph("AI SAMRAT PRIVATE LIMITED",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Font.NORMAL, new Color(15, 23, 42)));
        orgName.setAlignment(Element.ALIGN_CENTER);
        orgName.setSpacingBefore(2);
        document.add(orgName);

        Paragraph orgSub = new Paragraph("Enterprise Technical Assessment & Certification",
                FontFactory.getFont(FontFactory.HELVETICA, 8, Font.NORMAL, new Color(100, 116, 139)));
        orgSub.setAlignment(Element.ALIGN_CENTER);
        orgSub.setSpacingBefore(1);
        document.add(orgSub);

        // 5. Main Title: CERTIFICATE OF ACHIEVEMENT
        Paragraph mainTitle = new Paragraph("CERTIFICATE OF ACHIEVEMENT",
                FontFactory.getFont(FontFactory.TIMES_BOLD, 24, Font.NORMAL, new Color(15, 23, 42)));
        mainTitle.setAlignment(Element.ALIGN_CENTER);
        mainTitle.setSpacingBefore(8);
        document.add(mainTitle);

        // 6. Recipient Section
        Paragraph presentedTo = new Paragraph("This certificate is proudly presented to",
                FontFactory.getFont(FontFactory.TIMES_ITALIC, 11, Font.NORMAL, new Color(71, 85, 105)));
        presentedTo.setAlignment(Element.ALIGN_CENTER);
        presentedTo.setSpacingBefore(8);
        document.add(presentedTo);

        String candidateName = cert.getEmployee() != null && cert.getEmployee().getUser() != null
                ? cert.getEmployee().getUser().getFullName().toUpperCase()
                : "CANDIDATE";
        Paragraph empName = new Paragraph(candidateName,
                FontFactory.getFont(FontFactory.TIMES_BOLD, 20, Font.NORMAL, new Color(29, 78, 216)));
        empName.setAlignment(Element.ALIGN_CENTER);
        empName.setSpacingBefore(4);
        document.add(empName);

        String empCode = cert.getEmployee() != null ? cert.getEmployee().getEmployeeCode() : "-";
        String empDept = cert.getEmployee() != null ? cert.getEmployee().getDepartment() : "-";
        Paragraph empMeta = new Paragraph("Employee ID: " + empCode + "   |   Department: " + empDept,
                FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, new Color(100, 116, 139)));
        empMeta.setAlignment(Element.ALIGN_CENTER);
        empMeta.setSpacingBefore(2);
        document.add(empMeta);

        // 7. Achievement Section
        Paragraph forCompleting = new Paragraph("For successfully completing the",
                FontFactory.getFont(FontFactory.TIMES_ROMAN, 10, Font.NORMAL, new Color(71, 85, 105)));
        forCompleting.setAlignment(Element.ALIGN_CENTER);
        forCompleting.setSpacingBefore(8);
        document.add(forCompleting);

        Paragraph subjectTitle = new Paragraph(cert.getSubject() + " Technical Assessment",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Font.NORMAL, new Color(15, 23, 42)));
        subjectTitle.setAlignment(Element.ALIGN_CENTER);
        subjectTitle.setSpacingBefore(2);
        document.add(subjectTitle);

        // 8. Supporting statement
        Paragraph statement = new Paragraph(
                "\"This certificate is proudly presented in recognition of successfully demonstrating technical knowledge and competency through the AI SAMRAT Enterprise Technical Assessment.\"",
                FontFactory.getFont(FontFactory.TIMES_ITALIC, 9, Font.NORMAL, new Color(51, 65, 85)));
        statement.setAlignment(Element.ALIGN_CENTER);
        statement.setSpacingBefore(6);
        statement.setIndentationLeft(50);
        statement.setIndentationRight(50);
        document.add(statement);

        // 9. Performance details badge table
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        String examDateStr = cert.getExamDate() != null ? cert.getExamDate().format(dtf) : cert.getIssueDate().format(dtf);
        String issueDateStr = cert.getIssueDate().format(dtf);

        PdfPTable perfTable = new PdfPTable(4);
        perfTable.setWidthPercentage(82);
        perfTable.setWidths(new float[]{25f, 25f, 25f, 25f});
        perfTable.setSpacingBefore(10);

        addPerfCell(perfTable, "Assessment Score", String.format("%.1f", cert.getScore()) + " / " + String.format("%.1f", cert.getMaxScore()));
        addPerfCell(perfTable, "Achievement Level", cert.getGrade() != null ? cert.getGrade().getDisplayName() : "CERTIFIED");
        addPerfCell(perfTable, "Examination Date", examDateStr);
        addPerfCell(perfTable, "Certificate Issue Date", issueDateStr);
        document.add(perfTable);

        // 10. Footer Section: Verification Details | QR Code | Authorised Signatory
        PdfPTable footer = new PdfPTable(3);
        footer.setWidthPercentage(92);
        footer.setWidths(new float[]{34f, 32f, 34f});
        footer.setSpacingBefore(18);

        // Left Cell: Verification
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);
        leftCell.addElement(new Paragraph("CERTIFICATE ID:",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Font.NORMAL, new Color(100, 116, 139))));
        leftCell.addElement(new Paragraph(cert.getCertificateCode(),
                FontFactory.getFont(FontFactory.COURIER_BOLD, 9, Font.NORMAL, new Color(15, 23, 42))));

        String statusText = cert.getStatus() == CertificateStatus.VALID ? "VERIFIED & ACTIVE" : "REVOKED";
        Color statusColor = cert.getStatus() == CertificateStatus.VALID ? new Color(16, 185, 129) : new Color(225, 29, 72);
        Paragraph statusP = new Paragraph("Status: " + statusText,
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Font.NORMAL, statusColor));
        statusP.setSpacingBefore(2);
        leftCell.addElement(statusP);

        Paragraph urlP = new Paragraph(cert.getVerificationUrl() != null ? cert.getVerificationUrl() : ("https://aisamrat.com/verify?code=" + cert.getCertificateCode()),
                FontFactory.getFont(FontFactory.HELVETICA, 6.5f, Font.NORMAL, new Color(100, 116, 139)));
        urlP.setSpacingBefore(2);
        leftCell.addElement(urlP);
        footer.addCell(leftCell);

        // Middle Cell: QR Code
        PdfPCell qrCell = new PdfPCell();
        qrCell.setBorder(Rectangle.NO_BORDER);
        qrCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        if (qrBase64 != null) {
            try {
                byte[] qrBytes = Base64.getDecoder().decode(qrBase64);
                Image qrImg = Image.getInstance(qrBytes);
                qrImg.scaleToFit(56, 56);
                qrImg.setAlignment(Element.ALIGN_CENTER);
                qrCell.addElement(qrImg);

                Paragraph qrLabel = new Paragraph("Scan to Verify Credential",
                        FontFactory.getFont(FontFactory.HELVETICA, 6.5f, Font.NORMAL, new Color(100, 116, 139)));
                qrLabel.setAlignment(Element.ALIGN_CENTER);
                qrLabel.setSpacingBefore(2);
                qrCell.addElement(qrLabel);
            } catch (Exception e) {
                log.warn("QR render in PDF exception: {}", e.getMessage());
            }
        }
        footer.addCell(qrCell);

        // Right Cell: Authorised Signatory
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Paragraph sigLine = new Paragraph("____________________________",
                FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, new Color(148, 163, 184)));
        sigLine.setAlignment(Element.ALIGN_RIGHT);
        rightCell.addElement(sigLine);

        Paragraph signatory = new Paragraph("Deepak Ganer",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Font.NORMAL, new Color(15, 23, 42)));
        signatory.setAlignment(Element.ALIGN_RIGHT);
        signatory.setSpacingBefore(2);
        rightCell.addElement(signatory);

        Paragraph sigRole = new Paragraph("Director & Authorised Signatory",
                FontFactory.getFont(FontFactory.HELVETICA, 8, Font.NORMAL, new Color(71, 85, 105)));
        sigRole.setAlignment(Element.ALIGN_RIGHT);
        rightCell.addElement(sigRole);

        Paragraph compName = new Paragraph("AI SAMRAT PRIVATE LIMITED",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, Font.NORMAL, new Color(100, 116, 139)));
        compName.setAlignment(Element.ALIGN_RIGHT);
        rightCell.addElement(compName);

        footer.addCell(rightCell);
        document.add(footer);

        // 11. If REVOKED, stamp prominent diagonal watermark
        if (cert.getStatus() == CertificateStatus.REVOKED) {
            PdfGState revokedState = new PdfGState();
            revokedState.setFillOpacity(0.35f);
            cb.saveState();
            cb.setGState(revokedState);
            cb.setColorFill(new Color(225, 29, 72));
            cb.beginText();
            cb.setFontAndSize(BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.WINANSI, false), 54);
            cb.showTextAligned(Element.ALIGN_CENTER, "REVOKED / CANCELLED", pageWidth / 2, pageHeight / 2 - 10, 32);
            cb.endText();
            cb.restoreState();
        }

        document.close();
    }

    private void addPerfCell(PdfPTable table, String label, String value) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(248, 250, 252));
        cell.setBorderColor(new Color(226, 232, 240));
        cell.setPadding(5f);

        Paragraph lblP = new Paragraph(label.toUpperCase(),
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 6.5f, Font.NORMAL, new Color(100, 116, 139)));
        lblP.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(lblP);

        Paragraph valP = new Paragraph(value,
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, Font.NORMAL, new Color(15, 23, 42)));
        valP.setAlignment(Element.ALIGN_CENTER);
        valP.setSpacingBefore(1);
        cell.addElement(valP);

        table.addCell(cell);
    }

    private String generateQrCodeBase64(String content, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            return Base64.getEncoder().encodeToString(pngOutputStream.toByteArray());
        } catch (Exception e) {
            log.error("Failed to generate QR code: {}", e.getMessage());
            return null;
        }
    }

    private String generateUniqueCertCode() {
        long nextSeq = certificateRepository.count() + 1;
        String candidate = String.format("AIS-CERT-2026-%06d", nextSeq);
        while (certificateRepository.existsByCertificateCode(candidate)) {
            nextSeq++;
            candidate = String.format("AIS-CERT-2026-%06d", nextSeq);
        }
        return candidate;
    }
}
