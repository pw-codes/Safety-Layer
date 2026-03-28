"""
routers/safety.py
POST /api/safety/check  — run a prompt through the AI + safety engine
GET  /api/safety/logs   — paginated output log history
"""

from __future__ import annotations
import uuid
import time

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.models.database import get_db
from app.models.output_log import OutputLog, RiskLevel
from app.services import evaluate, generate

router = APIRouter()


# ── Request / Response schemas ─────────────────────────────────────────────────

class CheckRequest(BaseModel):
    prompt:     str = Field(..., min_length=1, max_length=4096, description="User prompt to send to the AI model")
    model_name: str = Field("mistral", description="Ollama model to use")
    system:     str | None = Field(None, description="Optional system prompt")


class CheckResponse(BaseModel):
    request_id:      str
    raw_output:      str
    safe_output:     str
    risk_level:      str
    risk_score:      float
    was_filtered:    bool
    filter_reason:   str | None
    latency_ms:      float


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/check", response_model=CheckResponse, summary="Check AI output safety")
async def check_safety(
    body: CheckRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    1. Send the prompt to Ollama.
    2. Run the response through the safety engine.
    3. Persist the log to PostgreSQL.
    4. Return safe output to the caller.
    """
    request_id = str(uuid.uuid4())
    t0 = time.perf_counter()

    # Step 1 — generate
    try:
        raw_output = await generate(body.prompt, system=body.system)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Ollama error: {exc}")

    # Step 2 — evaluate
    result = evaluate(raw_output)

    total_ms = round((time.perf_counter() - t0) * 1000, 2)
    safe_output = result.filtered_output if result.was_filtered else raw_output

    # Step 3 — persist
    log = OutputLog(
        request_id=request_id,
        user_prompt=body.prompt,
        raw_output=raw_output,
        filtered_output=result.filtered_output,
        risk_level=RiskLevel(result.risk_level),
        risk_score=result.risk_score,
        was_filtered=int(result.was_filtered),
        filter_reason=result.filter_reason,
        model_name=body.model_name,
        latency_ms=total_ms,
    )
    db.add(log)
    await db.commit()

    return CheckResponse(
        request_id=request_id,
        raw_output=raw_output,
        safe_output=safe_output,
        risk_level=result.risk_level,
        risk_score=result.risk_score,
        was_filtered=result.was_filtered,
        filter_reason=result.filter_reason,
        latency_ms=total_ms,
    )


@router.get("/logs", summary="Paginated output log history")
async def get_logs(
    page:      int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    risk:      str | None = Query(None, description="Filter by risk level: safe | risky | dangerous"),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(OutputLog).order_by(desc(OutputLog.created_at))

    if risk:
        try:
            stmt = stmt.where(OutputLog.risk_level == RiskLevel(risk))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid risk level: {risk}")

    offset = (page - 1) * page_size
    stmt = stmt.offset(offset).limit(page_size)

    rows = (await db.execute(stmt)).scalars().all()
    return {"page": page, "page_size": page_size, "logs": [r.to_dict() for r in rows]}
