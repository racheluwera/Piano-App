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
  onVolumeChange: (v: number) => void;
  onReverbChange: (v: number) => void;
  onOctaveChange: (o: number) => void;
  onSustainToggle: () => void;
  onInstrumentChange: (i: string) => void;
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#9a8a6a",
      marginBottom: 6, display: "block",
    }}>
      {children}
    </span>
  );
}

export default function Controls({
  volume, reverb, octave, sustain, instrument,
  octaves, instruments,
  onVolumeChange, onReverbChange, onOctaveChange, onSustainToggle, onInstrumentChange,
}: Props) {
  return (
    <div className="controls-panel" style={{
      display: "flex", flexWrap: "wrap", gap: 24,
      alignItems: "flex-start", justifyContent: "center",
      padding: "16px 24px", width: "100%", maxWidth: 700,
    }}>

      {/* Instrument — driven by API */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Label>Sound</Label>
        <div style={{ display: "flex", gap: 6 }}>
          {instruments.map((t) => (
            <button
              key={t.id}
              onClick={() => onInstrumentChange(t.id)}
              className={`pill-btn ${instrument === t.id ? "active-btn" : "inactive"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Octave — driven by API */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Label>Octave</Label>
        <div style={{ display: "flex", gap: 4 }}>
          {octaves.map((o) => (
            <button
              key={o}
              onClick={() => onOctaveChange(o)}
              className={`pill-btn ${octave === o ? "active-btn" : "inactive"}`}
              style={{ padding: "4px 10px" }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Label>Volume · {volume === 0 ? "Max" : `${volume} dB`}</Label>
        <input
          type="range" min={-30} max={0} value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{ width: 110 }}
        />
      </div>

      {/* Reverb */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Label>Reverb · {Math.round(reverb * 100)}%</Label>
        <input
          type="range" min={0} max={1} step={0.01} value={reverb}
          onChange={(e) => onReverbChange(Number(e.target.value))}
          style={{ width: 110 }}
        />
      </div>

      {/* Sustain */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Label>Sustain</Label>
        <button
          onClick={onSustainToggle}
          className={`pill-btn ${sustain ? "active-btn" : "inactive"}`}
        >
          {sustain ? "🔒 On" : "🔓 Off"}
        </button>
      </div>
    </div>
  );
}
