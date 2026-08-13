/**
 * audio.ts — Piano audio engine
 *
 * Signal chain (per note):
 *   Sampler ──► EQ3 (tone/brightness) ──► velocityGain ──► Reverb (wet)
 *                                                        └──► Dry gain
 *                                                              └──► Limiter ──► Master volume ──► Destination
 *
 * All nodes are singletons — rebuilt only when instrument type changes.
 */
import * as Tone from "tone";
import type { InstrumentType } from "./constants";

// ── note name tables ──────────────────────────────────────────────────────────
const SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;
const FLAT  = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"] as const;

function buildPianoUrls(): Record<string, string> {
  const urls: Record<string, string> = {};
  const add = (tone: string, file: string) => { urls[tone] = `${file}.mp3`; };
  add("A0", "A0"); add("A#0", "Bb0"); add("B0", "B0");
  for (let o = 1; o <= 7; o++) {
    SHARP.forEach((n, i) => add(`${n}${o}`, `${FLAT[i]}${o}`));
  }
  add("C8", "C8");
  return urls;
}

const PIANO_URLS = buildPianoUrls();

// ── singleton state ───────────────────────────────────────────────────────────
let pianoSampler: Tone.Sampler | null = null;
let pianoSamplesLoaded = false;
const loadWaiters = new Set<() => void>();

// ── master signal chain (shared across all instruments) ───────────────────────
let masterVol:  Tone.Volume  | null = null;
let limiter:    Tone.Limiter | null = null;
let reverbNode: Tone.Reverb  | null = null;
let dryGain:    Tone.Gain    | null = null;
let eq:         Tone.EQ3     | null = null;

export interface AudioChain {
  instrument: Tone.Sampler | Tone.PolySynth;
  eq:         Tone.EQ3;
  reverb:     Tone.Reverb;
  master:     Tone.Volume;
}

/**
 * Build (or return cached) master chain.
 * Tone nodes are expensive — we build once and reuse.
 */
function getMasterChain(): { reverb: Tone.Reverb; dry: Tone.Gain; eq: Tone.EQ3; master: Tone.Volume } {
  if (masterVol && limiter && reverbNode && dryGain && eq) {
    return { reverb: reverbNode, dry: dryGain, eq, master: masterVol };
  }

  // Master volume — safe default −6 dB so headroom exists
  masterVol = new Tone.Volume(-6).toDestination();

  // Hard limiter prevents clipping no matter what the user does
  limiter = new Tone.Limiter(-2).connect(masterVol);

  // Reverb — gentle room (1.8 s decay, 18 % wet by default)
  reverbNode = new Tone.Reverb({ decay: 1.8, preDelay: 0.01, wet: 0.18 });
  reverbNode.connect(limiter);

  // Dry path
  dryGain = new Tone.Gain(0.82).connect(limiter);

  // EQ3 — slight low-mid warmth boost, gentle high cut for softness
  // Values are in dB: low (+2), mid (0), high (−2)
  eq = new Tone.EQ3({ low: 2, mid: 0, high: -2, lowFrequency: 200, highFrequency: 3500 });
  eq.connect(reverbNode);
  eq.connect(dryGain);

  return { reverb: reverbNode, dry: dryGain, eq, master: masterVol };
}

// ── piano sampler ─────────────────────────────────────────────────────────────
export function getPianoSampler(): Tone.Sampler {
  if (!pianoSampler) {
    const { eq: eqNode } = getMasterChain();
    pianoSampler = new Tone.Sampler({
      urls: PIANO_URLS,
      baseUrl: "/samples/piano/",
      // Natural release tail — let the sample ring out
      release: 1.0,
      // Attack curve: very short ramp avoids click on note start
      attack: 0.005,
      onload: () => {
        pianoSamplesLoaded = true;
        loadWaiters.forEach((cb) => cb());
        loadWaiters.clear();
      },
    }).connect(eqNode);
  }
  return pianoSampler;
}

export function isPianoSamplesLoaded(): boolean { return pianoSamplesLoaded; }

export function onPianoSamplesLoaded(cb: () => void) {
  if (pianoSamplesLoaded) { setTimeout(cb, 0); return; }
  loadWaiters.add(cb);
}

// ── instrument factory ────────────────────────────────────────────────────────
export function createInstrument(type: InstrumentType): Tone.Sampler | Tone.PolySynth {
  const { eq: eqNode } = getMasterChain();
  switch (type) {
    case "piano":
      return getPianoSampler();

    case "organ":
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.02, decay: 0.1, sustain: 1.0, release: 0.4 },
        volume: -6,
      }).connect(eqNode);

    default: // synth
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.008, decay: 0.4, sustain: 0.3, release: 1.2 },
        volume: -8,
      }).connect(eqNode);
  }
}

// ── audio settings API ────────────────────────────────────────────────────────

/** Master volume in dB. Clamped to −40..0 for ear safety. */
export function setMasterVolume(db: number) {
  const safe = Math.max(-40, Math.min(0, db));
  getMasterChain().master.volume.rampTo(safe, 0.05);
}

/** Reverb wet amount 0–1. */
export function setReverbAmount(wet: number) {
  const safe = Math.max(0, Math.min(1, wet));
  getMasterChain().reverb.wet.rampTo(safe, 0.1);
}

/**
 * Tone/brightness control −1..+1.
 *  −1 = very warm (high cut −8 dB, low +4 dB)
 *   0 = neutral
 *  +1 = bright  (high +4 dB, low −2 dB)
 */
export function setToneBrightness(v: number) {
  const safe = Math.max(-1, Math.min(1, v));
  const chain = getMasterChain();
  if (safe >= 0) {
    chain.eq.high.value = safe * 4;
    chain.eq.low.value  = 2 - safe * 4;
  } else {
    chain.eq.high.value = safe * 8;
    chain.eq.low.value  = 2 - safe * 4;
  }
}

/**
 * Velocity sensitivity 0–1.
 * Returns a gain multiplier (0.3–1.0) to apply per note.
 * velocity: 0–1 (normalised pointer pressure or fixed value)
 */
export function velocityGain(velocity: number, sensitivity: number): number {
  if (sensitivity <= 0) return 0.85; // flat
  // Map velocity through sensitivity curve
  const curved = Math.pow(Math.max(0, Math.min(1, velocity)), 1 - sensitivity * 0.6);
  // Scale to 0.25–1.0 range so even soft notes are audible
  return 0.25 + curved * 0.75;
}

/** Mute / unmute master output. */
export function setMuted(muted: boolean) {
  getMasterChain().master.mute = muted;
}

/** Expose the master chain for usePiano to wire into. */
export { getMasterChain };
