# DevMind AI V2 — classroom demonstration

## Requirements
Java 17+, Maven 3.9+, Node.js 20+, npm. First install needs internet access for dependencies.

## Start (two separate terminals)
Terminal A: `cd DevAI/backend` then `mvn spring-boot:run`
Terminal B: `cd DevAI/frontend` then `npm install` then `npm run dev`
Open http://localhost:5173 . Backend health: http://localhost:8080/api/health .
Frontend build check: `npm run build`. Backend tests: `mvn test`.

## Individual pages
`/agents/codebase`, `/agents/planner`, `/agents/developer`, `/agents/test`, `/agents/debugger`, `/agents/reviewer` — enter input and execute each independently. Results are persisted in the local H2 backend database (`backend/data`).
`/tools/secrets` — paste **dummy** Java/configuration snippets to detect patterns resembling leaked credentials. Matches are redacted, inputs not persisted.
`/tools/risk` — paste a change description and inspect a transparent risk score and reasons.
`/dashboard` — import a public GitHub issue or submit a task; workflow summary is an illustrative DEMO, not real code generation or actual Maven/Docker/PR execution.

## Demo prompts
Secret Shield: `String api_key = "abcdefghijklmnopqrst123456";` (dummy example)
Change Impact Radar: `Change JWT authentication and payment database schema without tests.`
Planner: `Add JWT authentication to Spring Boot. Acceptance: login, invalid-token rejection, JUnit tests.`
Debugger: `java.lang.NullPointerException at UserService.java:42`

## What is and isn't implemented
Implemented: React UI, separate agent routes, rule-based stage outputs, saved history in H2, GitHub public issue import, secret pattern screening, transparent change-risk heuristic. Not implemented: LLM model calls, real repository clone/modification, sandboxed Docker tests, automatic GitHub pull requests. PostgreSQL dependency is present but local default is H2 to avoid database setup on demo day. Do not present demo stages as autonomous execution.

## Security
Never paste real secrets. Secret scanner is pattern-based and cannot prove code is safe. Do not execute untrusted repositories on the host. Backend has no authentication and is intended for local demo use only.
