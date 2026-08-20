"use client";
import { useEffect, useRef } from "react";
import * as Tone from "tone";
import PianoKey from "./pianoKey";

const whiteKeys = [
  { note: "C4", label: "Do" },
  { note: "D4", label: "Re" },
  { note: "E4", label: "Mi" },
  { note: "F4", label: "Fa" },
  { note: "G4", label: "Sol" },
  { note: "A4", label: "La" },
  { note: "B4", label: "Ti" },
];
const keyMap: Record<string, string> = {
  a: "C4", s: "D4", d: "E4", f: "F4", g: "G4", h: "A4", j: "B4",
  w: "C#4", e: "D#4", t: "F#4", y: "G#4", u: "A#4",
};

export default function Piano() {
  const synthRef = useRef<Tone.Synth | null>(null);

  async function playNote(note: string) {
    await Tone.start();
    if (!synthRef.current) synthRef.current = new Tone.Synth().toDestination();
    synthRef.current.triggerAttackRelease(note, "8n");
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const note = keyMap[event.key.toLowerCase()];
      if (note) playNote(note);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex">
      {whiteKeys.map((key) => (
        <PianoKey
          key={key.note}
          note={key.note}
          label={key.label}
          onNoteOn={playNote}
          onNoteOff={() => {}}
        />
      ))}
    </div>
  );
}
