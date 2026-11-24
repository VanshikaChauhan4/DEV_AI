# Gemini API Setup (Windows PowerShell)

1. Open PowerShell in the backend directory.
2. Set your key for this terminal session (replace the placeholder locally):
   `$env:GEMINI_API_KEY="YOUR_KEY_HERE"`
3. Start backend: `mvn spring-boot:run`
4. Keep this terminal open. Never commit your key or put it in frontend files.
5. AI status: `http://localhost:8080/api/agents/ai/status` (if your frontend/controller exposes this route; otherwise use the existing AI status route).

Provider defaults to Gemini (`gemini-2.5-flash`). Missing/failed AI calls use the app's rule-based fallback.
