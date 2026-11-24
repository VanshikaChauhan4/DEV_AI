package com.devai.secretshield.api;
import com.devai.secretshield.engine.SecretScanner;
import com.devai.secretshield.model.ScanRequest;
import com.devai.secretshield.model.ScanResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/tools/secrets")
public class SecretShieldController {
  private final SecretScanner scanner;
  public SecretShieldController(SecretScanner scanner){this.scanner=scanner;}
  @PostMapping public ScanResult scan(@Valid @RequestBody ScanRequest request){return scanner.scan(request.input());}
}
