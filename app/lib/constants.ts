export const OCTAVES = [2, 3, 4, 5, 6] as const;
export type Octave = (typeof OCTAVES)[number];

export const WHITE_KEY_LABELS: Record<string, string> = {
  C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Ti",
};

// keyboard shortcut shown on each white key
export const WHITE_KEY_HINTS: Record<string, string> = {
  C: "A", D: "S", E: "D", F: "F", G: "G", A: "H", B: "J",
};

export const WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B"] as const;

// black key: note name + position offset (each white key = 56px wide)
export const BLACK_NOTE_POSITIONS: { note: string; offset: number; hint: string }[] = [
  { note: "C#", offset: 1, hint: "W" },
  { note: "D#", offset: 2, hint: "E" },
  { note: "F#", offset: 4, hint: "T" },
  { note: "G#", offset: 5, hint: "Y" },
  { note: "A#", offset: 6, hint: "U" },
];

export const KEY_MAP_BASE: Record<string, string> = {
  a: "C", s: "D", d: "E", f: "F", g: "G", h: "A", j: "B",
  w: "C#", e: "D#", t: "F#", y: "G#", u: "A#",
};

export const INSTRUMENT_TYPES = ["synth", "piano", "organ"] as const;
export type InstrumentType = (typeof INSTRUMENT_TYPES)[number];

export const INSTRUMENT_ICONS: Record<InstrumentType, string> = {
  synth: "🎛️",
  piano: "🎹",
  organ: "🎸",
};
