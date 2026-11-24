
package com.devai.monitor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.util.*;

@Service
public class AgentAiService {

    private final RestClient client;
    private final String model;
    private final String apiKey;
    private final boolean enabled;

    public AgentAiService(
            @Value("${devmind.ai.base-url:https://generativelanguage.googleapis.com}") String baseUrl,
            @Value("${devmind.ai.model:gemini-2.5-flash}") String model,
            @Value("${devmind.ai.enabled:true}") boolean enabled,
            @Value("${devmind.ai.api-key:${GEMINI_API_KEY:}}") String apiKey) {

        SimpleClientHttpRequestFactory factory =
                new SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(10000);
        factory.setReadTimeout(120000);

        this.client = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .build();

        this.model = model;
        this.apiKey = apiKey;
        this.enabled = enabled;
    }

    public Map<String, Object> status() {

        boolean configured =
                enabled && apiKey != null && !apiKey.isBlank();

        return Map.of(
                "enabled", enabled,
                "available", configured,
                "provider", "Google Gemini",
                "model", model,
                "message", configured
                        ? "Gemini API key configured."
                        : "Gemini API key missing or AI disabled."
        );
    }

    public Optional<String> generate(String agent, String input) {

        if (!enabled || apiKey == null || apiKey.isBlank()) {
            System.err.println(
                    "Gemini skipped: AI disabled or API key not configured."
            );
            return Optional.empty();
        }

        try {

            String prompt = systemPrompt(agent)
                    + "\n\nUSER CONTEXT:\n" + input
                    + "\n\nReturn a useful structured response with headings "
                    + "and actionable steps. Be honest about evidence. "
                    + "Do not claim files were read, code changed, tests run, "
                    + "or repositories inspected unless evidence was supplied.";

            Map<String, Object> part = Map.of(
                    "text", prompt
            );

            Map<String, Object> content = Map.of(
                    "parts", List.of(part)
            );

            Map<String, Object> body = Map.of(
                    "contents", List.of(content),
                    "generationConfig", Map.of(
                            "temperature", 0.2,
                            "maxOutputTokens", 4096
                    )
            );

            Map<?, ?> response = client.post()
                    .uri(
                            "/v1beta/models/{model}:generateContent",
                            model
                    )
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                System.err.println(
                        "Gemini returned an empty response body."
                );
                return Optional.empty();
            }

            Object candidatesObj = response.get("candidates");

            if (!(candidatesObj instanceof List<?> candidates)
                    || candidates.isEmpty()) {

                System.err.println(
                        "Gemini response contains no candidates."
                );

                System.err.println(
                        "Response metadata: " + response.keySet()
                );

                return Optional.empty();
            }

            Object firstCandidate = candidates.get(0);

            if (!(firstCandidate instanceof Map<?, ?> candidate)) {
                return Optional.empty();
            }

            Object contentObj = candidate.get("content");

            if (!(contentObj instanceof Map<?, ?> responseContent)) {
                System.err.println(
                        "Gemini candidate has no content."
                );
                return Optional.empty();
            }

            Object partsObj = responseContent.get("parts");

            if (!(partsObj instanceof List<?> parts)) {
                System.err.println(
                        "Gemini content has no parts."
                );
                return Optional.empty();
            }

            StringBuilder result = new StringBuilder();

            for (Object item : parts) {

                if (item instanceof Map<?, ?> responsePart
                        && responsePart.get("text") != null) {

                    result.append(
                            responsePart.get("text")
                    );
                }
            }

            String text = result.toString().trim();

            if (text.isBlank()) {
                System.err.println(
                        "Gemini returned empty text."
                );
                return Optional.empty();
            }

            System.out.println(
                    "Gemini AI response successful for agent: " + agent
            );

            return Optional.of(text);

        } catch (RestClientResponseException e) {

            System.err.println(
                    "========== GEMINI API ERROR =========="
            );

            System.err.println(
                    "HTTP Status: " + e.getStatusCode()
            );

            System.err.println(
                    "Response Body: " + e.getResponseBodyAsString()
            );

            System.err.println(
                    "======================================"
            );

            return Optional.empty();

        } catch (Exception e) {

            System.err.println(
                    "========== GEMINI CONNECTION ERROR =========="
            );

            System.err.println(
                    "Error Type: " + e.getClass().getName()
            );

            System.err.println(
                    "Error Message: " + e.getMessage()
            );

            e.printStackTrace();

            System.err.println(
                    "==========================================="
            );

            return Optional.empty();
        }
    }

    private String systemPrompt(String agent) {

        return switch (agent) {

            case "codebase" ->
                    "You are DevMind Codebase Agent. Analyze only supplied "
                    + "repository context. Identify architecture, languages, "
                    + "key files, dependencies and missing context. Never "
                    + "pretend you cloned or scanned a repository.";

            case "planner" ->
                    "You are DevMind Planner Agent. Create an engineering "
                    + "plan, acceptance criteria, implementation steps, "
                    + "affected layers, risks and verification. "
                    + "Label assumptions clearly.";

            case "developer" ->
                    "You are DevMind Developer Agent. Produce an "
                    + "implementation brief, pseudocode or illustrative "
                    + "code, likely files, acceptance checklist and "
                    + "safety considerations. Do not claim files changed.";

            case "test" ->
                    "You are DevMind Test Agent. Design unit, integration "
                    + "and regression test cases. Give reproducible "
                    + "commands and expected outcomes. Distinguish "
                    + "proposed tests from tests actually run.";

            case "debugger" ->
                    "You are DevMind Debugger Agent. Analyze errors and "
                    + "logs, rank root causes by confidence, suggest "
                    + "diagnostic steps and fixes. Never claim a fix "
                    + "was applied or verified.";

            default ->
                    "You are DevMind Reviewer Agent. Review only supplied "
                    + "code, diff and context. Return findings by severity, "
                    + "evidence, impact, suggested fixes and checklist. "
                    + "If no diff is supplied, provide a review checklist.";
        };
    }
}