"use client";
import { useState } from "react";
import { usePiano } from "./hooks/usePiano";
import Keyboard from "./Components/keyboard";
import Controls from "./Components/controls";
import Welcome from "./Components/welcome";
import NoteDisplay from "./Components/noteDisplay";

const NAV_LINKS = ["PLAY", "SONGS", "VIDEOS", "ABOUT", "LEARN"];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [activeNav, setActiveNav] = useState("PLAY");

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

  // LED display shows last active note or "PLAY"
  const lastNote = Array.from(activeNotes).at(-1) ?? "PLAY";

  return (
    <>
      {!started && <Welcome onStart={() => setStarted(true)} />}

      {/* ── Top navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="navbar-logo-box">🎹</div>
          <div style={{ lineHeight: 1.1 }}>
            <div>RECURSIVE</div>
            <div>ARTS</div>
          </div>
        </div>

        <span className="navbar-title">Virtual Piano</span>

        <span className="navbar-auth">
          <a href="#">Log In</a> or <a href="#">Register</a>
        </span>
      </nav>

      {/* ── Nav links ── */}
      <div className="navlinks">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className={activeNav === link ? "active" : ""}
            onClick={(e) => { e.preventDefault(); setActiveNav(link); }}
          >
            {link}
          </a>
        ))}
      </div>

      {/* ── Page body ── */}
      <main style={{
        background: "#b0b8c1",
        minHeight: "calc(100dvh - 96px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}>

        {loading ? (
          <div style={{ color: "#333", fontSize: "1.2rem", fontWeight: 700 }}>
            Loading piano...
          </div>
        ) : (
          /* ── Synth body with wood end caps ── */
          <div style={{ display: "flex", alignItems: "stretch", width: "100%", maxWidth: 1100 }}>

            {/* Left wood cap */}
            <div className="wood-cap" style={{ borderRadius: "8px 0 0 8px" }} />

            {/* Main synth body */}
            <div className="synth-body" style={{ flex: 1 }}>

              {/* Control panel */}
              <Controls
                volume={volumeVal}
                reverb={reverbVal}
                octave={octave}
                sustain={sustain}
                instrument={instrument}
                octaves={(config?.octaves ?? [2,3,4,5,6]) as number[]}
                instruments={config?.instruments ?? []}
                displayText={lastNote.replace("#", "♯")}
                onVolumeChange={(v) => { setVolumeVal(v); setVolume(v); }}
                onReverbChange={(v) => { setReverbVal(v); setReverb(v); }}
                onOctaveChange={(o) => setOctave(o as never)}
                onSustainToggle={() => setSustain(!sustain)}
                onInstrumentChange={(i) => setInstrument(i as never)}
              />

              {/* Model badge */}
              <div className="model-badge">
                <span className="model-name">A-23</span>
                <span className="model-sub">Virtual Piano</span>
                <div style={{ flex: 1 }} />
                <NoteDisplay activeNotes={activeNotes} />
              </div>

              {/* Keyboard */}
              <Keyboard octave={octave} onPlay={playNote} activeNotes={activeNotes} />

            </div>

            {/* Right wood cap */}
            <div className="wood-cap" style={{ borderRadius: "0 8px 8px 0" }} />
          </div>
        )}

        <p style={{
          marginTop: 16, color: "#888", fontSize: "0.72rem",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          Keyboard · Touch · Click — any platform
        </p>
      </main>
    </>
  );
}
