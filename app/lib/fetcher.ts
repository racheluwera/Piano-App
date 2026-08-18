export type PianoConfig = {
  version: string;
  octaves: number[];
  defaultOctave: number;
  whiteNotes: string[];
  whiteKeyLabels: Record<string, string>;
  whiteKeyHints: Record<string, string>;
  blackKeys: { note: string; offset: number; hint: string }[];
  keyMap: Record<string, string>;
  instruments: { id: string; icon: string; label: string }[];
  defaultInstrument: string;
  settings: {
    defaultVolume: number;
    minVolume: number;
    maxVolume: number;
    defaultReverb: number;
    defaultSustain: boolean;
  };
};
export async function fetchPianoConfig(): Promise<PianoConfig> {
  const res = await fetch("/api/piano");
  if (!res.ok) throw new Error("Failed to load piano config");
  const json = await res.json();
  return json.data as PianoConfig;
}
