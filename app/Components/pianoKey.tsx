"use client";
import { useState } from "react";

type PianoKeyProps = {
  note: string;
  label: string;
  keyHint?: string;
  isBlack?: boolean;
  isActive?: boolean;
  width?: number;
  height?: number;
  onPlay: (note: string) => void;
};

export default function PianoKey({
  note, label, keyHint, isBlack, isActive, width, height, onPlay,
}: PianoKeyProps) {
  const [ripple, setRipple] = useState(false);

  function handlePress() {
    onPlay(note);
    setRipple(false);
    requestAnimationFrame(() => setRipple(true));
    setTimeout(() => setRipple(false), 360);
  }

  if (isBlack) {
    return (
      <div
        role="button"
        aria-label={note}
        onPointerDown={handlePress}
        className={`key-black ${isActive ? "active" : ""}`}
        style={{ width: width ?? 26, height: height ?? 100 }}
      >
        {ripple && <span className="note-ripple" />}
        {keyHint && (
          <span style={{
            position: "absolute", bottom: 7, left: "50%",
            transform: "translateX(-50%)",
            fontSize: 8, color: "rgba(180,200,255,0.5)",
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
      style={{ width: width ?? 42, height: height ?? 160 }}
    >
      {ripple && <span className="note-ripple" />}
      <div style={{
        position: "absolute", bottom: 8, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
      }}>
        {keyHint && (
          <span style={{
            fontSize: 9, fontWeight: 700,
            color: isActive ? "#fff" : "rgba(100,100,100,0.6)",
            letterSpacing: "0.04em",
          }}>
            {keyHint}
          </span>
        )}
        <span style={{
          fontSize: 9,
          color: isActive ? "#fff" : "#aaa",
          fontWeight: 600,
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}
