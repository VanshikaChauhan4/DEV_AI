package com.devai.impactradar.service;

import com.devai.impactradar.model.RiskResult;
import com.devai.impactradar.model.RiskSignal;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class ChangeImpactService {
    private record Rule(String id, String label, int points, String explanation, Pattern pattern) {}

    private static final List<Rule> RULES = List.of(
        new Rule("AUTH", "Authentication / authorization", 22, "Touches identity, permissions, sessions or access control.", Pattern.compile("\\b(auth|authentication|authorization|authorize|permission|role|jwt|oauth|login|logout|session|password|credential|security)\\b", Pattern.CASE_INSENSITIVE)),
        new Rule("DATABASE", "Database / schema", 20, "Touches database structure, migrations, queries or data integrity.", Pattern.compile("\\b(database|db|sql|schema|migration|migrate|alter table|drop table|index|repository|transaction|postgres|mysql|mongodb)\\b", Pattern.CASE_INSENSITIVE)),
        new Rule("PAYMENTS", "Payments / financial flow", 25, "Touches money movement, billing or financial transactions.", Pattern.compile("\\b(payment|payments|billing|invoice|refund|transaction|wallet|checkout|price|money|ledger)\\b", Pattern.CASE_INSENSITIVE)),
        new Rule("INFRA", "Infrastructure / deployment", 15, "Touches deployment, runtime, networking or infrastructure configuration.", Pattern.compile("\\b(deploy|deployment|production|docker|compose|kubernetes|infra|infrastructure|ci\\/cd|pipeline|cloud|server|network|config)\\b", Pattern.CASE_INSENSITIVE)),
        new Rule("BREAKING", "Breaking / destructive operation", 18, "Mentions removals, incompatible changes or destructive operations.", Pattern.compile("\\b(delete|deletions|remove|removal|drop|breaking|deprecated|rename|backward incompatible|truncate|reset)\\b", Pattern.CASE_INSENSITIVE)),
        new Rule("SENSITIVE_FILE", "Sensitive path / configuration", 15, "Names sensitive files or paths such as auth, secrets or production configuration.", Pattern.compile("(?:^|[\\s`'\"])(?:[^\\s`'\"]*/)?(?:auth|security|secret|credential|application\\.(?:yml|yaml|properties)|docker-compose|compose)\\b", Pattern.CASE_INSENSITIVE))
    );
    private static final Pattern TESTS = Pattern.compile("\\b(test|tests|testing|junit|jest|vitest|pytest|coverage|unit test|integration test|e2e)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern MISSING_TESTS = Pattern.compile("\\b(no tests?|tests? (?:not added|missing|not run|failed|skipped)|without tests|not tested|tests? not executed)\\b", Pattern.CASE_INSENSITIVE);

    public RiskResult analyze(String input) {
        if (input == null || input.isBlank()) throw new IllegalArgumentException("Change description is required.");
        if (input.length() > 30000) throw new IllegalArgumentException("Input must be 1–30000 characters.");
        List<RiskSignal> signals = new ArrayList<>();
        int score = 0;
        for (Rule rule : RULES) {
            var matcher = rule.pattern().matcher(input);
            LinkedHashSet<String> terms = new LinkedHashSet<>();
            while (matcher.find()) terms.add(matcher.group().toLowerCase(Locale.ROOT));
            if (!terms.isEmpty()) {
                score += rule.points();
                signals.add(new RiskSignal(rule.id(), rule.label(), rule.points(), rule.explanation(), List.copyOf(terms)));
            }
        }

        boolean mentionsTests = TESTS.matcher(input).find();
        boolean explicitlyMissing = MISSING_TESTS.matcher(input).find();
        String testEvidence;
        if (explicitlyMissing || !mentionsTests) {
            score += 15;
            testEvidence = "MISSING_OR_UNCONFIRMED (+15): no test evidence is described. This is not proof tests do not exist.";
            signals.add(new RiskSignal("TESTS_MISSING", "Test evidence not supplied", 15,
                "No clear test evidence was included in the change description; risk is increased pending verification.", List.of()));
        } else {
            score -= 10;
            testEvidence = "MENTIONED (-10): tests are mentioned, but their passing status is not verified.";
            signals.add(new RiskSignal("TESTS_MENTIONED", "Test evidence mentioned", -10,
                "Mentioning tests slightly reduces the heuristic score; this tool does not run or verify tests.", List.of()));
        }

        score = Math.max(0, Math.min(100, score));
        String level = score >= 80 ? "CRITICAL" : score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW";
        String label = switch (level) { case "CRITICAL" -> "Critical review required"; case "HIGH" -> "High risk"; case "MEDIUM" -> "Moderate risk"; default -> "Low risk"; };
        List<String> recommendations = new ArrayList<>();
        if (signals.stream().anyMatch(s -> s.id().equals("AUTH"))) recommendations.add("Review access-control boundaries, authorization checks and negative tests.");
        if (signals.stream().anyMatch(s -> s.id().equals("DATABASE"))) recommendations.add("Review migration safety, data integrity, rollback strategy and query compatibility.");
        if (signals.stream().anyMatch(s -> s.id().equals("PAYMENTS"))) recommendations.add("Use financial-flow review, idempotency checks and reconciliation-focused tests.");
        if (signals.stream().anyMatch(s -> s.id().equals("INFRA"))) recommendations.add("Review environment differences, secrets handling, deployment rollback and monitoring.");
        if (signals.stream().anyMatch(s -> s.id().equals("BREAKING"))) recommendations.add("Check backward compatibility, callers, release notes and recovery options.");
        if (explicitlyMissing || !mentionsTests) recommendations.add("Add and run targeted unit/integration tests; record the actual result before merge.");
        else recommendations.add("Attach test output and verify that the described tests pass in CI.");
        if (score >= 60) recommendations.add("Request an additional reviewer before merging; this score is a triage aid, not an approval gate.");
        if (recommendations.isEmpty()) recommendations.add("Review the diff, run focused tests and confirm the change scope before merging.");
        return new RiskResult(score, level, label, List.copyOf(signals), testEvidence, List.copyOf(recommendations),
            "Score = sum of matched signal weights, plus 15 when test evidence is missing/unconfirmed, minus 10 when tests are mentioned; capped to 0–100. Each rule contributes at most once. Matched terms are shown for explainability.",
            "Transparent keyword heuristic only. It does not inspect repository history, calculate dependency graphs, run tests, or guarantee correctness. Review the diff and use human judgement.");
    }
}
