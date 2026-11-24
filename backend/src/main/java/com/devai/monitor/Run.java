package com.devai.monitor;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="workflow_runs") public class Run {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public String title; public String repositoryUrl; public String status; public String mode; public Instant createdAt=Instant.now();
 @Lob @Column(columnDefinition="CLOB") public String description;
 @Lob @Column(columnDefinition="CLOB") public String resultJson;
 public Run() {}
}
