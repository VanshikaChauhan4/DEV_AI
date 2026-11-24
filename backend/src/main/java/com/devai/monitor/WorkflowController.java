package com.devai.monitor;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestClient;
import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins={"http://localhost:5173","http://127.0.0.1:5173"})
public class WorkflowController {

    private final RunRepository repo;
    private final ObjectMapper mapper;

    public WorkflowController(RunRepository repo, ObjectMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }


    @GetMapping("/workflow/health")
    public Map<String,Object> workflowHealth() {
        return Map.of("status","UP","mode","DEMO","storage","H2 persistent local database");
    }

    @GetMapping("/runs")
    public List<Run> runs() {
        return repo.findAll().stream()
                .sorted(Comparator.comparing((Run r)->r.id).reversed())
                .toList();
    }

    @GetMapping("/runs/{id}")
    public ResponseEntity<Run> one(@PathVariable("id") Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.notFound().build());
    }

    @PostMapping("/runs")
    public ResponseEntity<?> create(@RequestBody Map<String,String> input) {
        String title=input.getOrDefault("title","").trim();
        String description=input.getOrDefault("description","").trim();

        if(title.isBlank() && description.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error","Enter an issue or task description."));

        Run r=new Run();
        r.title=title.isBlank()?description.substring(0,Math.min(90,description.length())):title;
        r.description=description.isBlank()?r.title:description;
        r.repositoryUrl=input.getOrDefault("repositoryUrl","").trim();
        r.status="COMPLETED";
        r.mode="DEMO";

        String[] names={"Codebase Agent","Planner Agent","Developer Agent","Test Agent","Debugger Agent","Reviewer Agent"};
        String[] details={
            "Inspected supplied requirement (repository clone requires live integration)",
            "Prepared an illustrative implementation checklist",
            "Generated a proposed implementation outline; no repository files were modified",
            "Illustrative test checklist only; no Maven tests were executed",
            "No actual test failures were available for debugging",
            "Reviewed the proposed steps; human approval required"
        };

        List<Map<String,String>> stages=new ArrayList<>();
        for(int i=0;i<names.length;i++)
            stages.add(Map.of("name",names[i],"status",i==4?"NOT_REQUIRED":"DEMO_COMPLETE","detail",details[i]));

        List<String> plan=List.of(
            "Understand issue and inspect project structure",
            "Identify affected Java classes and Maven dependencies",
            "Implement feature in a separate branch",
            "Add JUnit tests and run Maven in isolated Docker",
            "Investigate failures and retry with a bounded limit",
            "Review diff and request approval before opening PR"
        );

        try {
            r.resultJson=mapper.writeValueAsString(Map.of(
                "stages",stages,
                "plan",plan,
                "summary","Demonstration workflow generated for: "+r.title,
                "tests","NOT_RUN",
                "pullRequest","NOT_CREATED",
                "note","Demo output only. No AI code changes, GitHub pushes, Docker execution or PR creation occurred."
            ));
        } catch(Exception e) {
            throw new IllegalStateException(e);
        }

        return ResponseEntity.status(201).body(repo.save(r));
    }

    @GetMapping("/github/repository")
    public ResponseEntity<?> repository(@RequestParam("url") String url) {
        try {
            URI input = URI.create(url.trim());
            if (!"https".equalsIgnoreCase(input.getScheme()) || !"github.com".equalsIgnoreCase(input.getHost())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Use a public https://github.com/owner/repo URL."));
            }
            String[] parts = input.getPath().replaceAll("/+$", "").split("/");
            if (parts.length != 3 || parts[1].isBlank() || parts[2].isBlank()
                    || !parts[1].matches("[A-Za-z0-9_.-]+") || !parts[2].matches("[A-Za-z0-9_.-]+")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Enter a repository URL in https://github.com/owner/repo format."));
            }
            String owner = parts[1];
            String repoName = parts[2];
            String apiBase = "https://api.github.com/repos/" + owner + "/" + repoName;
            RestClient github = RestClient.builder().defaultHeader("Accept", "application/vnd.github+json")
                    .defaultHeader("User-Agent", "DevMind-AI-Local-Prototype").build();
            Map repo = github.get().uri(apiBase).retrieve().body(Map.class);
            if (repo == null) return ResponseEntity.status(502).body(Map.of("error", "GitHub returned no repository metadata."));
            String branch = String.valueOf(repo.getOrDefault("default_branch", "main"));
            String treeUrl = apiBase + "/git/trees/" + java.net.URLEncoder.encode(branch, java.nio.charset.StandardCharsets.UTF_8) + "?recursive=1";
            Map treeResponse = github.get().uri(treeUrl).retrieve().body(Map.class);
            List<Map<String, Object>> files = new ArrayList<>();
            if (treeResponse != null && treeResponse.get("tree") instanceof List<?> tree) {
                for (Object item : tree) {
                    if (item instanceof Map<?, ?> node && "blob".equals(String.valueOf(node.get("type")))) {
                        Map<String, Object> file = new LinkedHashMap<>();
                        file.put("path", String.valueOf(node.get("path")));
                        file.put("size", node.get("size"));
                        files.add(file);
                        if (files.size() >= 250) break;
                    }
                }
            }
            Object languages = null;
            try { languages = github.get().uri(apiBase + "/languages").retrieve().body(Map.class); } catch (Exception ignored) {}
            String readmeText = "";
            try {
                Map readme = github.get().uri(apiBase + "/readme").retrieve().body(Map.class);
                Object encoded = readme == null ? null : readme.get("content");
                if (encoded != null) {
                    String raw = String.valueOf(encoded).replaceAll("\\s", "");
                    readmeText = new String(java.util.Base64.getDecoder().decode(raw), java.nio.charset.StandardCharsets.UTF_8);
                    if (readmeText.length() > 8000) readmeText = readmeText.substring(0, 8000) + "\n[README truncated]";
                }
            } catch (Exception ignored) {}
            Map<String, Object> context = new LinkedHashMap<>();
            context.put("repository", repo.getOrDefault("full_name", owner + "/" + repoName));
            context.put("url", repo.getOrDefault("html_url", url));
            context.put("description", repo.getOrDefault("description", ""));
            context.put("defaultBranch", branch);
            context.put("primaryLanguage", repo.getOrDefault("language", "unknown"));
            context.put("languages", languages == null ? Map.of() : languages);
            context.put("stars", repo.getOrDefault("stargazers_count", 0));
            context.put("fileTree", files);
            context.put("readmeContext", readmeText);
            context.put("note", "Public GitHub metadata/tree/README only. No repository clone, source-file crawling or local modification was performed.");
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", "Could not read public repository metadata. Check the URL, network or GitHub rate limit."));
        }
    }

    @GetMapping("/github/issue")
    public ResponseEntity<?> issue(@RequestParam("url") String url) {
        try {
            URI u=URI.create(url);

            if(!"https".equalsIgnoreCase(u.getScheme()) || !"github.com".equalsIgnoreCase(u.getHost()))
                return ResponseEntity.badRequest().body(Map.of("error","Use an https://github.com/owner/repo/issues/number URL."));

            String[] a=u.getPath().split("/");
            if(a.length!=5 || !"issues".equals(a[3]) || !a[4].matches("[0-9]+"))
                return ResponseEntity.badRequest().body(Map.of("error","Invalid GitHub issue URL."));

            String api="https://api.github.com/repos/"+a[1]+"/"+a[2]+"/issues/"+a[4];

            Map result=RestClient.create().get()
                .uri(api)
                .header("Accept","application/vnd.github+json")
                .retrieve()
                .body(Map.class);

            return ResponseEntity.ok(Map.of(
                "title",String.valueOf(result.getOrDefault("title","")),
                "description",String.valueOf(result.getOrDefault("body","")),
                "repositoryUrl","https://github.com/"+a[1]+"/"+a[2]
            ));

        } catch(Exception e) {
            return ResponseEntity.status(502).body(Map.of("error","Could not retrieve this public GitHub issue. Check URL, network or API rate limit."));
        }
    }
}
