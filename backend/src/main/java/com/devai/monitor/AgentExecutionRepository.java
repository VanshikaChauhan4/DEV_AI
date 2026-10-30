package com.devai.monitor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AgentExecutionRepository extends JpaRepository<AgentExecution,Long>{List<AgentExecution> findByAgentOrderByCreatedAtDesc(String agent);}
