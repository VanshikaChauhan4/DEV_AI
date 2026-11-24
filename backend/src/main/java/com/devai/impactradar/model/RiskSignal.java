package com.devai.impactradar.model;

import java.util.List;

public record RiskSignal(String id, String label, int points, String explanation, List<String> matchedTerms) {}
