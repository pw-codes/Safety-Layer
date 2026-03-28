"""
main.py
SafeLayer FastAPI application entry point.
Run with: uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, safety, analytics, waitlist
from app.models.database import init_db

app = FastAPI(
    title="SafeLayer API",
    description="Real-time AI output safety monitoring & filtering platform.",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    await init_db()

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router,    prefix="/api",           tags=["Health"])
app.include_router(safety.router,    prefix="/api/safety",    tags=["Safety"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(waitlist.router,  prefix="/api/waitlist",  tags=["Waitlist"])
