"""
services/ollama_service.py
Wrapper around the local Ollama HTTP API.
Ollama must be running: `ollama serve`
Default model: mistral (change via OLLAMA_MODEL env var)
"""

from __future__ import annotations
import os
import httpx
from typing import AsyncGenerator

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "mistral")
REQUEST_TIMEOUT = float(os.getenv("OLLAMA_TIMEOUT", "60"))


async def generate(prompt: str, system: str | None = None) -> str:
    """
    Send a prompt to Ollama and return the full response string.
    Raises httpx.HTTPError on failure.
    """
    payload: dict = {
        "model":  OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }
    if system:
        payload["system"] = system

    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
        resp = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data.get("response", "")


async def generate_stream(prompt: str, system: str | None = None) -> AsyncGenerator[str, None]:
    """
    Stream tokens from Ollama as they arrive.
    Yields individual token strings.
    """
    payload: dict = {
        "model":  OLLAMA_MODEL,
        "prompt": prompt,
        "stream": True,
    }
    if system:
        payload["system"] = system

    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
        async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/generate", json=payload) as resp:
            resp.raise_for_status()
            import json
            async for line in resp.aiter_lines():
                if line:
                    chunk = json.loads(line)
                    if token := chunk.get("response"):
                        yield token
                    if chunk.get("done"):
                        break


async def list_models() -> list[str]:
    """Return names of locally available Ollama models."""
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
        resp.raise_for_status()
        return [m["name"] for m in resp.json().get("models", [])]
