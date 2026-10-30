# DevMind AI – connected classroom demo

## Requirements
Java 17+, Maven 3.9+, Node 20+. No PostgreSQL, Docker, GitHub token or LLM key is required for demo mode.

## Run
Terminal 1: `cd backend && mvn spring-boot:run`
Terminal 2: `cd frontend && npm install && npm run dev`
Open http://localhost:5173/dashboard . The landing page is preserved at `/`.

## Features actually implemented
Spring Boot REST endpoints, public GitHub issue import, role-based illustrative six-agent workflow, H2 persistent run history (`backend/data`), React API integration, loading/error handling and history detail.

## Important distinction
This is a connected **DEMO**, not a working autonomous coding agent. It does NOT clone or modify repositories, invoke an LLM, execute Maven/Docker on target repositories, debug real failures, commit, push or create GitHub PRs. All workflow stages and test/PR statuses explicitly disclose this. Live GitHub issue import needs internet and is subject to public API rate limits. Never describe demo stages as actual tests or code changes.

## API
`GET /api/health`; `GET /api/runs`; `GET /api/runs/{id}`; `POST /api/runs` JSON `{ "description":"Add JWT authentication", "repositoryUrl":"" }`; `GET /api/github/issue?url=https://github.com/owner/repo/issues/1`.

## Production roadmap
Add authenticated GitHub integration, JGit clone/branch/commit, LLM-backed role prompts with schema validation, sandboxed Docker test runner with network/resource restrictions, approval gate and real PR creation. PostgreSQL dependency is retained; configure DATABASE_URL/USER/PASSWORD to switch from default local H2.
