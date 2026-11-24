package com.devai.secretshield.model;
import java.util.List;
public record Finding(String id, String ruleId, String type, String title, String severity, int confidenceScore, String confidenceLevel, int line, int column, String maskedValue, String reason, List<String> evidence, String remediation, List<String> detectedBy, boolean suppressed, String suppressionReason) {}
