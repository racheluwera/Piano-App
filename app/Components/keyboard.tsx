"use client";
import { useRef, useEffect, useState } from "react";
import PianoKey from "./pianoKey";
import { OCTAVES, WHITE_NOTES, WHITE_KEY_LABELS, WHITE_KEY_HINTS, BLACK_NOTE_POSITIONS } from "../lib/constants";

const BASE_WHITE_W = 42;
const BASE_WHITE_H = 160;
const BASE_BLACK_W = 26;
const BASE_BLACK_H = 100;

const TOTAL_WHITE = OCTAVES.length * WHITE_NOTES.length;

function OctaveKeys({
  octave, scale, onNoteOn, onNoteOff, activeNotes, showNoteLabels, showKeyHints,
}: {
  octave: number;
  scale: number;
  onNoteOn: (n: string) => void;
  onNoteOff: (n: string) => void;
  activeNotes: Set<string>;
  showNoteLabels: boolean;
  showKeyHints: boolean;
}) {
  const wW = BASE_WHITE_W * scale;
  const wH = BASE_WHITE_H * scale;
  const bW = BASE_BLACK_W * scale;
  const bH = BASE_BLACK_H * scale;
  const totalW = WHITE_NOTES.length * wW;

  return (
    <div style={{ position: "relative", width: totalW, height: wH, flexShrink: 0 }}>
      {WHITE_NOTES.map((n, i) => {
        const note = `${n}${octave}`;
        return (
          <div key={note} style={{ position: "absolute", left: i * wW, top: 0 }}>
            <PianoKey
              note={note}
              label={showNoteLabels ? WHITE_KEY_LABELS[n] : ""}
              keyHint={showKeyHints ? WHITE_KEY_HINTS[n] : ""}
              isActive={activeNotes.has(note)}
              onNoteOn={onNoteOn}
              onNoteOff={onNoteOff}
              width={wW}
              height={wH}
            />
          </div>
        );
      })}
      {BLACK_NOTE_POSITIONS.map(({ note: n, offset, hint }) => {
        const note = `${n}${octave}`;
        const left = offset * wW - bW / 2;
        return (
          <div key={note} style={{ position: "absolute", left, top: 0, zIndex: 10 }}>
            <PianoKey
              note={note}
              label=""
              keyHint={showKeyHints ? hint : ""}
              isBlack
              isActive={activeNotes.has(note)}
              onNoteOn={onNoteOn}
              onNoteOff={onNoteOff}
              width={bW}
              height={bH}
            />
          </div>
        );
      })}
    </div>
  );
}

type Props = {
  onNoteOn: (note: string) => void;
  onNoteOff: (note: string) => void;
  activeNotes: Set<string>;
  showNoteLabels: boolean;
  showKeyHints: boolean;
};

export default function Keyboard({ onNoteOn, onNoteOff, activeNotes, showNoteLabels, showKeyHints }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 40; // subtract padding
      const natural = TOTAL_WHITE * BASE_WHITE_W;
      // scale down to fit, but never scale up beyond 1
      setScale(Math.min(1, available / natural));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="keys-section">
      <div style={{ display: "flex" }}>
        {OCTAVES.map((o) => (
          <OctaveKeys
            key={o} octave={o} scale={scale}
            onNoteOn={onNoteOn} onNoteOff={onNoteOff}
            activeNotes={activeNotes}
            showNoteLabels={showNoteLabels}
            showKeyHints={showKeyHints}
          />
        ))}
      </div>
    </div>
  );
}
