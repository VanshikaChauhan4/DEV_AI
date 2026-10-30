package com.devai.monitor;
import jakarta.persistence.*;
import java.time.Instant;
@Entity public class AgentExecution {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 public String agent; public Instant createdAt=Instant.now();
 @Lob @Column(columnDefinition="CLOB") public String input;
 @Lob @Column(columnDefinition="CLOB") public String output;
 public AgentExecution(){} public AgentExecution(String a,String i,String o){agent=a;input=i;output=o;}
}
