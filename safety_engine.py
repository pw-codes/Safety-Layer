"""
services/safety_engine.py
Core safety evaluation pipeline.

Layers (applied in order):
  1. Regex pattern matching  (fast, zero-cost)
  2. spaCy NLP entity checks (medium cost)
  3. Detoxify toxicity model (high accuracy, slower)

Returns a SafetyResult with risk_level, risk_score, and reason.
"""

from __future__ import annotations
import re
import time
from dataclasses import dataclass
from typing import Optional

# ── Optional heavy imports (graceful degradation if not installed) ─────────────
try:
    import spacy
    _nlp = spacy.load("en_core_web_sm")
    _SPACY_AVAILABLE = True
except Exception:
    _nlp = None
    _SPACY_AVAILABLE = False

try:
    from detoxify import Detoxify
    _detox = Detoxify("original")
    _DETOXIFY_AVAILABLE = True
except Exception:
    _detox = None
    _DETOXIFY_AVAILABLE = False


# ── Risk thresholds ────────────────────────────────────────────────────────────
RISKY_THRESHOLD     = 0.4
DANGEROUS_THRESHOLD = 0.75

# ── Regex patterns ─────────────────────────────────────────────────────────────
_DANGEROUS_PATTERNS = [
    re.compile(r"\b(how to (make|build|create) (a )?(bomb|weapon|poison|malware|virus))\b", re.I),
    re.compile(r"\b(suicide|self.?harm|kill (my|your)self)\b", re.I),
    re.compile(r"\b(child (porn|abuse|exploitation))\b", re.I),
    re.compile(r"\b(synthesize|manufacture)\s+(meth|fentanyl|heroin)\b", re.I),
]

_RISKY_PATTERNS = [
    re.compile(r"\b(hate|racist|sexist|discriminat)\b", re.I),
    re.compile(r"\b(illegal|fraud|scam|phishing)\b", re.I),
    re.compile(r"\b(explicit|nsfw|xxx)\b", re.I),
]


@dataclass
class SafetyResult:
    risk_level:   str            # "safe" | "risky" | "dangerous"
    risk_score:   float          # 0.0 – 1.0
    was_filtered: bool
    filter_reason: Optional[str]
    filtered_output: Optional[str]
    latency_ms:   float


def evaluate(text: str) -> SafetyResult:
    """
    Run the full safety pipeline on `text`.
    Returns a SafetyResult.
    """
    start = time.perf_counter()

    # --- Layer 1: Regex ---
    for pattern in _DANGEROUS_PATTERNS:
        if pattern.search(text):
            return _build_result(
                text, score=0.95, level="dangerous",
                reason="Matched dangerous content pattern",
                start=start,
            )

    regex_score = 0.0
    for pattern in _RISKY_PATTERNS:
        if pattern.search(text):
            regex_score = max(regex_score, 0.45)

    # --- Layer 2: spaCy (PII / sensitive entities) ---
    spacy_score = 0.0
    if _SPACY_AVAILABLE and _nlp:
        doc = _nlp(text[:512])   # cap at 512 chars for speed
        sensitive_labels = {"PERSON", "GPE", "ORG", "LOC"}
        entity_count = sum(1 for ent in doc.ents if ent.label_ in sensitive_labels)
        if entity_count > 5:
            spacy_score = 0.35   # lots of PII-like entities → mildly risky

    # --- Layer 3: Detoxify ---
    detox_score = 0.0
    if _DETOXIFY_AVAILABLE and _detox:
        results = _detox.predict(text[:512])
        detox_score = max(
            results.get("toxicity", 0),
            results.get("severe_toxicity", 0),
            results.get("threat", 0),
        )

    combined_score = max(regex_score, spacy_score, detox_score)

    if combined_score >= DANGEROUS_THRESHOLD:
        return _build_result(text, score=combined_score, level="dangerous",
                             reason="High toxicity score detected", start=start)
    elif combined_score >= RISKY_THRESHOLD:
        return _build_result(text, score=combined_score, level="risky",
                             reason="Moderate risk content detected", start=start)
    else:
        elapsed = (time.perf_counter() - start) * 1000
        return SafetyResult(
            risk_level="safe",
            risk_score=round(combined_score, 4),
            was_filtered=False,
            filter_reason=None,
            filtered_output=None,
            latency_ms=round(elapsed, 2),
        )


def _build_result(
    text: str,
    score: float,
    level: str,
    reason: str,
    start: float,
) -> SafetyResult:
    elapsed = (time.perf_counter() - start) * 1000
    filtered = _redact(text) if level == "dangerous" else text
    return SafetyResult(
        risk_level=level,
        risk_score=round(score, 4),
        was_filtered=(level == "dangerous"),
        filter_reason=reason,
        filtered_output=filtered if level == "dangerous" else None,
        latency_ms=round(elapsed, 2),
    )


def _redact(text: str) -> str:
    """Replace flagged content with a safe placeholder."""
    return "[This response was blocked by SafeLayer due to unsafe content.]"
