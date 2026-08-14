"use client";
import { useRef, useEffect, useCallback, useState } from "react";
import * as Tone from "tone";
import {
  createInstrument, onPianoSamplesLoaded,
  setMasterVolume, setReverbAmount, setToneBrightness, setMuted, velocityGain,
} from "../lib/audio";
import { fetchPianoConfig } from "../lib/fetcher";
import type { PianoConfig } from "../lib/fetcher";
import type { Octave, InstrumentType } from "../lib/constants";

export type ScaleType   = "chromatic" | "major" | "minor" | "pentatonic";
export type MappingType = "max" | "real";

export function usePiano() {
  const [config, setConfig]               = useState<PianoConfig | null>(null);
  const [loading, setLoading]             = useState(true);
  const [samplesLoaded, setSamplesLoaded] = useState(false);

  // ── core ──────────────────────────────────────────────────────────────────
  const [octave, setOctave]           = useState<Octave>(4);
  const [instrument, setInstrument]   = useState<InstrumentType>("piano");
  const [sustain, setSustain]         = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  // ── display / keyboard settings ───────────────────────────────────────────
  const [showNoteLabels, setShowNoteLabels] = useState(true);
  const [showKeyHints,   setShowKeyHints]   = useState(true);
  const [scale,          setScale]          = useState<ScaleType>("chromatic");
  const [transpose,      setTranspose]      = useState(0);
  const [mapping,        setMapping]        = useState<MappingType>("max");
  const [metronome,      setMetronome]      = useState(false);
  const [tempo,          setTempo]          = useState(120);
  const [isRecording,    setIsRecording]    = useState(false);
  const [isAutoPlay,     setIsAutoPlay]     = useState(false);
  const [gameMode,       setGameMode]       = useState(false);
  const [songsMode,      setSongsMode]      = useState(false);
  const [recorded,       setRecorded]       = useState<{ note: string; time: number }[]>([]);
  const [isPlaying,      setIsPlaying]      = useState(false);

  // ── audio quality settings ────────────────────────────────────────────────
  const [volume,      setVolumeState]   = useState(-6);   // dB  −40..0
  const [reverbAmt,   setReverbAmt]     = useState(0.18); // 0..1
  const [tone,        setToneState]     = useState(0);    // −1..+1
  const [velocitySens,setVelocitySens]  = useState(0.6);  // 0..1
  const [muted,       setMutedState]    = useState(false);

  // ── refs ──────────────────────────────────────────────────────────────────
  const instrumentRef = useRef<Tone.Sampler | Tone.PolySynth | null>(null);
  const metroRef      = useRef<Tone.Loop | null>(null);
  const metroSynthRef = useRef<Tone.Synth | null>(null);
  const recordStart   = useRef<number>(0);
  const playbackRef   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hydratedRef   = useRef(false);
  const saveTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── fetch config ──────────────────────────────────────────────────────────
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

  // ── hydrate settings from backend ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled || !res?.success || !res.data) return;
        const s = res.data as Record<string, unknown>;
        if (typeof s.octave       === "number")  setOctave(s.octave as Octave);
        if (typeof s.instrument   === "string")  setInstrument(s.instrument as InstrumentType);
        if (typeof s.sustain      === "boolean") setSustain(s.sustain);
        if (typeof s.showNoteLabels === "boolean") setShowNoteLabels(s.showNoteLabels);
        if (typeof s.showKeyHints === "boolean") setShowKeyHints(s.showKeyHints);
        if (typeof s.scale        === "string")  setScale(s.scale as ScaleType);
        if (typeof s.transpose    === "number")  setTranspose(s.transpose);
        if (typeof s.mapping      === "string")  setMapping(s.mapping as MappingType);
        if (typeof s.metronome    === "boolean") setMetronome(s.metronome);
        if (typeof s.tempo        === "number")  setTempo(s.tempo);
        // audio settings
        if (typeof s.volume       === "number")  setVolumeState(s.volume);
        if (typeof s.reverbAmt    === "number")  setReverbAmt(s.reverbAmt);
        if (typeof s.tone         === "number")  setToneState(s.tone);
        if (typeof s.velocitySens === "number")  setVelocitySens(s.velocitySens);
        if (typeof s.muted        === "boolean") setMutedState(s.muted);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) hydratedRef.current = true; });
    return () => { cancelled = true; };
  }, []);

  // ── persist settings (debounced 600 ms) ───────────────────────────────────
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          octave, instrument, sustain,
          showNoteLabels, showKeyHints,
          scale, transpose, mapping,
          metronome, tempo,
          volume, reverbAmt, tone, velocitySens, muted,
        }),
      }).catch(() => {});
    }, 600);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [
    octave, instrument, sustain, showNoteLabels, showKeyHints,
    scale, transpose, mapping, metronome, tempo,
    volume, reverbAmt, tone, velocitySens, muted,
  ]);

  // ── build instrument + track loading state ───────────────────────────────
  useEffect(() => {
    const inst = createInstrument(instrument);
    if (instrumentRef.current && instrumentRef.current !== inst) {
      try { instrumentRef.current.dispose(); } catch { /* already disposed */ }
    }
    instrumentRef.current = inst;
    if (inst instanceof Tone.Sampler) {
      if (inst.loaded) {
        // Already loaded (e.g. cached sampler) — schedule outside effect body
        const t = setTimeout(() => setSamplesLoaded(true), 0);
        return () => clearTimeout(t);
      }
      onPianoSamplesLoaded(() => setSamplesLoaded(true));
    } else {
      const t = setTimeout(() => setSamplesLoaded(true), 0);
      return () => clearTimeout(t);
    }
  }, [instrument]);

  // ── audio settings → audio engine ─────────────────────────────────────────
  useEffect(() => { setMasterVolume(volume); },      [volume]);
  useEffect(() => { setReverbAmount(reverbAmt); },   [reverbAmt]);
  useEffect(() => { setToneBrightness(tone); },      [tone]);
  useEffect(() => { setMuted(muted); },              [muted]);

  // ── setters that also update the audio engine ─────────────────────────────
  const setVolume = useCallback((db: number) => {
    const safe = Math.max(-40, Math.min(0, db));
    setVolumeState(safe);
  }, []);

  const setReverb = useCallback((wet: number) => {
    setReverbAmt(Math.max(0, Math.min(1, wet)));
  }, []);

  const setTone = useCallback((v: number) => {
    setToneState(Math.max(-1, Math.min(1, v)));
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState((m) => !m);
  }, []);

  // ── metronome ─────────────────────────────────────────────────────────────
  useEffect(() => {
    metroRef.current?.dispose();
    metroSynthRef.current?.dispose();
    if (!metronome) return;
    Tone.getTransport().bpm.value = tempo;
    const click = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
      volume: -10,
    }).toDestination();
    metroSynthRef.current = click;
    let beat = 0;
    const loop = new Tone.Loop((time) => {
      click.triggerAttackRelease(beat % 4 === 0 ? "C5" : "G4", "32n", time);
      beat++;
    }, "4n");
    loop.start(0);
    Tone.getTransport().start();
    metroRef.current = loop;
    return () => {
      loop.dispose();
      click.dispose();
      Tone.getTransport().stop();
    };
  }, [metronome, tempo]);

  // ── transpose helper ──────────────────────────────────────────────────────
  const transposeNote = useCallback((note: string): string => {
    if (transpose === 0) return note;
    const midi = Tone.Frequency(note).toMidi();
    return Tone.Frequency(midi + transpose, "midi").toNote() as string;
  }, [transpose]);

  // ── noteOn / noteOff ──────────────────────────────────────────────────────
  /**
   * velocity: 0–1 (pointer pressure or default 0.75 for keyboard/click)
   */
  const toneStarted = useRef(false);

  const noteOn = useCallback(async (note: string, velocity = 0.75) => {
    if (!toneStarted.current) {
      await Tone.start();
      toneStarted.current = true;
    }
    const inst = instrumentRef.current;
    if (!inst) return;
    // Guard: Sampler buffers may not be loaded yet — skip silently instead of throwing
    if (inst instanceof Tone.Sampler && !inst.loaded) return;
    const final = transposeNote(note);
    const gain  = velocityGain(velocity, velocitySens);
    try {
      inst.triggerAttack(final, Tone.now(), gain);
    } catch {
      // Ignore stale buffer errors (e.g. note outside sampler range)
      return;
    }
    setActiveNotes((prev) => { const s = new Set(prev); s.add(note); return s; });
    if (isRecording) {
      setRecorded((prev) => [...prev, { note, time: Date.now() - recordStart.current }]);
    }
  }, [transposeNote, velocitySens, isRecording]);

  const noteOff = useCallback((note: string) => {
    const inst = instrumentRef.current;
    if (!inst) return;
    if (inst instanceof Tone.Sampler && !inst.loaded) return;
    const final = transposeNote(note);
    try {
      inst.triggerRelease(final, Tone.now() + 0.01);
    } catch { /* ignore */ }
    setActiveNotes((prev) => { const s = new Set(prev); s.delete(note); return s; });
  }, [transposeNote]);

  // playNote: used for playback / keyboard (fixed velocity)
  const playNote = useCallback(async (note: string) => {
    await noteOn(note, 0.75);
    setTimeout(() => noteOff(note), sustain ? 900 : 250);
  }, [noteOn, noteOff, sustain]);

  // ── recording ─────────────────────────────────────────────────────────────
  const toggleRecording = useCallback(() => {
    if (!isRecording) {
      setRecorded([]);
      recordStart.current = Date.now();
    }
    setIsRecording((v) => !v);
  }, [isRecording]);

  // ── playback ──────────────────────────────────────────────────────────────
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      playbackRef.current.forEach(clearTimeout);
      setIsPlaying(false);
      return;
    }
    if (!recorded.length) return;
    setIsPlaying(true);
    const timers = recorded.map(({ note, time }) =>
      setTimeout(() => playNote(note), time)
    );
    playbackRef.current = timers;
    const last = recorded.at(-1)!;
    setTimeout(() => setIsPlaying(false), last.time + 600);
  }, [isPlaying, recorded, playNote]);

  // ── keyboard listener ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!config) return;
    const held = new Set<string>();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const base = config.keyMap[e.key.toLowerCase()];
      if (!base) return;
      const note = `${base}${octave}`;
      if (held.has(note)) return;
      held.add(note);
      noteOn(note, 0.75);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const base = config.keyMap[e.key.toLowerCase()];
      if (!base) return;
      const note = `${base}${octave}`;
      held.delete(note);
      noteOff(note);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup",   handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup",   handleKeyUp);
    };
  }, [config, noteOn, noteOff, octave]);

  return {
    config, loading, samplesLoaded,
    playNote, noteOn, noteOff,
    octave, setOctave,
    sustain, setSustain,
    instrument, setInstrument,
    activeNotes,
    showNoteLabels, setShowNoteLabels,
    showKeyHints,   setShowKeyHints,
    scale,          setScale,
    transpose,      setTranspose,
    mapping,        setMapping,
    metronome,      setMetronome,
    tempo,          setTempo,
    isRecording,    toggleRecording,
    isAutoPlay,     setIsAutoPlay,
    gameMode,       setGameMode,
    songsMode,      setSongsMode,
    isPlaying,      togglePlayback,
    recorded,
    // audio quality
    volume,      setVolume,
    reverbAmt,   setReverb,
    tone,        setTone,
    velocitySens, setVelocitySens,
    muted,       toggleMute,
  };
}
