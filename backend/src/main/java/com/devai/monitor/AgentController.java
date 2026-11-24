package com.devai.monitor;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.util.*;
import java.util.regex.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AgentController {

    private final AgentExecutionRepository repo;
    private final AgentAiService aiService;

    private static final Set<String> AGENTS = Set.of(
            "codebase", "planner", "developer", "test", "debugger", "reviewer"
    );

    public AgentController(AgentExecutionRepository repo, AgentAiService aiService) {
        this.repo = repo;
        this.aiService = aiService;
    }

    @GetMapping("/ai/status")
    public Map<String, Object> aiStatus() { return aiService.status(); }

    // =========================
    // AGENT HISTORY
    // =========================

    @GetMapping("/agents/{agent}/history")
    public List<AgentExecution> history(@PathVariable("agent") String agent) {
        check(agent);
        return repo.findByAgentOrderByCreatedAtDesc(agent);
    }

    // =========================
    // AGENT EXECUTION
    // =========================

    @PostMapping("/agents/{agent}/execute")
    public ResponseEntity<?> execute(
            @PathVariable("agent") String agent,
            @RequestBody Map<String, String> body) {

        check(agent);

        String input = body.getOrDefault("input", "").trim();

        if (input.isEmpty() || input.length() > 30000) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Input must contain 1–30000 characters.")
            );
        }

        String out = switch (agent) {

            case "codebase" ->
                    "CODEBASE INVENTORY (based only on supplied text)\n"
                    + "Java references: " + count(input, "\\.java") + "\n"
                    + "Test references: " + count(input, "Test") + "\n"
                    + "Maven references: " + count(input, "pom.xml") + "\n"
                    + "Next: verify controllers, services, repositories, configurations and dependencies against actual files.";

            case "planner" ->
                    "IMPLEMENTATION CHECKLIST\n"
                    + "1. Confirm requirement and acceptance criteria.\n"
                    + "2. Identify affected Java classes and dependencies.\n"
                    + "3. Make smallest isolated change.\n"
                    + "4. Add positive, negative and regression JUnit tests.\n"
                    + "5. Run mvn test in a trusted project or isolated container.\n"
                    + "6. Review diff and request approval.\n"
                    + "Input: " + input.substring(0, Math.min(450, input.length()));

            case "developer" ->
                    "IMPLEMENTATION BRIEF (no code was modified)\n"
                    + "1. Create a feature branch.\n"
                    + "2. Locate relevant service/controller/config files.\n"
                    + "3. Implement acceptance criteria from the supplied task.\n"
                    + "4. Add focused JUnit tests.\n"
                    + "5. Check error handling and secrets.\n"
                    + "Task: " + input.substring(0, Math.min(450, input.length()));

            case "test" ->
                    "REPRODUCIBLE TEST COMMANDS (NOT EXECUTED)\n"
                    + "./mvnw test  (or mvn test)\n"
                    + "./mvnw verify\n"
                    + "Review target/surefire-reports and failed assertions.\n"
                    + "Add tests for success, invalid input, permission denied and regression.\n"
                    + "Evidence provided: " + input.substring(0, Math.min(450, input.length()));

            case "debugger" ->
                    "DEBUG TRIAGE (heuristic, no fix applied)\n"
                    + (input.toLowerCase().contains("nullpointer")
                    ? "Possible null dereference: inspect stack-trace file/line and validate input or initialization."
                    : input.toLowerCase().contains("compilation")
                    || input.contains("cannot find symbol")
                    ? "Possible compile failure: inspect imports, dependency versions and symbol spelling."
                    : "Locate first root-cause exception, reproduce with a minimal failing test and inspect recently changed lines.")
                    + "\nRetry limit recommendation: 2; run tests again after each human-approved fix.";

            default ->
                    "REVIEW CHECKLIST (not a verified code review)\n"
                    + "[ ] Requirement satisfied\n"
                    + "[ ] Authentication and authorization checked\n"
                    + "[ ] No hard-coded credentials\n"
                    + "[ ] Tests cover failure cases\n"
                    + "[ ] Diff has no unrelated changes\n"
                    + "[ ] Human approval before merge\n"
                    + "Submitted context: " + input.substring(0, Math.min(450, input.length()));
        };

        Optional<String> aiOutput = aiService.generate(agent, input);
        String mode = aiOutput.isPresent() ? "AI_GENERATED" : "RULE_BASED_FALLBACK";
        if (aiOutput.isPresent()) {
            out = aiOutput.get();
        } else {
            out += "\n\n[AI PROVIDER UNAVAILABLE] This response is a deterministic fallback. Configure GEMINI_API_KEY and verify network/provider access to enable AI generation.";
        }

        AgentExecution execution = new AgentExecution(agent, input, out);
        execution.mode = mode;
        return ResponseEntity.ok(repo.save(execution));
    }

    // =========================
    // AGENT VALIDATION
    // =========================

    private void check(String agent) {
        if (!AGENTS.contains(agent)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Unknown agent"
            );
        }
    }

    // =========================
    // TEXT COUNTER
    // =========================

    private int count(String text, String regex) {
        Matcher matcher = Pattern.compile(regex, Pattern.CASE_INSENSITIVE).matcher(text);
        int total = 0;

        while (matcher.find()) {
            total++;
        }

        return total;
    }

    // =========================

}
