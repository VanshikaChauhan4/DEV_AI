# DevMind AI — Updated Local AI Setup

## What changed
- Six individual agent workspaces now use role-specific instructions and example prompts.
- Backend attempts Ollama local generation first; if the local model is unavailable, it returns a clearly labeled deterministic fallback.
- Agent run records store `mode`: `LOCAL_AI` or `RULE_BASED_FALLBACK`.
- `GET /api/ai/status` reports whether the configured local model is available.
- No agent claims it cloned a repository, changed files, executed tests, or created a PR unless evidence is provided.
- Secret Shield and Change Impact Radar remain local Java heuristic tools.

## Free local AI (Ollama)
1. Install Ollama from https://ollama.com/download
2. Open a new terminal and run:
   `ollama pull qwen2.5:3b`
3. Start Ollama if it is not already running:
   `ollama serve`
   (Windows installer normally starts Ollama in the background; in that case do not start a duplicate server.)
4. Verify model list:
   `ollama list`
5. Backend defaults:
   - Ollama URL: `http://localhost:11434`
   - Model: `qwen2.5:3b`
6. Optional environment overrides:
   - `OLLAMA_BASE_URL=http://localhost:11434`
   - `OLLAMA_MODEL=qwen2.5:3b`
   - `DEVMIND_AI_ENABLED=true`

## Run
Terminal 1:
```powershell
cd backend
mvn spring-boot:run
```
Terminal 2:
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## Verify local AI
```powershell
Invoke-RestMethod "http://localhost:8080/api/ai/status"
```
Expected `available: true` when Ollama and the configured model are installed and running.

## Notes / limitations
- Ollama inference uses laptop resources; response latency depends on hardware and model.
- If Ollama is unavailable, agents still respond using explicitly labeled deterministic fallback behavior.
- Codebase Agent does not clone or crawl a repository. It analyses supplied context and tells you what to provide.
- Developer Agent produces suggestions and illustrative code; it does not write files.
- Test Agent creates test plans/commands but does not execute tests.
- Debugger Agent proposes diagnoses, but does not apply fixes.
- Reviewer Agent can only review code/diff/context that you paste.
- Secret Shield is regex/pattern screening and cannot guarantee all secrets are found.
- Change Impact Radar is a transparent keyword heuristic, not trained risk prediction.
- Never paste actual secrets into the web UI or prompts.
