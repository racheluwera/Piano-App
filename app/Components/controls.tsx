"use client";
import type { ScaleType, MappingType } from "../hooks/usePiano";

type Instrument = { id: string; icon: string; label: string };

type Props = {
  sustain: boolean;
  instrument: string;
  instruments: Instrument[];
  displayText: string;
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
  // audio quality
  volume: number;
  reverbAmt: number;
  tone: number;
  velocitySens: number;
  muted: boolean;
  onSustainToggle: () => void;
  onInstrumentChange: (i: string) => void;
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
  onVolumeChange: (v: number) => void;
  onReverbChange: (v: number) => void;
  onToneChange: (v: number) => void;
  onVelocityChange: (v: number) => void;
  onMuteToggle: () => void;
};

/* ── LED-style toggle button ── */
function Btn({
  label, active, color = "red", onClick,
}: {
  label: string;
  active?: boolean;
  color?: "red" | "blue" | "amber";
  onClick?: () => void;
}) {
  const led = {
    red:   { on: "#ff3300", off: "#2a0800", glow: "rgba(255,51,0,0.8)" },
    blue:  { on: "#3399ff", off: "#001833", glow: "rgba(51,153,255,0.8)" },
    amber: { on: "#ffaa00", off: "#1a0e00", glow: "rgba(255,170,0,0.8)" },
  }[color];

  return (
    <button onClick={onClick} className="ctrl-btn" data-active={active ? "true" : undefined}>
      <span className="ctrl-led" style={{
        background: active ? led.on : led.off,
        boxShadow: active ? `0 0 6px ${led.glow}` : "none",
      }} />
      <span className="ctrl-btn-label">{label}</span>
    </button>
  );
}

/* ── Compact number stepper ── */
function Stepper({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="ctrl-stepper">
      <span className="ctrl-stepper-label">{label}</span>
      <div className="ctrl-stepper-row">
        <button onClick={() => onChange(Math.max(min, value - step))}>−</button>
        <span>{value > 0 && label === "TRANSPOSE" ? `+${value}` : value}</span>
        <button onClick={() => onChange(Math.min(max, value + step))}>+</button>
      </div>
    </div>
  );
}

/* ── Audio slider ── */
function AudioSlider({ label, value, min, max, step, format, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="audio-slider">
      <div className="audio-slider-header">
        <span className="audio-slider-label">{label}</span>
        <span className="audio-slider-value">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="audio-slider-input"
      />
    </div>
  );
}

/* ── LED display ── */
function Display({ text }: { text: string }) {
  return (
    <div className="ctrl-display">
      <span className="ctrl-display-text">{text || "PLAY"}</span>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ctrl-section">
      <span className="ctrl-section-label">{label}</span>
      <div className="ctrl-section-body">{children}</div>
    </div>
  );
}

const SCALES: ScaleType[] = ["chromatic", "major", "minor", "pentatonic"];
const SCALE_SHORT: Record<ScaleType, string> = {
  chromatic: "CHR", major: "MAJ", minor: "MIN", pentatonic: "PEN",
};

