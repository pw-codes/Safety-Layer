"""
routers/health.py
Simple health-check endpoint.
"""

from fastapi import APIRouter
from app.services.ollama_service import list_models

router = APIRouter()


@router.get("/health", summary="Service health check")
async def health():
    """Returns API status and available Ollama models."""
    try:
        models = await list_models()
        ollama_status = "ok"
    except Exception as exc:
        models = []
        ollama_status = f"unavailable: {exc}"

    return {
        "status":       "ok",
        "ollama":       ollama_status,
        "models":       models,
        "version":      "0.1.0",
    }
