# DevAI architecture

React UI -> Spring Boot API -> PostgreSQL
                         -> AI provider (server-side)
                         -> isolated execution workers
                         -> Python risk service

Primary workflow:
GitHub issue / bug report -> RootCause Memory -> RepoTwin impact analysis -> risk estimate -> repair proposal -> SafePatch + TestTruth -> evidence report -> human approval.

Treat model output as a hypothesis until validated by repository evidence and actual tests.
