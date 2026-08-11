import * as Tone from "tone";
import type { InstrumentType } from "./constants";

export function createInstrument(type: InstrumentType): Tone.Synth | Tone.PolySynth {
  switch (type) {
    case "piano":
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 1.2, sustain: 0.1, release: 1.5 },
      });
    case "organ":
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 1, release: 0.5 },
      });
    default:
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "square" },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0.4, release: 0.8 },
      });
  }
}
