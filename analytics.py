"""
routers/analytics.py
GET /api/analytics/summary  — risk distribution + totals
GET /api/analytics/trend    — daily counts for the last N days
"""

from __future__ import annotations
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.database import get_db
from app.models.output_log import OutputLog, RiskLevel

router = APIRouter()


@router.get("/summary", summary="Risk distribution summary")
async def summary(db: AsyncSession = Depends(get_db)):
    """Returns total counts broken down by risk level and filter rate."""
    rows = (
        await db.execute(
            select(OutputLog.risk_level, func.count().label("count"))
            .group_by(OutputLog.risk_level)
        )
    ).all()

    counts = {r.risk_level: r.count for r in rows}
    total  = sum(counts.values())

    filtered_count = (
        await db.execute(
            select(func.count()).where(OutputLog.was_filtered == 1)
        )
    ).scalar() or 0

    avg_latency = (
        await db.execute(select(func.avg(OutputLog.latency_ms)))
    ).scalar()

    return {
        "total_requests":  total,
        "safe_count":      counts.get(RiskLevel.SAFE,      0),
        "risky_count":     counts.get(RiskLevel.RISKY,     0),
        "dangerous_count": counts.get(RiskLevel.DANGEROUS, 0),
        "filtered_count":  filtered_count,
        "filter_rate_pct": round(filtered_count / total * 100, 2) if total else 0,
        "avg_latency_ms":  round(avg_latency, 2) if avg_latency else 0,
    }


@router.get("/trend", summary="Daily request counts over the last N days")
async def trend(
    days: int = Query(7, ge=1, le=90, description="Number of days to look back"),
    db: AsyncSession = Depends(get_db),
):
    """Returns a list of {date, total, safe, risky, dangerous} per day."""
    since = datetime.now(timezone.utc) - timedelta(days=days)

    rows = (
        await db.execute(
            select(
                func.date(OutputLog.created_at).label("day"),
                OutputLog.risk_level,
                func.count().label("count"),
            )
            .where(OutputLog.created_at >= since)
            .group_by("day", OutputLog.risk_level)
            .order_by("day")
        )
    ).all()

    # Aggregate into {date: {safe:n, risky:n, dangerous:n, total:n}}
    by_day: dict[str, dict] = {}
    for row in rows:
        day = str(row.day)
        if day not in by_day:
            by_day[day] = {"date": day, "total": 0, "safe": 0, "risky": 0, "dangerous": 0}
        by_day[day][row.risk_level] += row.count
        by_day[day]["total"] += row.count

    return {"days": days, "trend": list(by_day.values())}
