# Initial API surface

- `GET /api/health` — Spring Boot health check
- `GET /health` — Python risk service health check
- `POST /risk/estimate` — illustrative baseline risk estimate

Planned feature APIs should be implemented with validation, authorization, audit logs, bounded execution, and typed response schemas before frontend integration.


## Local AI + repository context endpoints (added)
- `GET /api/ai/status` — configured Ollama model availability
- `GET /api/github/repository?url=https://github.com/owner/repo` — public repo metadata, file tree (capped), languages, and README excerpt for Codebase Agent
- Individual agent execute responses include `mode`: `LOCAL_AI` or `RULE_BASED_FALLBACK
`

Local model configuration: `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `DEVMIND_AI_ENABLED`. See `README-LOCAL-AI.md`.
