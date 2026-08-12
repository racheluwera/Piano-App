"use client";

type Instrument = { id: string; icon: string; label: string };

type Props = {
  volume: number;
  reverb: number;
  octave: number;
  sustain: boolean;
  instrument: string;
  octaves: number[];
  instruments: Instrument[];
  displayText: string;
  onVolumeChange: (v: number) => void;
  onReverbChange: (v: number) => void;
  onOctaveChange: (o: number) => void;
  onSustainToggle: () => void;
  onInstrumentChange: (i: string) => void;
};

function BtnGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="synth-btn-group">
      <span className="synth-btn-label">{label}</span>
      <div style={{ display: "flex", gap: 4 }}>{children}</div>
    </div>
  );
}

function SynthBtn({
  label, active, color = "red", onClick,
}: {
  label?: string; active?: boolean; color?: "red" | "blue" | "off"; onClick?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      {label && <span className="synth-btn-label">{label}</span>}
      <button className="synth-btn" onClick={onClick}>
        <span className={`led ${active ? (color === "blue" ? "blue" : "on") : "off"}`} />
      </button>
    </div>
  );
}

export default function Controls({
  volume, reverb, octave, sustain, instrument,
  octaves, instruments, displayText,
  onVolumeChange, onReverbChange, onOctaveChange, onSustainToggle, onInstrumentChange,
}: Props) {
  return (
    <div className="control-panel">

      {/* LEFT GROUP — Sound / Notes / Keys */}
      <BtnGroup label="SOUNDS">
        {instruments.map((t) => (
          <SynthBtn
            key={t.id}
            label={t.label.toUpperCase()}
            active={instrument === t.id}
            onClick={() => onInstrumentChange(t.id)}
          />
        ))}
      </BtnGroup>

      <div className="panel-divider" />

      {/* OCTAVE — mapping style */}
      <BtnGroup label="OCTAVE — MAPPING">
        {octaves.map((o) => (
          <SynthBtn
            key={o}
            label={String(o)}
            active={octave === o}
            color="red"
            onClick={() => onOctaveChange(o)}
          />
        ))}
      </BtnGroup>

      <div className="panel-divider" />

      {/* SUSTAIN */}
      <BtnGroup label="SUSTAIN">
        <SynthBtn active={sustain} color="blue" onClick={onSustainToggle} />
      </BtnGroup>

      <div className="panel-divider" />

      {/* LED DISPLAY */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div className="led-display">
          <div className="led-display-text">{displayText || "PLAY"}</div>
        </div>
      </div>

      <div className="panel-divider" />

      {/* VOLUME */}
      <div className="synth-btn-group">
        <span className="synth-btn-label">VOLUME</span>
        <input
          type="range" min={-30} max={0} value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{ width: 80, accentColor: "#cc0000" }}
        />
        <span className="synth-btn-label">{volume === 0 ? "MAX" : `${volume}dB`}</span>
      </div>

      <div className="panel-divider" />

      {/* REVERB */}
      <div className="synth-btn-group">
        <span className="synth-btn-label">REVERB</span>
        <input
          type="range" min={0} max={1} step={0.01} value={reverb}
          onChange={(e) => onReverbChange(Number(e.target.value))}
          style={{ width: 80, accentColor: "#4488ff" }}
        />
        <span className="synth-btn-label">{Math.round(reverb * 100)}%</span>
      </div>

      <div className="panel-divider" />

      {/* REC / PLAY buttons */}
      <BtnGroup label="REC — PLAY">
        <SynthBtn label="REC" active={false} color="red" />
        <SynthBtn label="PLAY" active={true} color="blue" />
      </BtnGroup>

    </div>
  );
}
