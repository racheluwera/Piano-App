"use client";

type Video = { id: string; title: string; channel: string; duration: string };

const VIDEOS: Video[] = [
  { id: "naE-oMAdbGk", title: "Beethoven – Moonlight Sonata (Keyboard View)", channel: "Rousseau", duration: "5:09" },
  { id: "7OYkWSW7u4k", title: "Chopin – Nocturne Op.9 No.2 (Keyboard View)", channel: "Rousseau", duration: "4:33" },
  { id: "CvFH_6DNRCY", title: "Debussy – Clair de Lune (Keyboard View)", channel: "Rousseau", duration: "5:10" },
  { id: "RvRhUHTV_8k", title: "Yiruma – River Flows in You (Keyboard View)", channel: "Rousseau", duration: "3:52" },
  { id: "aSgMBMFGSMI", title: "Bach – Prelude in C Major (Keyboard View)", channel: "Rousseau", duration: "2:26" },
  { id: "Mza3pMfFCNE", title: "Liszt – La Campanella (Keyboard View)", channel: "Rousseau", duration: "4:52" },
  { id: "wf1GBMrFGaA", title: "Chopin – Fantasie Impromptu (Keyboard View)", channel: "Rousseau", duration: "5:02" },
  { id: "nPBHgBFNMg8", title: "Mozart – Turkish March (Keyboard View)", channel: "Rousseau", duration: "3:05" },
];

type Props = { open: boolean; onClose: () => void };

export default function VideosPanel({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: 780, maxHeight: "90dvh", overflowY: "auto",
          background: "linear-gradient(180deg,#252525 0%,#161616 100%)",
          border: "1px solid #444", borderRadius: 10,
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          padding: 24, display: "flex", flexDirection: "column", gap: 18,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", color: "#eee" }}>
            🎬 PIANO VIDEOS
          </span>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, cursor: "pointer",
              background: "#2e2e2e", border: "1px solid #444",
              borderRadius: 4, color: "#ccc", fontSize: 14, fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: "#888", fontSize: 12, margin: 0 }}>
          Click any video to watch it on YouTube.
        </p>

        {/* Video grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {VIDEOS.map((v) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "flex", flexDirection: "column", borderRadius: 8, overflow: "hidden", border: "1px solid #333", transition: "border-color 150ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#666")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333")}
            >
              {/* Thumbnail */}
              <div style={{ position: "relative" }}>
                <img
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  style={{ width: "100%", display: "block" }}
                />
                {/* Play overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.25)",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "rgba(255,0,0,0.9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.6)",
                  }}>
                    <span style={{ color: "#fff", fontSize: 20, marginLeft: 4 }}>▶</span>
                  </div>
                </div>
                {/* Duration badge */}
                <span style={{
                  position: "absolute", bottom: 6, right: 6,
                  background: "rgba(0,0,0,0.8)", color: "#fff",
                  fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 3,
                }}>
                  {v.duration}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: "10px 12px", background: "#1d1d1d", flex: 1 }}>
                <div style={{ color: "#eee", fontSize: 12, fontWeight: 700, lineHeight: 1.4 }}>
                  {v.title}
                </div>
                <div style={{ color: "#888", fontSize: 10, marginTop: 4 }}>
                  {v.channel}
                </div>
                <div style={{ marginTop: 8, color: "#ff4444", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>
                  ▶ WATCH ON YOUTUBE ↗
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
