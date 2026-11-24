package com.devai.secretshield.api;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
@Configuration
public class CorsConfig implements WebMvcConfigurer {
 @Override public void addCorsMappings(CorsRegistry registry){registry.addMapping("/api/tools/secrets").allowedOriginPatterns("http://localhost:*","http://127.0.0.1:*").allowedMethods("POST","OPTIONS").allowedHeaders("Content-Type");}
}
