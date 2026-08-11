"use client";
import { useState } from "react";

type PianoKeyProps = {
  note: string;
  label: string;
  keyHint?: string;
  isBlack?: boolean;
  isActive?: boolean;
  onPlay: (note: string) => void;
};

export default function PianoKey({ note, label, keyHint, isBlack, isActive, onPlay }: PianoKeyProps) {
  const [ripple, setRipple] = useState(false);

  function handlePress() {
    onPlay(note);
    setRipple(false);
    requestAnimationFrame(() => setRipple(true));
    setTimeout(() => setRipple(false), 420);
  }

  if (isBlack) {
    return (
      <div
        role="button"
        aria-label={note}
        onPointerDown={handlePress}
        className={`key-black ${isActive ? "active" : ""}`}
        style={{ width: 36, height: 110 }}
      >
        {ripple && <span className="note-ripple" />}
        {keyHint && (
          <span style={{
            position: "absolute", bottom: 8, left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9, color: "rgba(200,169,110,0.6)",
            fontWeight: 700, letterSpacing: "0.05em",
          }}>
            {keyHint}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      role="button"
      aria-label={note}
      onPointerDown={handlePress}
      className={`key-white ${isActive ? "active" : ""}`}
      style={{ width: 56, height: 180 }}
    >
      {ripple && <span className="note-ripple" />}
      <div style={{
        position: "absolute", bottom: 10, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      }}>
        {keyHint && (
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: isActive ? "#1a1008" : "rgba(160,130,80,0.7)",
            letterSpacing: "0.05em",
          }}>
            {keyHint.toUpperCase()}
          </span>
        )}
        <span style={{
          fontSize: 11,
          color: isActive ? "#1a1008" : "#9a8a6a",
          fontWeight: 600,
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}
