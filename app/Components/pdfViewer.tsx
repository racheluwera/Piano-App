"use client";
import type { Song } from "./songsPanel";

type Props = {
  song: Song | null;
  onClose: () => void;
};

export default function PdfViewer({ song, onClose }: Props) {
  if (!song) return null;

  return (
    <div
      style={{
        width: 440,
        maxWidth: "44vw",
        minHeight: 460,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg,#252525 0%,#161616 100%)",
        border: "1px solid #444",
        borderRadius: 10,
        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderBottom: "1px solid #333",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#eee", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          🎼 {song.title}
        </div>
        <div style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {song.artist || "Unknown artist"}
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={onClose}
          title="Close sheet music"
          style={{
            width: 30, height: 30, cursor: "pointer",
            background: "#2e2e2e", border: "1px solid #444",
            borderRadius: 4, color: "#ccc", fontSize: 14, fontWeight: 700,
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>
      <iframe
        src={`/api/songs/${song.id}`}
        title={song.title}
        style={{ flex: 1, width: "100%", border: "none", background: "#fff", minHeight: 400 }}
      />
    </div>
  );
}
