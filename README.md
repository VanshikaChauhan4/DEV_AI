
# 🧠 DevMind AI

### A smarter way to approach software development.

DevMind AI is a developer-workflow platform that brings GitHub issues, risk analysis, security checks, workflow management, and execution tracking into one place.

The goal is simple: **help developers understand a problem before jumping into code.**

<p align="center">
  <a href="https://devai-tau.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Explore_DevMind_AI-7C3AED?style=for-the-badge" alt="Live Demo"/>
  </a>
  <a href="https://github.com/VanshikaChauhan4/DEV_AI">
    <img src="https://img.shields.io/badge/GitHub-Source_Code-24292F?style=for-the-badge&logo=github" alt="GitHub Repository"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-Frontend_Language-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Boot-Backend-6DB33F?style=flat-square&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-ML_Service-3776AB?style=flat-square&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite&logoColor=white"/>
</p>

---

## 💡 Why DevMind AI?

Software development involves more than writing code.

When a developer receives an issue, they need to understand the problem, identify possible risks, decide what needs to be done, and keep track of the work.

DevMind AI aims to organize these steps into a single workflow.

Instead of jumping between different tools, developers can use one platform to:

- Import a GitHub issue.
- Understand the task and its context.
- Review risk and security indicators.
- Follow an organized development workflow.
- Track workflow results and previous runs.

---

## 🔄 How DevMind AI Works

The platform follows a structured workflow:

```text
       ┌─────────────────────┐
       │   GitHub Issue      │
       │   Import a task     │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │   Issue Analysis    │
       │ Understand problem  │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │   Risk Analysis     │
       │ Identify concerns   │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │ Workflow Stages     │
       │ Organize the task   │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │ Execution Summary   │
       │ Review the outcome  │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │     Run History     │
       │ Track past runs     │
       └─────────────────────┘
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🐙 GitHub Issue Import

Import public GitHub issues and use them as the starting point for a workflow.

</td>
<td width="50%">

### 🧠 Workflow Orchestration

Organize development tasks into structured stages representing different engineering activities.

</td>
</tr>

<tr>
<td width="50%">

### 🛡️ Risk Analysis

Use rule-based analysis to identify potential risks associated with a workflow.

</td>
<td width="50%">

### 🔐 Security Checks

Detect potential secret-related concerns and display security indicators.

</td>
</tr>

<tr>
<td width="50%">

### 📊 Workflow Monitoring

View workflow stages, statuses, summaries, and execution information.

</td>
<td width="50%">

### 💾 Run History

Persist workflow runs and revisit previous records through the application.

</td>
</tr>
</table>

---

## 🏗️ System Architecture

DevMind AI is divided into separate components. Each component has a specific responsibility.

```text
                     ┌──────────────────────┐
                     │      DEVELOPER      │
                     └──────────┬───────────┘
                                │
                                ▼
                ┌────────────────────────────┐
                │         FRONTEND           │
                │                            │
                │   React + TypeScript +     │
                │           Vite             │
                │                            │
                │ Dashboard · Workflow · UI  │
                └──────────────┬─────────────┘
                               │ REST API
                               ▼
                ┌────────────────────────────┐
                │         BACKEND            │
                │                            │
                │       Spring Boot          │
                │                            │
                │ API · Workflow Management  │
                │ Risk · Security Logic     │
                └───────┬───────────┬────────┘
                        │           │
               ┌────────▼───┐  ┌────▼──────────┐
               │  H2 DB     │  │ Python       │
               │            │  │ ML Service   │
               │ Run Records│  │ Intelligence │
               └────────────┘  └──────────────┘
                        │
                        │
                  ┌─────▼──────┐
                  │ GitHub API │
                  └────────────┘
