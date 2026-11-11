package com.aisamrat.examhub.enums;

public enum Difficulty {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED;

    public static Difficulty fromString(String val) {
        if (val == null) return BEGINNER;
        return switch (val.trim().toUpperCase()) {
            case "INTERMEDIATE" -> INTERMEDIATE;
            case "ADVANCED" -> ADVANCED;
            default -> BEGINNER;
        };
    }
}

