package com.devai.secretshield.model;
import jakarta.validation.constraints.NotBlank;
public record ScanRequest(@NotBlank String input) {}
