"use client";
import { useEffect, useState } from "react";

type Props = { activeNotes: Set<string> };

export default function NoteDisplay({ activeNotes }: Props) {
  const [shown, setShown] = useState<string[]>([]);

  useEffect(() => {
    const notes = Array.from(activeNotes);
    if (!notes.length) return;
    const tagged = notes.map((n) => `${n}__${Date.now()}`);
    setShown((prev) => [...prev.slice(-4), ...tagged]);
    const t = setTimeout(() => {
      setShown((prev) => prev.filter((x) => !tagged.includes(x)));
    }, 800);
    return () => clearTimeout(t);
  }, [activeNotes]);

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", minWidth: 80 }}>
      {shown.map((tagged) => (
        <span
          key={tagged}
          style={{
            color: "#90c890",
            fontFamily: "Courier New, monospace",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            animation: "fadeNote 800ms ease-out forwards",
          }}
        >
          {tagged.split("__")[0]}
        </span>
      ))}
      <style>{`
        @keyframes fadeNote {
          0%   { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
