"use client";
import { useEffect, useState } from "react";

type Props = { activeNotes: Set<string> };

export default function NoteDisplay({ activeNotes }: Props) {
  const [shown, setShown] = useState<string[]>([]);

  useEffect(() => {
    const notes = Array.from(activeNotes);
    if (notes.length === 0) return;
    const id = Date.now().toString();
    const tagged = notes.map((n) => `${n}__${id}`);
    setShown((prev) => [...prev.slice(-6), ...tagged]);
    const t = setTimeout(() => {
      setShown((prev) => prev.filter((x) => !tagged.includes(x)));
    }, 900);
    return () => clearTimeout(t);
  }, [activeNotes]);

  return (
    <div style={{
      height: 40, display: "flex", alignItems: "center",
      justifyContent: "center", gap: 8, overflow: "hidden",
    }}>
      {shown.map((tagged) => {
        const note = tagged.split("__")[0];
        return (
          <span
            key={tagged}
            style={{
              color: "#c8a96e", fontWeight: 700, fontSize: "1rem",
              letterSpacing: "0.05em",
              animation: "floatUp 900ms ease-out forwards",
            }}
          >
            {note}
          </span>
        );
      })}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-28px); }
        }
      `}</style>
    </div>
  );
}
