"use client";
import PianoKey from "./pianoKey";
import { WHITE_NOTES, WHITE_KEY_LABELS, WHITE_KEY_HINTS, BLACK_NOTE_POSITIONS } from "../lib/constants";
import type { Octave } from "../lib/constants";

const WHITE_KEY_W = 42;
const WHITE_KEY_H = 160;
const BLACK_KEY_W = 26;
const BLACK_KEY_H = 100;

function OctaveKeys({
  octave, onPlay, activeNotes, showNoteLabels, showKeyHints,
}: {
  octave: number;
  onPlay: (n: string) => void;
  activeNotes: Set<string>;
  showNoteLabels: boolean;
  showKeyHints: boolean;
}) {
  const totalW = WHITE_NOTES.length * WHITE_KEY_W;
  return (
    <div className="relative" style={{ width: totalW, height: WHITE_KEY_H, flexShrink: 0 }}>
      {WHITE_NOTES.map((n, i) => {
        const note = `${n}${octave}`;
        return (
          <div key={note} style={{ position: "absolute", left: i * WHITE_KEY_W, top: 0 }}>
            <PianoKey
              note={note}
              label={showNoteLabels ? WHITE_KEY_LABELS[n] : ""}
              keyHint={showKeyHints ? WHITE_KEY_HINTS[n] : ""}
              isActive={activeNotes.has(note)}
              onPlay={onPlay}
              width={WHITE_KEY_W}
              height={WHITE_KEY_H}
            />
          </div>
        );
      })}
      {BLACK_NOTE_POSITIONS.map(({ note: n, offset, hint }) => {
        const note = `${n}${octave}`;
        const left = offset * WHITE_KEY_W - BLACK_KEY_W / 2;
        return (
          <div key={note} style={{ position: "absolute", left, top: 0, zIndex: 10 }}>
            <PianoKey
              note={note}
              label=""
              keyHint={showKeyHints ? hint : ""}
              isBlack
              isActive={activeNotes.has(note)}
              onPlay={onPlay}
              width={BLACK_KEY_W}
              height={BLACK_KEY_H}
            />
          </div>
        );
      })}
    </div>
  );
}

type Props = {
  octave: Octave;
  onPlay: (note: string) => void;
  activeNotes: Set<string>;
  showNoteLabels: boolean;
  showKeyHints: boolean;
};

export default function Keyboard({ octave, onPlay, activeNotes, showNoteLabels, showKeyHints }: Props) {
  const octaves = [Math.max(2, octave - 1), octave, Math.min(6, octave + 1)];
  return (
    <div className="keys-section">
      <div style={{ display: "flex", gap: 1 }}>
        {octaves.map((o) => (
          <OctaveKeys
            key={o} octave={o} onPlay={onPlay}
            activeNotes={activeNotes}
            showNoteLabels={showNoteLabels}
            showKeyHints={showKeyHints}
          />
        ))}
      </div>
    </div>
  );
}
