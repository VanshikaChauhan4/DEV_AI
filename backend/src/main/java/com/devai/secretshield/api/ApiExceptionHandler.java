package com.devai.secretshield.api;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestControllerAdvice(assignableTypes = SecretShieldController.class)
public class ApiExceptionHandler {
 @ExceptionHandler(IllegalArgumentException.class)
 public ResponseEntity<Map<String,String>> invalid(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class)
 public ResponseEntity<Map<String,String>> validation(MethodArgumentNotValidException e){return ResponseEntity.badRequest().body(Map.of("error","Input must not be blank."));}
 @ExceptionHandler(HttpMessageNotReadableException.class)
 public ResponseEntity<Map<String,String>> unreadable(HttpMessageNotReadableException e){return ResponseEntity.badRequest().body(Map.of("error","Request body must be valid JSON with an input field."));}
 @ExceptionHandler(Exception.class)
 public ResponseEntity<Map<String,String>> general(Exception e){return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Scan could not be completed. Input was not stored."));}
}
