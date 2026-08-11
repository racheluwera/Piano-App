"use client";
import { useState } from "react";
import { usePiano } from "./hooks/usePiano";
import Keyboard from "./Components/keyboard";
import Controls from "./Components/controls";
import Welcome from "./Components/welcome";
import NoteDisplay from "./Components/noteDisplay";

export default function Home() {
  const [started, setStarted] = useState(false);

  const {
    config, loading,
    playNote, setVolume, setReverb,
    octave, setOctave,
    sustain, setSustain,
    instrument, setInstrument,
    activeNotes,
  } = usePiano();

  const [volumeVal, setVolumeVal] = useState(0);
  const [reverbVal, setReverbVal] = useState(0);

  return (
    <>
      {!started && <Welcome onStart={() => setStarted(true)} />}

      <main style={{
        minHeight: "100dvh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px 16px", gap: 16,
        background: "radial-gradient(ellipse at 50% 0%, #3d2b10 0%, #1a1008 60%)",
      }}>

        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800,
            color: "#c8a96e", letterSpacing: "-0.02em", margin: 0,
          }}>
            🎹 My Piano
          </h1>
          <p style={{ color: "#5a4a2a", fontSize: "0.78rem", margin: "4px 0 0" }}>
            {loading ? "Loading piano..." : `${instrument} · octave ${octave}${sustain ? " · sustain on" : ""}`}
          </p>
        </div>

        {loading ? (
          <div style={{ color: "#c8a96e", fontSize: "2rem", animation: "spin 1s linear infinite" }}>
            🎵
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <Controls
              volume={volumeVal}
              reverb={reverbVal}
              octave={octave}
              sustain={sustain}
              instrument={instrument}
              octaves={(config?.octaves ?? [2,3,4,5,6]) as number[]}
              instruments={config?.instruments ?? []}
              onVolumeChange={(v) => { setVolumeVal(v); setVolume(v); }}
              onReverbChange={(v) => { setReverbVal(v); setReverb(v); }}
              onOctaveChange={(o) => setOctave(o as never)}
              onSustainToggle={() => setSustain(!sustain)}
              onInstrumentChange={(i) => setInstrument(i as never)}
            />

            <div className="piano-cabinet" style={{ width: "100%", maxWidth: 520 }}>
              <NoteDisplay activeNotes={activeNotes} />
              <Keyboard octave={octave} onPlay={playNote} activeNotes={activeNotes} />
            </div>
          </>
        )}

        <p style={{
          color: "#3a2c18", fontSize: "0.72rem",
          letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Keyboard · Touch · Click — any platform
        </p>
      </main>
    </>
  );
}
