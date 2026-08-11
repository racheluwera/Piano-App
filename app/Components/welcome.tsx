"use client";
import { useState } from "react";

type Props = { onStart: () => void };

export default function Welcome({ onStart }: Props) {
  const [hiding, setHiding] = useState(false);

  function handleStart() {
    setHiding(true);
    setTimeout(onStart, 380);
  }

  return (
    <div className={`welcome-overlay ${hiding ? "hiding" : ""}`}>
      <div style={{
        textAlign: "center", maxWidth: 420, padding: "0 24px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      }}>
        <div style={{ fontSize: 64 }}>🎹</div>

        <h1 style={{
          fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
          fontWeight: 800, color: "#c8a96e",
          letterSpacing: "-0.02em", margin: 0,
        }}>
          My Piano
        </h1>

        <p style={{ color: "#9a8a6a", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
          A real piano in your browser — play with your keyboard,
          tap on mobile, or click on desktop. No download needed.
        </p>

        <div style={{
          background: "rgba(200,169,110,0.08)",
          border: "1px solid rgba(200,169,110,0.2)",
          borderRadius: 12, padding: "14px 20px",
          display: "flex", flexDirection: "column", gap: 8,
          width: "100%",
        }}>
          <Row icon="⌨️" text="Keys A–J for white notes, W E T Y U for black" />
          <Row icon="👆" text="Tap or click any key to play" />
          <Row icon="🎛️" text="Switch sounds, octave, reverb & sustain above" />
          <Row icon="📱" text="Works on phone, tablet and desktop" />
        </div>

        <button
          onClick={handleStart}
          style={{
            background: "linear-gradient(135deg, #c8a96e, #e8c98e)",
            color: "#1a1008", border: "none", borderRadius: 999,
            padding: "14px 48px", fontSize: "1rem", fontWeight: 800,
            cursor: "pointer", letterSpacing: "0.04em",
            boxShadow: "0 0 24px rgba(200,169,110,0.4)",
            transition: "transform 150ms ease, box-shadow 150ms ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1.05)";
            (e.target as HTMLElement).style.boxShadow = "0 0 36px rgba(200,169,110,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1)";
            (e.target as HTMLElement).style.boxShadow = "0 0 24px rgba(200,169,110,0.4)";
          }}
        >
          Start Playing
        </button>

        <p style={{ color: "#5a4a2a", fontSize: "0.75rem", margin: 0 }}>
          Works on Chrome · Safari · Firefox · Edge
        </p>
      </div>
    </div>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left" }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span style={{ color: "#c8a96e", fontSize: "0.82rem", lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}