export default function Controls({
  sustain, instrument, instruments, displayText,
  showNoteLabels, showKeyHints, scale, transpose, mapping,
  metronome, tempo, isRecording, isPlaying, isAutoPlay, gameMode, songsMode,
  volume, reverbAmt, tone, velocitySens, muted,
  onSustainToggle, onInstrumentChange,
  onNotesToggle, onKeysToggle, onScaleChange, onTransposeChange, onMappingChange,
  onMetronomeToggle, onTempoChange, onRecordToggle, onPlayToggle,
  onAutoToggle, onGameToggle, onSongsToggle,
  onVolumeChange, onReverbChange, onToneChange, onVelocityChange, onMuteToggle,
}: Props) {
  return (
    <div className="ctrl-panel">

      {/* ── ROW 1: primary controls ── */}
      <div className="ctrl-row">
        <Section label="SOUND">
          {instruments.map((t) => (
            <Btn key={t.id} label={t.label.slice(0, 3).toUpperCase()}
              active={instrument === t.id} color="amber"
              onClick={() => onInstrumentChange(t.id)} />
          ))}
        </Section>
        <div className="ctrl-divider" />
        <Section label="SCALE">
          {SCALES.map((s) => (
            <Btn key={s} label={SCALE_SHORT[s]} active={scale === s} onClick={() => onScaleChange(s)} />
          ))}
        </Section>
        <div className="ctrl-divider" />
        <Section label="VIEW">
          <Btn label="NOTES" active={showNoteLabels} color="blue" onClick={onNotesToggle} />
          <Btn label="KEYS"  active={showKeyHints}   color="blue" onClick={onKeysToggle} />
        </Section>
        <div className="ctrl-divider" />
        <Section label="SUSTAIN">
          <Btn label={sustain ? "ON" : "OFF"} active={sustain} color="blue" onClick={onSustainToggle} />
        </Section>
        <div className="ctrl-divider" />
        <Display text={displayText} />
        <div className="ctrl-divider" />
        <Section label="MAPPING">
          <Btn label="MAX"  active={mapping === "max"}  onClick={() => onMappingChange("max")} />
          <Btn label="REAL" active={mapping === "real"} onClick={() => onMappingChange("real")} />
        </Section>
        <div className="ctrl-divider" />
        <Section label="MODE">
          <Btn label="AUTO"  active={isAutoPlay} onClick={onAutoToggle} />
          <Btn label="SONGS" active={songsMode}  onClick={onSongsToggle} />
          <Btn label="GAME"  active={gameMode}   onClick={onGameToggle} />
        </Section>
        <div className="ctrl-divider" />
        <Section label="RECORD">
          <Btn label="REC"  active={isRecording} color="red"  onClick={onRecordToggle} />
          <Btn label="PLAY" active={isPlaying}   color="blue" onClick={onPlayToggle} />
        </Section>
      </div>

      {/* ── ROW 2: tempo / transpose ── */}
      <div className="ctrl-row ctrl-row-secondary">
        <Stepper label="TRANSPOSE" value={transpose} min={-12} max={12} onChange={onTransposeChange} />
        <div className="ctrl-divider" />
        <Stepper label="TEMPO" value={tempo} min={40} max={240} step={5} onChange={onTempoChange} />
        <div className="ctrl-divider" />
        <Section label="METRONOME">
          <Btn label={metronome ? "ON" : "OFF"} active={metronome} color="amber" onClick={onMetronomeToggle} />
        </Section>
      </div>

      {/* ── ROW 3: audio quality settings ── */}
      <div className="ctrl-row ctrl-row-audio">
        <span className="audio-row-title">🎚 AUDIO</span>

        <AudioSlider
          label="VOLUME"
          value={volume} min={-40} max={0} step={1}
          format={(v) => `${v} dB`}
          onChange={onVolumeChange}
        />
        <AudioSlider
          label="REVERB"
          value={Math.round(reverbAmt * 100)} min={0} max={100} step={1}
          format={(v) => `${v}%`}
          onChange={(v) => onReverbChange(v / 100)}
        />
        <AudioSlider
          label="TONE"
          value={Math.round(tone * 10)} min={-10} max={10} step={1}
          format={(v) => v > 0 ? `+${v}` : `${v}`}
          onChange={(v) => onToneChange(v / 10)}
        />
        <AudioSlider
          label="VELOCITY"
          value={Math.round(velocitySens * 100)} min={0} max={100} step={5}
          format={(v) => `${v}%`}
          onChange={(v) => onVelocityChange(v / 100)}
        />

        <div className="ctrl-divider" />
        <Section label="MUTE">
          <Btn label={muted ? "🔇" : "🔊"} active={muted} color="red" onClick={onMuteToggle} />
        </Section>
      </div>

    </div>
  );
}
