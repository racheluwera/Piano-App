"use client";
import { useRef, useEffect, useCallback, useState } from "react";
import * as Tone from "tone";
import { createInstrument } from "../lib/audio";
import { fetchPianoConfig } from "../lib/fetcher";
import type { PianoConfig } from "../lib/fetcher";
import type { Octave, InstrumentType } from "../lib/constants";

export function usePiano() {
  const [config, setConfig] = useState<PianoConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const [octave, setOctave] = useState<Octave>(4);
  const [instrument, setInstrument] = useState<InstrumentType>("piano");
  const [sustain, setSustain] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  const instrumentRef = useRef<Tone.PolySynth | Tone.Synth | null>(null);
  const volumeRef = useRef<Tone.Volume | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);

  // fetch config from API on mount
  useEffect(() => {
    fetchPianoConfig()
      .then((cfg) => {
        setConfig(cfg);
        setOctave(cfg.defaultOctave as Octave);
        setInstrument(cfg.defaultInstrument as InstrumentType);
        setSustain(cfg.settings.defaultSustain);
      })
      .finally(() => setLoading(false));
  }, []);

  const buildGraph = useCallback(async () => {
    instrumentRef.current?.dispose();
    reverbRef.current?.dispose();
    volumeRef.current?.dispose();

    const vol = new Tone.Volume(0).toDestination();
    const rev = new Tone.Reverb({ decay: 1.5, wet: 0 }).toDestination();
    const inst = createInstrument(instrument);
    inst.connect(vol);
    inst.connect(rev);

    volumeRef.current = vol;
    reverbRef.current = rev;
    instrumentRef.current = inst;
  }, [instrument]);

  useEffect(() => { buildGraph(); }, [buildGraph]);

  const playNote = useCallback(async (note: string) => {
    await Tone.start();
    if (!instrumentRef.current) return;
    instrumentRef.current.triggerAttackRelease(note, sustain ? "2n" : "8n");
    setActiveNotes((prev) => { const s = new Set(prev); s.add(note); return s; });
    setTimeout(() => {
      setActiveNotes((prev) => { const s = new Set(prev); s.delete(note); return s; });
    }, sustain ? 500 : 200);
  }, [sustain]);

  const setVolume = useCallback((db: number) => {
    if (volumeRef.current) volumeRef.current.volume.value = db;
  }, []);

  const setReverb = useCallback((wet: number) => {
    if (reverbRef.current) reverbRef.current.wet.value = wet;
  }, []);

  // keyboard listener — uses keyMap from API config
  useEffect(() => {
    if (!config) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const base = config.keyMap[e.key.toLowerCase()];
      if (base) playNote(`${base}${octave}`);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config, playNote, octave]);

  return {
    config, loading,
    playNote, setVolume, setReverb,
    octave, setOctave,
    sustain, setSustain,
    instrument, setInstrument,
    activeNotes,
  };
}
