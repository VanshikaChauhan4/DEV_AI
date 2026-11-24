# Local setup

## Requirements
- Node.js LTS and npm
- Java 21 and Maven
- Python 3.11+
- Docker Desktop

## Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

## Database
From the repository root:
```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

## Spring Boot backend
```bash
cd backend
mvn spring-boot:run
```
Health endpoint: http://localhost:8080/api/health

## Python ML service
```bash
cd ml-service
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Health endpoint: http://localhost:8000/health

## Important
This is a starter scaffold. The feature pages currently use placeholder UI; RootCause retrieval, repository parsing, AI repair, safe sandbox execution, real test runs, GitHub OAuth and persistent reports still need implementation. Never expose API keys in frontend environment variables.
