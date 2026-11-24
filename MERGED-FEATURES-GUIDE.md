# DevMind AI — merged features

This archive combines the project from `DEV_AI-main-fixed.zip` (chosen as the base because it contains the updated Secret Shield implementation) with the complete Change Impact Radar feature bundle.

## Included tools

- **Secret Shield** — existing `/tools/secrets` React screen and Spring Boot API; scanner and tests retained from the fixed project.
- **Change Impact Radar** — new React UI at `/tools/risk`, new Spring Boot API controller/service/models, and unit tests. The old heuristic endpoint method in `AgentController` was removed so there is only one `/api/tools/risk` mapping.
- **Six AI agents and existing workspace/routes** — kept from the fixed project; no agent behavior was intentionally changed.

## Run locally

Backend, from `backend`:
```powershell
mvn test
mvn spring-boot:run
```

Frontend, from `frontend`:
```powershell
npm ci
npm run dev
```

Then visit:
- `http://localhost:5173/tools/secrets`
- `http://localhost:5173/tools/risk`

Backend API endpoints:
- `POST http://localhost:8080/api/tools/secrets`
- `POST http://localhost:8080/api/tools/risk`

## Verification status

The merge was checked for duplicate `/api/tools/risk` mappings and route wiring. Maven tests and the frontend build were **not run** in this packaging environment (Maven is unavailable and frontend dependencies are not installed). Run the commands above on your machine before submitting.

Change Impact Radar uses transparent keyword heuristics. It does not inspect a repository, execute tests, or prove code safety. Secret Shield scans text supplied to it and may have false positives/negatives.
