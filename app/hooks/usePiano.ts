"use client";
import { useRef, useEffect, useCallback, useState } from "react";
import * as Tone from "tone";
import { createInstrument } from "../lib/audio";
import { fetchPianoConfig } from "../lib/fetcher";
import type { PianoConfig } from "../lib/fetcher";
import type { Octave, InstrumentType } from "../lib/constants";

export type ScaleType = "chromatic" | "major" | "minor" | "pentatonic";
export type MappingType = "max" | "real";

const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  chromatic:  [0,1,2,3,4,5,6,7,8,9,10,11],
  major:      [0,2,4,5,7,9,11],
  minor:      [0,2,3,5,7,8,10],
  pentatonic: [0,2,4,7,9],
};

export function usePiano() {
  const [config, setConfig]       = useState<PianoConfig | null>(null);
  const [loading, setLoading]     = useState(true);

  // core
  const [octave, setOctave]           = useState<Octave>(4);
  const [instrument, setInstrument]   = useState<InstrumentType>("piano");
  const [sustain, setSustain]         = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  // new settings
  const [showNoteLabels, setShowNoteLabels] = useState(true);
  const [showKeyHints, setShowKeyHints]     = useState(true);
  const [scale, setScale]                   = useState<ScaleType>("chromatic");
  const [transpose, setTranspose]           = useState(0);       // semitones -12..+12
  const [mapping, setMapping]               = useState<MappingType>("max");
  const [metronome, setMetronome]           = useState(false);
  const [tempo, setTempo]                   = useState(120);
  const [isRecording, setIsRecording]       = useState(false);
  const [isAutoPlay, setIsAutoPlay]         = useState(false);
  const [gameMode, setGameMode]             = useState(false);
  const [songsMode, setSongsMode]           = useState(false);
  const [recorded, setRecorded]             = useState<{note:string; time:number}[]>([]);
  const [isPlaying, setIsPlaying]           = useState(false);

  const instrumentRef = useRef<Tone.PolySynth | Tone.Synth | null>(null);
  const volumeRef     = useRef<Tone.Volume | null>(null);
  const reverbRef     = useRef<Tone.Reverb | null>(null);
  const metroRef      = useRef<Tone.Loop | null>(null);
  const metroSynthRef = useRef<Tone.Synth | null>(null);
  const recordStart   = useRef<number>(0);
  const playbackRef   = useRef<ReturnType<typeof setTimeout>[]>([]);

  // fetch config
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

  // build audio graph
  const buildGraph = useCallback(async () => {
    instrumentRef.current?.dispose();
    reverbRef.current?.dispose();
    volumeRef.current?.dispose();
    const vol  = new Tone.Volume(0).toDestination();
    const rev  = new Tone.Reverb({ decay: 1.5, wet: 0 }).toDestination();
    const inst = createInstrument(instrument);
    inst.connect(vol);
    inst.connect(rev);
    volumeRef.current  = vol;
    reverbRef.current  = rev;
    instrumentRef.current = inst;
  }, [instrument]);

  useEffect(() => { buildGraph(); }, [buildGraph]);

  // metronome
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

  // transpose a note by semitones
  const transposeNote = useCallback((note: string): string => {
    if (transpose === 0) return note;
    const midi = Tone.Frequency(note).toMidi();
    return Tone.Frequency(midi + transpose, "midi").toNote() as string;
  }, [transpose]);

  const playNote = useCallback(async (note: string) => {
    await Tone.start();
    if (!instrumentRef.current) return;
    const final = transposeNote(note);
    instrumentRef.current.triggerAttackRelease(final, sustain ? "2n" : "8n");
    setActiveNotes((prev) => { const s = new Set(prev); s.add(note); return s; });
    setTimeout(() => {
      setActiveNotes((prev) => { const s = new Set(prev); s.delete(note); return s; });
    }, sustain ? 500 : 200);
    // record
    if (isRecording) {
      setRecorded((prev) => [...prev, { note, time: Date.now() - recordStart.current }]);
    }
  }, [sustain, transposeNote, isRecording]);

  const setVolume = useCallback((db: number) => {
    if (volumeRef.current) volumeRef.current.volume.value = db;
  }, []);

  const setReverb = useCallback((wet: number) => {
    if (reverbRef.current) reverbRef.current.wet.value = wet;
  }, []);

  // start / stop recording
  const toggleRecording = useCallback(() => {
    if (!isRecording) {
      setRecorded([]);
      recordStart.current = Date.now();
    }
    setIsRecording((v) => !v);
  }, [isRecording]);

  // playback recorded notes
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

  // keyboard listener
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
    // new
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
  };
}
