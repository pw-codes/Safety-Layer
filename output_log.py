"""
models/output_log.py
ORM model for storing every AI output and its safety evaluation.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Enum
from app.models.database import Base
import enum


class RiskLevel(str, enum.Enum):
    SAFE      = "safe"
    RISKY     = "risky"
    DANGEROUS = "dangerous"


class OutputLog(Base):
    __tablename__ = "output_logs"

    id            = Column(Integer, primary_key=True, index=True)
    request_id    = Column(String(64),  nullable=False, index=True)
    user_prompt   = Column(Text,        nullable=False)
    raw_output    = Column(Text,        nullable=False)
    filtered_output = Column(Text,      nullable=True)   # None if not filtered
    risk_level    = Column(Enum(RiskLevel), nullable=False, default=RiskLevel.SAFE)
    risk_score    = Column(Float,       nullable=False, default=0.0)
    was_filtered  = Column(Integer,     nullable=False, default=0)  # 0/1 bool
    filter_reason = Column(String(255), nullable=True)
    model_name    = Column(String(64),  nullable=False, default="mistral")
    latency_ms    = Column(Float,       nullable=True)
    created_at    = Column(DateTime,    nullable=False,
                           default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id":               self.id,
            "request_id":       self.request_id,
            "risk_level":       self.risk_level,
            "risk_score":       self.risk_score,
            "was_filtered":     bool(self.was_filtered),
            "filter_reason":    self.filter_reason,
            "model_name":       self.model_name,
            "latency_ms":       self.latency_ms,
            "created_at":       self.created_at.isoformat(),
        }
