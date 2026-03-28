"""
models/waitlist_entry.py
ORM model for early-access waitlist sign-ups.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from app.models.database import Base


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id         = Column(Integer, primary_key=True, index=True)
    email      = Column(String(254), nullable=False, unique=True, index=True)
    created_at = Column(DateTime, nullable=False,
                        default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id":         self.id,
            "email":      self.email,
            "created_at": self.created_at.isoformat(),
        }
