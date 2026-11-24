package com.devai.secretshield.model;
import java.util.List;
public record ScanResult(String status, String scanId, int totalFindings, int critical, int high, int medium, int low, int info, int suppressed, String summary, long durationMs, int inputBytes, List<String> detectors, List<String> limitations, List<Finding> findings) {}
