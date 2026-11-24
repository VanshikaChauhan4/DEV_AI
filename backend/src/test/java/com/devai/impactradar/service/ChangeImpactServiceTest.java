package com.devai.impactradar.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ChangeImpactServiceTest {
    private final ChangeImpactService service = new ChangeImpactService();
    @Test void authDatabasePaymentsAndMissingTestsScoreExplainably() {
        var result = service.analyze("Change JWT authorization, database migration, payment checkout; no tests added.");
        assertEquals(82, result.score());
        assertEquals("CRITICAL", result.level());
        assertTrue(result.signals().stream().anyMatch(s -> s.id().equals("AUTH")));
        assertTrue(result.signals().stream().anyMatch(s -> s.id().equals("DATABASE")));
        assertTrue(result.signals().stream().anyMatch(s -> s.id().equals("PAYMENTS")));
        assertTrue(result.signals().stream().anyMatch(s -> s.id().equals("TESTS_MISSING")));
    }
    @Test void testMentionReducesScoreButDoesNotClaimVerified() {
        var result = service.analyze("Update UI component and add unit tests.");
        assertEquals(0, result.score());
        assertTrue(result.testEvidence().contains("not verified"));
    }
    @Test void rejectsEmptyAndOversizedInput() {
        assertThrows(IllegalArgumentException.class, () -> service.analyze("  "));
        assertThrows(IllegalArgumentException.class, () -> service.analyze("x".repeat(30001)));
    }
}
