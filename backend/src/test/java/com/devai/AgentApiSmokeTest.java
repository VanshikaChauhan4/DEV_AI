package com.devai;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "devmind.ai.enabled=false",
        "spring.datasource.url=jdbc:h2:mem:devmind-smoke;DB_CLOSE_DELAY=-1"
})
class AgentApiSmokeTest {
    @Autowired private MockMvc mvc;

    @Test
    void healthAndAiStatusAreReachable() throws Exception {
        mvc.perform(get("/api/health")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ok"));
        mvc.perform(get("/api/ai/status")).andExpect(status().isOk()).andExpect(jsonPath("$.enabled").value(false));
    }

    @Test
    void eachAgentCanExecuteAndPersistHistory() throws Exception {
        String[] agents = {"codebase", "planner", "developer", "test", "debugger", "reviewer"};
        for (String agent : agents) {
            mvc.perform(post("/api/agents/{agent}/execute", agent)
                    .contentType("application/json")
                    .content("{\"input\":\"Test task context\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.agent").value(agent))
                    .andExpect(jsonPath("$.mode").value("RULE_BASED_FALLBACK"))
                    .andExpect(jsonPath("$.output").isNotEmpty());
            mvc.perform(get("/api/agents/{agent}/history", agent))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].agent").value(agent));
        }
    }

    @Test
    void secretShieldRedactsQuotedCredentialValue() throws Exception {
        mvc.perform(post("/api/tools/secrets")
                .contentType("application/json")
                .content("{\"input\":\"password=\\\"dummy-secret123456\\\"\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalFindings").value(1))
                .andExpect(jsonPath("$.findings[0].type").value("HARDCODED_CREDENTIAL"))
                .andExpect(jsonPath("$.findings[0].maskedValue").value(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("dummy-secret123456"))));
    }

    @Test
    void secretShieldRejectsBlankInput() throws Exception {
        mvc.perform(post("/api/tools/secrets")
                .contentType("application/json")
                .content("{\"input\":\"   \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Input must not be blank."));
    }

    @Test
    void riskRadarReportsHighRiskSignals() throws Exception {
        mvc.perform(post("/api/tools/risk")
                .contentType("application/json")
                .content("{\"input\":\"Change login JWT, payment database schema. No tests added.\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.level").value("CRITICAL"))
                .andExpect(jsonPath("$.score").value(82));
    }
}

