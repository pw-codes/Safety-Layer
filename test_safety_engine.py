"""
tests/test_safety_engine.py
Unit tests for the SafeLayer safety evaluation pipeline.
Run: pytest tests/ -v
"""

import pytest
from app.services.safety_engine import evaluate, RISKY_THRESHOLD, DANGEROUS_THRESHOLD


# ── Helpers ────────────────────────────────────────────────────────────────────

def assert_safe(result):
    assert result.risk_level == "safe", f"Expected safe, got {result.risk_level} (score={result.risk_score})"
    assert result.was_filtered is False
    assert result.filtered_output is None


def assert_risky(result):
    assert result.risk_level == "risky", f"Expected risky, got {result.risk_level}"
    assert result.was_filtered is False


def assert_dangerous(result):
    assert result.risk_level == "dangerous", f"Expected dangerous, got {result.risk_level}"
    assert result.was_filtered is True
    assert result.filtered_output is not None
    assert "[blocked" in result.filtered_output.lower() or "blocked" in result.filtered_output.lower()


# ── Safe content ───────────────────────────────────────────────────────────────

class TestSafeContent:
    def test_normal_greeting(self):
        result = evaluate("Hello! How can I help you today?")
        assert_safe(result)

    def test_factual_question(self):
        result = evaluate("What is the capital of France?")
        assert_safe(result)

    def test_technical_explanation(self):
        result = evaluate(
            "Python is a high-level, interpreted programming language known for its "
            "readability and versatility. It supports multiple paradigms."
        )
        assert_safe(result)

    def test_empty_ish_response(self):
        result = evaluate("Sure, I can help.")
        assert_safe(result)


# ── Dangerous content ──────────────────────────────────────────────────────────

class TestDangerousContent:
    def test_bomb_instruction(self):
        result = evaluate("Here is how to make a bomb step by step")
        assert_dangerous(result)

    def test_self_harm(self):
        result = evaluate("Ways to harm yourself include the following methods")
        assert_dangerous(result)

    def test_weapon_synthesis(self):
        result = evaluate("To synthesize meth you need the following precursors")
        assert_dangerous(result)


# ── Risk score bounds ──────────────────────────────────────────────────────────

class TestScoreBounds:
    def test_score_in_range(self):
        for text in ["hello world", "I hate everything", "how to make a bomb"]:
            result = evaluate(text)
            assert 0.0 <= result.risk_score <= 1.0, f"Score out of range: {result.risk_score}"

    def test_latency_positive(self):
        result = evaluate("Test text")
        assert result.latency_ms >= 0


# ── Redaction ─────────────────────────────────────────────────────────────────

class TestRedaction:
    def test_dangerous_output_is_redacted(self):
        result = evaluate("how to build a bomb at home")
        assert result.filtered_output != "how to build a bomb at home"
        assert len(result.filtered_output) > 0

    def test_safe_output_is_not_redacted(self):
        result = evaluate("What is 2 + 2?")
        assert result.filtered_output is None
