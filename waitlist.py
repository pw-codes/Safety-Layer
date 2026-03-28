"""
routers/waitlist.py
POST /api/waitlist  — add an email to the early-access waitlist
GET  /api/waitlist  — admin list (no auth for MVP; add JWT guard before production)
"""

from __future__ import annotations
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.models.database import get_db
from app.models.waitlist_entry import WaitlistEntry

router = APIRouter()

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class WaitlistRequest(BaseModel):
    email: EmailStr


@router.post("", status_code=201, summary="Join early-access waitlist")
async def join_waitlist(
    body: WaitlistRequest,
    db: AsyncSession = Depends(get_db),
):
    entry = WaitlistEntry(email=body.email.lower().strip())
    db.add(entry)
    try:
        await db.commit()
        await db.refresh(entry)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="This email is already registered.")

    return {"message": "You're on the list!", "entry": entry.to_dict()}


@router.get("", summary="List all waitlist entries (admin)")
async def list_waitlist(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(WaitlistEntry).order_by(WaitlistEntry.created_at))).scalars().all()
    return {"count": len(rows), "entries": [r.to_dict() for r in rows]}
