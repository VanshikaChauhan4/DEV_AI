package com.devai.impactradar.model;

import jakarta.validation.constraints.NotBlank;

public record RiskRequest(@NotBlank(message = "Change description is required") String input) {}
