from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="DevAI Risk Service", version="0.1.0")

class RiskInput(BaseModel):
    dependency_count: int = Field(ge=0, le=100000)
    recent_changes: int = Field(ge=0, le=100000)
    historical_defects: int = Field(ge=0, le=100000)
    test_coverage: float = Field(ge=0, le=100)

@app.get("/health")
def health():
    return {"service": "devai-ml-service", "status": "ok"}

@app.post("/risk/estimate")
def estimate_risk(data: RiskInput):
    # Transparent placeholder baseline, not a trained or calibrated ML model.
    score = min(100, max(0,
        data.dependency_count * 2
        + data.recent_changes * 1.5
        + data.historical_defects * 4
        + (100 - data.test_coverage) * 0.35
    ))
    return {
        "risk_score": round(score, 1),
        "label": "high" if score >= 65 else "medium" if score >= 30 else "low",
        "note": "Illustrative baseline only; train and validate a model before treating this as a probability."
    }
