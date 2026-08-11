"use client";
import PianoKey from "./pianoKey";
import { WHITE_NOTES, WHITE_KEY_LABELS, WHITE_KEY_HINTS, BLACK_NOTE_POSITIONS } from "../lib/constants";
import type { Octave } from "../lib/constants";

const WHITE_KEY_W = 56; // px — must match pianoKey width
const BLACK_KEY_W = 36;

type Props = {
  octave: Octave;
  onPlay: (note: string) => void;
  activeNotes: Set<string>;
};

export default function Keyboard({ octave, onPlay, activeNotes }: Props) {
  const totalWidth = WHITE_NOTES.length * WHITE_KEY_W;

  return (
    <div className="keys-wrapper" style={{ width: "100%" }}>
      <div className="relative flex" style={{ width: totalWidth, minWidth: totalWidth }}>
        {/* White keys */}
        {WHITE_NOTES.map((n) => {
          const note = `${n}${octave}`;
          return (
            <PianoKey
              key={note}
              note={note}
              label={WHITE_KEY_LABELS[n]}
              keyHint={WHITE_KEY_HINTS[n]}
              isActive={activeNotes.has(note)}
              onPlay={onPlay}
            />
          );
        })}

        {/* Black keys — positioned absolutely over white keys */}
        {BLACK_NOTE_POSITIONS.map(({ note: n, offset, hint }) => {
          const note = `${n}${octave}`;
          // center black key between two white keys
          const left = offset * WHITE_KEY_W - BLACK_KEY_W / 2;
          return (
            <div key={note} className="absolute" style={{ left, top: 0 }}>
              <PianoKey
                note={note}
                label=""
                keyHint={hint}
                isBlack
                isActive={activeNotes.has(note)}
                onPlay={onPlay}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
