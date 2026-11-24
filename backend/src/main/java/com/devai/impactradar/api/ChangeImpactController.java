package com.devai.impactradar.api;


import com.devai.impactradar.model.RiskRequest;
import com.devai.impactradar.model.RiskResult;
import com.devai.impactradar.service.ChangeImpactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/tools/risk")
public class ChangeImpactController {
    private final ChangeImpactService service;
    public ChangeImpactController(ChangeImpactService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<?> analyze(@Valid @RequestBody RiskRequest request) {
        try { return ResponseEntity.ok(service.analyze(request.input())); }
        catch (IllegalArgumentException ex) { return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage())); }
    }
}
