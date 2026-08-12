"use client";
import type { ScaleType, MappingType } from "../hooks/usePiano";

type Instrument = { id: string; icon: string; label: string };

type Props = {
  // existing
  sustain: boolean;
  instrument: string;
  instruments: Instrument[];
  displayText: string;
  onSustainToggle: () => void;
  onInstrumentChange: (i: string) => void;
  // new
  showNoteLabels: boolean;
  showKeyHints: boolean;
  scale: ScaleType;
  transpose: number;
  mapping: MappingType;
  metronome: boolean;
  tempo: number;
  isRecording: boolean;
  isPlaying: boolean;
  isAutoPlay: boolean;
  gameMode: boolean;
  songsMode: boolean;
  onNotesToggle: () => void;
  onKeysToggle: () => void;
  onScaleChange: (s: ScaleType) => void;
  onTransposeChange: (v: number) => void;
  onMappingChange: (m: MappingType) => void;
  onMetronomeToggle: () => void;
  onTempoChange: (v: number) => void;
  onRecordToggle: () => void;
  onPlayToggle: () => void;
  onAutoToggle: () => void;
  onGameToggle: () => void;
  onSongsToggle: () => void;
};

/* ── Reusable square synth button with LED dot ── */
function SynthBtn({
  label, active, ledColor = "red", onClick,
}: {
  label?: string;
  active?: boolean;
  ledColor?: "red" | "blue" | "green";
  onClick?: () => void;
}) {
  const ledColors = {
    red:   active ? "#ff2200" : "#330000",
    blue:  active ? "#4488ff" : "#001133",
    green: active ? "#00cc44" : "#003311",
  };
  const glowColors = {
    red:   "rgba(255,34,0,0.7)",
    blue:  "rgba(68,136,255,0.7)",
    green: "rgba(0,204,68,0.7)",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      {label && (
        <span style={{
          fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
          color: "#888", textTransform: "uppercase",
        }}>
          {label}
        </span>
      )}
      <button
        onClick={onClick}
        style={{
          width: 36, height: 36,
          background: "linear-gradient(180deg,#2e2e2e 0%,#1a1a1a 100%)",
          border: "1px solid #444",
          borderRadius: 4,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
          transition: "all 80ms",
          position: "relative",
        }}
      >
        <span style={{
          width: 9, height: 9, borderRadius: "50%",
          background: ledColors[ledColor],
          boxShadow: active ? `0 0 7px ${glowColors[ledColor]}` : "none",
          transition: "all 150ms",
          display: "block",
        }} />
      </button>
    </div>
  );
}

