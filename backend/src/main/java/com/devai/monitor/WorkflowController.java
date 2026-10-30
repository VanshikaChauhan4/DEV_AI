package com.devai.monitor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestClient;
import java.net.URI;
import java.util.*;
@RestController @RequestMapping("/api") @CrossOrigin(origins={"http://localhost:5173","http://127.0.0.1:5173"})
public class WorkflowController {
 private final RunRepository repo; private final ObjectMapper mapper;
 public WorkflowController(RunRepository repo,ObjectMapper mapper){this.repo=repo;this.mapper=mapper;}
 @GetMapping("/health") public Map<String,Object> health(){return Map.of("status","UP","mode","DEMO","storage","H2 persistent local database");}
 @GetMapping("/runs") public List<Run> runs(){return repo.findAll().stream().sorted(Comparator.comparing((Run r)->r.id).reversed()).toList();}
 @GetMapping("/runs/{id}") public ResponseEntity<Run> one(@PathVariable Long id){return repo.findById(id).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());}
 @PostMapping("/runs") public ResponseEntity<?> create(@RequestBody Map<String,String> input){
 String title=input.getOrDefault("title","").trim(), description=input.getOrDefault("description","").trim();
 if(title.isBlank() && description.isBlank()) return ResponseEntity.badRequest().body(Map.of("error","Enter an issue or task description."));
 Run r=new Run(); r.title=title.isBlank()?description.substring(0,Math.min(90,description.length())):title; r.description=description.isBlank()?r.title:description; r.repositoryUrl=input.getOrDefault("repositoryUrl","").trim(); r.status="COMPLETED"; r.mode="DEMO";
 String[] names={"Codebase Agent","Planner Agent","Developer Agent","Test Agent","Debugger Agent","Reviewer Agent"};
 String[] details={"Inspected supplied requirement (repository clone requires live integration)","Prepared an illustrative implementation checklist","Generated a proposed implementation outline; no repository files were modified","Illustrative test checklist only; no Maven tests were executed","No actual test failures were available for debugging","Reviewed the proposed steps; human approval required"};
 List<Map<String,String>> stages=new ArrayList<>(); for(int i=0;i<names.length;i++)stages.add(Map.of("name",names[i],"status",i==4?"NOT_REQUIRED":"DEMO_COMPLETE","detail",details[i]));
 List<String> plan=List.of("Understand issue and inspect project structure","Identify affected Java classes and Maven dependencies","Implement feature in a separate branch","Add JUnit tests and run Maven in isolated Docker","Investigate failures and retry with a bounded limit","Review diff and request approval before opening PR");
 try {r.resultJson=mapper.writeValueAsString(Map.of("stages",stages,"plan",plan,"summary","Demonstration workflow generated for: "+r.title,"tests","NOT_RUN","pullRequest","NOT_CREATED","note","Demo output only. No AI code changes, GitHub pushes, Docker execution or PR creation occurred."));}catch(Exception e){throw new IllegalStateException(e);}
 return ResponseEntity.status(201).body(repo.save(r));
 }
 @GetMapping("/github/issue") public ResponseEntity<?> issue(@RequestParam String url){
 try {URI u=URI.create(url); if(!"https".equalsIgnoreCase(u.getScheme()) || !"github.com".equalsIgnoreCase(u.getHost())) return ResponseEntity.badRequest().body(Map.of("error","Use an https://github.com/owner/repo/issues/number URL."));
 String[] a=u.getPath().split("/"); if(a.length!=5 || !"issues".equals(a[3]) || !a[4].matches("[0-9]+")) return ResponseEntity.badRequest().body(Map.of("error","Invalid GitHub issue URL."));
 String api="https://api.github.com/repos/"+a[1]+"/"+a[2]+"/issues/"+a[4];
 Map result=RestClient.create().get().uri(api).header("Accept","application/vnd.github+json").retrieve().body(Map.class);
 return ResponseEntity.ok(Map.of("title",String.valueOf(result.getOrDefault("title","")),"description",String.valueOf(result.getOrDefault("body","")),"repositoryUrl","https://github.com/"+a[1]+"/"+a[2]));
 }catch(Exception e){return ResponseEntity.status(502).body(Map.of("error","Could not retrieve this public GitHub issue. Check URL, network or API rate limit."));}
 }
}
