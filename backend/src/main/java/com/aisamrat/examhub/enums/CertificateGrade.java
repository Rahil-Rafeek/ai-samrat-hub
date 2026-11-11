package com.aisamrat.examhub.enums;

public enum CertificateGrade {
    DISTINCTION,   // 90 - 100
    ACHIEVEMENT,   // 75 - 89
    PARTICIPATION, // 60 - 74
    NONE;          // < 60

    public static CertificateGrade fromPercentage(double percentage) {
        if (percentage >= 90.0) return DISTINCTION;
        if (percentage >= 75.0) return ACHIEVEMENT;
        if (percentage >= 60.0) return PARTICIPATION;
        return NONE;
    }

    public String getDisplayName() {
        return switch (this) {
            case DISTINCTION -> "OUTSTANDING – DISTINCTION";
            case ACHIEVEMENT -> "EXCELLENT – ACHIEVEMENT";
            case PARTICIPATION -> "SATISFACTORY – PARTICIPATION";
            case NONE -> "NO CERTIFICATE";
        };
    }
}