/* ── Diamond-shaped knob (TRANSPOSE / TEMPO) ── */
function DiamondKnob({
  label, subLabels, value, min, max, onChange,
}: {
  label: string;
  subLabels?: [string, string];
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <span style={{ fontSize: 8, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </span>
      {/* diamond shape */}
      <div style={{ position: "relative", width: 44, height: 44 }}>
        <div style={{
          position: "absolute", inset: 4,
          background: "linear-gradient(135deg,#3a3a3a,#1a1a1a)",
          border: "1px solid #555",
          transform: "rotate(45deg)",
          borderRadius: 3,
          boxShadow: "0 3px 8px rgba(0,0,0,0.7)",
        }} />
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute", inset: 0, opacity: 0,
            width: "100%", height: "100%", cursor: "pointer", zIndex: 2,
          }}
        />
        <span style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700, color: "#ccc", zIndex: 1,
          pointerEvents: "none",
        }}>
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      {subLabels && (
        <div style={{ display: "flex", gap: 8 }}>
          {subLabels.map((s) => (
            <span key={s} style={{ fontSize: 7, color: "#666", letterSpacing: "0.06em" }}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Vertical divider ── */
function Divider() {
  return (
    <div style={{
      width: 1, alignSelf: "stretch",
      background: "linear-gradient(180deg,transparent,#444,transparent)",
      margin: "0 6px", flexShrink: 0,
    }} />
  );
}

/* ── Group with top label ── */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{
        fontSize: 8, fontWeight: 700, color: "#777",
        letterSpacing: "0.1em", textTransform: "uppercase",
      }}>
        {label}
      </span>
      <div style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>{children}</div>
    </div>
  );
}

const SCALES: ScaleType[] = ["chromatic", "major", "minor", "pentatonic"];

export default function Controls({
  sustain, instrument, instruments, displayText,
  showNoteLabels, showKeyHints, scale, transpose, mapping,
  metronome, tempo, isRecording, isPlaying, isAutoPlay, gameMode, songsMode,
  onSustainToggle, onInstrumentChange,
  onNotesToggle, onKeysToggle, onScaleChange, onTransposeChange, onMappingChange,
  onMetronomeToggle, onTempoChange, onRecordToggle, onPlayToggle,
  onAutoToggle, onGameToggle, onSongsToggle,
}: Props) {
  return (
    <div style={{
      display: "flex", alignItems: "center", flexWrap: "wrap",
      gap: 6, padding: "14px 18px 12px",
      background: "linear-gradient(180deg,#252525 0%,#1c1c1c 100%)",
      borderBottom: "1px solid #111",
    }}>

      {/* ── SCALES ── */}
      <Group label="SCALES">
        {SCALES.map((s) => (
          <SynthBtn key={s} label={s.slice(0,3).toUpperCase()} active={scale === s} onClick={() => onScaleChange(s)} />
        ))}
      </Group>

      <Divider />

      {/* ── NOTES ── */}
      <Group label="NOTES">
        <SynthBtn active={showNoteLabels} onClick={onNotesToggle} />
      </Group>

      <Divider />

      {/* ── KEYS ── */}
      <Group label="KEYS">
        <SynthBtn active={showKeyHints} onClick={onKeysToggle} />
      </Group>

      {/* ── MAPPING ── */}
      <Group label="MAPPING">
        <SynthBtn label="MAX"  active={mapping === "max"}  onClick={() => onMappingChange("max")} />
        <SynthBtn label="REAL" active={mapping === "real"} onClick={() => onMappingChange("real")} />
      </Group>

      {/* ── TRANSPOSE knob ── */}
      <DiamondKnob
        label="TRANSPOSE"
        subLabels={["MAX", "REAL"]}
        value={transpose}
        min={-12} max={12}
        onChange={onTransposeChange}
      />

      <Divider />

      {/* ── SUSTAIN ── */}
      <Group label="SUSTAIN">
        <SynthBtn active={sustain} ledColor="blue" onClick={onSustainToggle} />
      </Group>

      <Divider />

      {/* ── SOUNDS ── */}
      <Group label="SOUNDS">
        {instruments.map((t) => (
          <SynthBtn
            key={t.id}
            label={t.label.slice(0,3).toUpperCase()}
            active={instrument === t.id}
            onClick={() => onInstrumentChange(t.id)}
          />
        ))}
      </Group>

      <Divider />

      {/* ── LED DISPLAY ── */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 140 }}>
        <div style={{
          background: "linear-gradient(180deg,#0a1a0a,#0d200d)",
          border: "2px solid #0a0a0a",
          borderRadius: 4, padding: "8px 18px",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9), 0 0 0 1px #333, 0 0 20px rgba(0,60,0,0.3)",
        }}>
          <div style={{
            fontFamily: "Courier New, monospace",
            fontSize: "1.5rem", fontWeight: 700,
            letterSpacing: "0.2em", color: "#90c890",
            textShadow: "0 0 8px #00ff00, 0 0 20px rgba(0,200,0,0.3)",
            minWidth: 100, textAlign: "center",
          }}>
            {displayText || "PLAY"}
          </div>
        </div>
      </div>

      <Divider />

      {/* ── AUTO ── */}
      <Group label="AUTO">
        <SynthBtn active={isAutoPlay} ledColor="red" onClick={onAutoToggle} />
      </Group>

      {/* ── SONGS ── */}
      <Group label="SONGS">
        <SynthBtn active={songsMode} ledColor="red" onClick={onSongsToggle} />
      </Group>

      {/* ── GAME ── */}
      <Group label="GAME">
        <SynthBtn active={gameMode} ledColor="red" onClick={onGameToggle} />
      </Group>

      <Divider />

      {/* ── TEMPO knob ── */}
      <DiamondKnob
        label="TEMPO"
        value={tempo}
        min={40} max={240}
        onChange={onTempoChange}
      />

      <Divider />

      {/* ── METRO ── */}
      <Group label="METRO">
        <SynthBtn active={metronome} ledColor="red" onClick={onMetronomeToggle} />
      </Group>

      <Divider />

      {/* ── REC — PLAY ── */}
      <Group label="REC — PLAY">
        <SynthBtn label="REC"  active={isRecording} ledColor="red"  onClick={onRecordToggle} />
        <SynthBtn label="PLAY" active={isPlaying}   ledColor="blue" onClick={onPlayToggle} />
      </Group>

    </div>
  );
}
