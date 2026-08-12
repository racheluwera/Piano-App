"use client";
import { useState } from "react";
import { usePiano } from "./hooks/usePiano";
import Keyboard from "./Components/keyboard";
import Controls from "./Components/controls";
import Welcome from "./Components/welcome";
import NoteDisplay from "./Components/noteDisplay";

const NAV_LINKS = ["PLAY", "SONGS", "VIDEOS", "ABOUT", "LEARN"];

export default function Home() {
  const [started, setStarted]   = useState(false);
  const [activeNav, setActiveNav] = useState("PLAY");

  const {
    config, loading,
    playNote, setVolume, setReverb,
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
  } = usePiano();

  const [volumeVal, setVolumeVal] = useState(0);
  const [reverbVal, setReverbVal] = useState(0);

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
            key={link} href="#"
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
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 16px",
      }}>
        {loading ? (
          <div style={{ color: "#333", fontSize: "1.1rem", fontWeight: 700 }}>
            Loading piano...
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "stretch", width: "100%", maxWidth: 1200 }}>

            {/* Left wood cap */}
            <div className="wood-cap" style={{ borderRadius: "8px 0 0 8px" }} />

            {/* Synth body */}
            <div className="synth-body" style={{ flex: 1, overflow: "hidden" }}>

              {/* Full control panel */}
              <Controls
                sustain={sustain}
                instrument={instrument}
                instruments={config?.instruments ?? []}
                displayText={lastNote.replace("#", "♯")}
                showNoteLabels={showNoteLabels}
                showKeyHints={showKeyHints}
                scale={scale}
                transpose={transpose}
                mapping={mapping}
                metronome={metronome}
                tempo={tempo}
                isRecording={isRecording}
                isPlaying={isPlaying}
                isAutoPlay={isAutoPlay}
                gameMode={gameMode}
                songsMode={songsMode}
                onSustainToggle={() => setSustain(!sustain)}
                onInstrumentChange={(i) => setInstrument(i as never)}
                onNotesToggle={() => setShowNoteLabels(!showNoteLabels)}
                onKeysToggle={() => setShowKeyHints(!showKeyHints)}
                onScaleChange={setScale}
                onTransposeChange={setTranspose}
                onMappingChange={setMapping}
                onMetronomeToggle={() => setMetronome(!metronome)}
                onTempoChange={setTempo}
                onRecordToggle={toggleRecording}
                onPlayToggle={togglePlayback}
                onAutoToggle={() => setIsAutoPlay(!isAutoPlay)}
                onGameToggle={() => setGameMode(!gameMode)}
                onSongsToggle={() => setSongsMode(!songsMode)}
              />

              {/* Model badge row */}
              <div className="model-badge">
                <span className="model-name">A-23</span>
                <span className="model-sub">Virtual Piano</span>
                <div style={{ flex: 1 }} />
                <NoteDisplay activeNotes={activeNotes} />
              </div>

              {/* Keyboard */}
              <Keyboard
                octave={octave}
                onPlay={playNote}
                activeNotes={activeNotes}
                showNoteLabels={showNoteLabels}
                showKeyHints={showKeyHints}
              />

            </div>

            {/* Right wood cap */}
            <div className="wood-cap" style={{ borderRadius: "0 8px 8px 0" }} />
          </div>
        )}

        <p style={{
          marginTop: 14, color: "#888", fontSize: "0.7rem",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          Keyboard · Touch · Click — any platform
        </p>
      </main>
    </>
  );
}
