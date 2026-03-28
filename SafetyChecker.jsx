/**
 * SafetyChecker.jsx
 * React component — interactive safety check widget.
 * Calls POST /api/safety/check and displays the result.
 *
 * Usage:
 *   import SafetyChecker from './components/SafetyChecker';
 *   <SafetyChecker apiBase="http://localhost:8000" />
 */

import { useState, useCallback } from "react";

// ── Risk colour map ────────────────────────────────────────────────────────────
const RISK_META = {
  safe:      { color: "#39ff14", label: "SAFE",      bg: "rgba(57,255,20,0.08)"  },
  risky:     { color: "#ffc800", label: "RISKY",     bg: "rgba(255,200,0,0.08)"  },
  dangerous: { color: "#ff4d6d", label: "DANGEROUS", bg: "rgba(255,77,109,0.08)" },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function RiskBadge({ level }) {
  const meta = RISK_META[level] ?? RISK_META.safe;
  return (
    <span style={{
      fontFamily: "monospace",
      fontSize: "0.7rem",
      letterSpacing: "0.15em",
      padding: "0.25rem 0.6rem",
      border: `1px solid ${meta.color}`,
      background: meta.bg,
      color: meta.color,
      borderRadius: "2px",
      textTransform: "uppercase",
    }}>
      {meta.label}
    </span>
  );
}

function ScoreBar({ score }) {
  const pct   = Math.round(score * 100);
  const color = score >= 0.75 ? "#ff4d6d" : score >= 0.4 ? "#ffc800" : "#39ff14";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.75rem", color: "#6b88a4", fontFamily: "monospace" }}>RISK SCORE</span>
        <span style={{ fontSize: "0.75rem", color, fontFamily: "monospace", fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: "4px", background: "#1a2a3a", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: color,
          transition: "width 0.6s ease",
          boxShadow: `0 0 6px ${color}`,
        }} />
      </div>
    </div>
  );
}

function ResultCard({ result }) {
  return (
    <div style={{
      background: "#0f1e2e",
      border: `1px solid ${RISK_META[result.risk_level]?.color ?? "#1a2a3a"}`,
      padding: "1.5rem",
      marginTop: "1.2rem",
      clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <RiskBadge level={result.risk_level} />
        <span style={{ fontSize: "0.7rem", color: "#6b88a4", fontFamily: "monospace" }}>
          {result.latency_ms}ms
        </span>
      </div>

      {/* Score bar */}
      <ScoreBar score={result.risk_score} />

      {/* Output */}
      <div style={{ marginTop: "1rem" }}>
        <p style={{ fontSize: "0.7rem", color: "#6b88a4", fontFamily: "monospace", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>
          {result.was_filtered ? "FILTERED OUTPUT" : "AI OUTPUT"}
        </p>
        <p style={{
          fontSize: "0.9rem",
          color: result.was_filtered ? "#ff4d6d" : "#e8f0fe",
          lineHeight: 1.6,
          fontStyle: result.was_filtered ? "italic" : "normal",
        }}>
          {result.safe_output}
        </p>
      </div>

      {/* Filter reason */}
      {result.filter_reason && (
        <div style={{
          marginTop: "0.8rem",
          padding: "0.5rem 0.8rem",
          background: "rgba(255,77,109,0.06)",
          border: "1px solid rgba(255,77,109,0.2)",
          fontSize: "0.78rem",
          color: "#ff4d6d",
          fontFamily: "monospace",
        }}>
          ⚠ {result.filter_reason}
        </div>
      )}

      {/* Request ID */}
      <p style={{ marginTop: "0.8rem", fontSize: "0.65rem", color: "#6b88a4", fontFamily: "monospace" }}>
        ID: {result.request_id}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function SafetyChecker({ apiBase = "http://localhost:8000" }) {
  const [prompt,  setPrompt]  = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleCheck = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${apiBase}/api/safety/check`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [prompt, apiBase]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleCheck();
  };

  // ── Styles (inline for portability) ──────────────────────────────────────────
  const cardStyle = {
    background:  "#060a0f",
    border:      "1px solid #1a2a3a",
    padding:     "2rem",
    fontFamily:  "'Syne', sans-serif",
    color:       "#e8f0fe",
    maxWidth:    "680px",
    clipPath:    "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
  };

  const labelStyle = {
    display:       "block",
    fontSize:      "0.7rem",
    fontFamily:    "monospace",
    color:         "#6b88a4",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom:  "0.6rem",
  };

  const textareaStyle = {
    width:       "100%",
    background:  "#0d1520",
    border:      "1px solid #1a2a3a",
    color:       "#e8f0fe",
    padding:     "0.85rem 1rem",
    fontSize:    "0.9rem",
    resize:      "vertical",
    minHeight:   "100px",
    outline:     "none",
    fontFamily:  "'Syne', sans-serif",
    lineHeight:  1.6,
    transition:  "border-color 0.2s",
  };

  const btnStyle = {
    marginTop:   "1rem",
    background:  loading ? "#1a2a3a" : "#00e5ff",
    color:       loading ? "#6b88a4" : "#060a0f",
    border:      "none",
    padding:     "0.75rem 1.8rem",
    fontFamily:  "monospace",
    fontSize:    "0.8rem",
    fontWeight:  700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor:      loading ? "not-allowed" : "pointer",
    clipPath:    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
    transition:  "background 0.2s, color 0.2s",
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#39ff14", display: "inline-block",
            boxShadow: "0 0 8px #39ff14", animation: "blink 1.4s infinite" }} />
          <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#39ff14", letterSpacing: "0.15em" }}>
            SAFELAYER ACTIVE
          </span>
        </div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Safety Checker
        </h2>
        <p style={{ color: "#6b88a4", fontSize: "0.88rem", marginTop: "0.3rem" }}>
          Send a prompt — SafeLayer evaluates the AI response in real time.
        </p>
      </div>

      {/* Input */}
      <label style={labelStyle} htmlFor="sl-prompt">Your Prompt</label>
      <textarea
        id="sl-prompt"
        style={textareaStyle}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a prompt to test (Ctrl+Enter to submit)…"
        disabled={loading}
        onFocus={(e)  => (e.target.style.borderColor = "#00e5ff")}
        onBlur={(e)   => (e.target.style.borderColor = "#1a2a3a")}
      />

      <button style={btnStyle} onClick={handleCheck} disabled={loading || !prompt.trim()}>
        {loading ? "Evaluating…" : "Check Safety →"}
      </button>

      {/* Error */}
      {error && (
        <div style={{ marginTop: "1rem", padding: "0.6rem 0.8rem", background: "rgba(255,77,109,0.08)",
          border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d", fontSize: "0.85rem", fontFamily: "monospace" }}>
          ✕ {error}
        </div>
      )}

      {/* Result */}
      {result && <ResultCard result={result} />}

      <p style={{ marginTop: "1rem", fontSize: "0.65rem", color: "#6b88a4", fontFamily: "monospace" }}>
        API: {apiBase}/api/safety/check &nbsp;·&nbsp; Ctrl+Enter to submit
      </p>
    </div>
  );
}