```

### Component responsibilities

| Component | Responsibility |
|---|---|
| Frontend | Provides the dashboard, issue input, workflow interface, and history views. |
| Backend | Handles API requests, workflow management, risk logic, and run records. |
| Python Service | Separate service for machine-learning-related functionality. |
| H2 Database | Stores workflow run information. |
| GitHub API | Provides access to public issue information. |

---

## ⚙️ Tech Stack

| Technology | Usage |
|---|---|
| React | Building the user interface |
| TypeScript | Type-safe frontend development |
| Vite | Frontend development and build tool |
| Java | Backend programming language |
| Spring Boot | Backend APIs and application logic |
| Python | ML service |
| H2 Database | Workflow data persistence |
| REST API | Communication between frontend and backend |
| Docker | Infrastructure and deployment-related configuration |

---

## 📌 Current Project Status

DevMind AI is currently in its prototype and development phase.

### Implemented in the current demo

- GitHub issue import
- Workflow run creation
- Structured workflow stages
- Rule-based risk scoring
- Secret-detection logic
- Workflow status and summaries
- Run history
- H2 persistence
- Backend health endpoint

### Not implemented yet

- Real LLM-powered agent execution
- Repository cloning and complete codebase analysis
- Autonomous code modifications
- Actual test execution
- Docker-based isolated code execution
- Automated code repair and retry
- Verified patch generation
- Automated GitHub pull requests

> The workflow stages currently represent a demo orchestration flow. The application does not yet autonomously edit repositories, run their tests, push code, or create pull requests.

---

## 🔭 Future Vision

The long-term goal is to evolve DevMind AI from a workflow dashboard into an intelligent development assistant.

```text
       ┌─────────────────────┐
       │   Understand Issue  │
       └──────────┬──────────┘
                  ▼
       ┌─────────────────────┐
       │ Investigate Codebase│
       └──────────┬──────────┘
                  ▼
       ┌─────────────────────┐
       │ Predict Potential   │
       │       Risks         │
       └──────────┬──────────┘
                  ▼
       ┌─────────────────────┐
       │ Propose / Apply Fix │
       └──────────┬──────────┘
                  ▼
       ┌─────────────────────┐
       │ Run & Verify Tests  │
       └──────────┬──────────┘
                  ▼
       ┌─────────────────────┐
       │ Human Code Review   │
       └──────────┬──────────┘
                  ▼
       ┌─────────────────────┐
       │ Create Pull Request │
       └─────────────────────┘
```

### Planned improvements

- **RootCause Memory:** Remember previous failures and useful debugging information.
- **RepoTwin:** Understand repository structure and dependencies.
- **Predictive Risk:** Identify potentially risky changes before implementation.
- **AI Repair:** Suggest or implement fixes with developer approval.
- **TestTruth:** Verify changes using real test execution.
- **SafePatch:** Review generated modifications before accepting them.
- **Human Approval:** Keep developers in control of important actions.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/VanshikaChauhan4/DEV_AI.git
cd DEV_AI
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Start the backend

Navigate to the `backend` directory and run the Spring Boot application using the project's Maven configuration.

### 4. Start the Python service

Navigate to `ml-service` and follow the service-specific dependency and startup instructions.

### 5. Open the application

Open the local URL provided by Vite and ensure the backend services are running.

For detailed installation and configuration instructions, see the [Setup Guide](docs/setup-guide.md).

---

## 📁 Project Structure

```text
DEV_AI/
│
├── frontend/          # React + TypeScript application
│
├── backend/           # Spring Boot backend
│
├── ml-service/        # Python ML service
│
├── infrastructure/    # Infrastructure configuration
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   └── setup-guide.md
│
├── README-DEMO.md
├── README-V2.md
└── README.md
```

---

## 📖 Documentation

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | Application architecture and components |
| [API Reference](docs/api-reference.md) | API endpoints and usage |
| [Setup Guide](docs/setup-guide.md) | Installation and configuration |
| [Demo Notes](README-DEMO.md) | Information about the current demo |

---

## 🤝 Contributing

Contributions, ideas, bug reports, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe your changes"
git push origin feature/your-feature
```

---

<div align="center">

### Built with curiosity. Designed for better engineering.

**DevMind AI**

Understand · Analyze · Orchestrate · Verify

Created by [Vanshika Chauhan](https://github.com/VanshikaChauhan4)

⭐ If you find the project interesting, consider starring the repository.

</div>
