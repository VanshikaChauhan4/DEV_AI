package com.devai.impactradar.model;

import java.util.List;

public record RiskResult(
    int score,
    String level,
    String levelLabel,
    List<RiskSignal> signals,
    String testEvidence,
    List<String> recommendations,
    String methodology,
    String disclaimer
) {}
