"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type Song = {
  id: string;
  title: string;
  artist: string | null;
  fileName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onView: (song: Song) => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SongsPanel({ open, onClose, onView }: Props) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadSongs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/songs");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load songs");
      setSongs(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load songs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => { void loadSongs(); }, 0);
    return () => clearTimeout(id);
  }, [open, loadSongs]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a PDF file");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("file", file);

      const res = await fetch("/api/songs", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload failed");
      }
      setSongs((prev) => [json.data, ...prev]);
      setTitle("");
      setArtist("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError("");
    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Delete failed");
      }
      setSongs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: 560, maxHeight: "85dvh", overflowY: "auto",
          background: "linear-gradient(180deg,#252525 0%,#161616 100%)",
          border: "1px solid #444", borderRadius: 10,
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          padding: 24,
          display: "flex", flexDirection: "column", gap: 18,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", color: "#eee" }}>
            ♪ SONGS LIBRARY
          </div>
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

        {/* ── Upload form ── */}
        <form
          onSubmit={handleUpload}
          style={{
            display: "flex", flexDirection: "column", gap: 10,
            padding: 16,
            background: "#1d1d1d", border: "1px solid #333", borderRadius: 8,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <label style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Title *
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fur Elise"
                style={{
                  padding: "8px 10px", borderRadius: 4,
                  background: "#111", border: "1px solid #444",
                  color: "#eee", fontSize: 13,
                }}
              />
            </label>
            <label style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Artist
              </span>
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Beethoven"
                style={{
                  padding: "8px 10px", borderRadius: 4,
                  background: "#111", border: "1px solid #444",
                  color: "#eee", fontSize: 13,
                }}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              PDF File *
            </span>
            <input
              ref={fileRef}
              type="file" accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ color: "#aaa", fontSize: 12 }}
            />
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="submit" disabled={uploading}
              style={{
                padding: "9px 18px", cursor: uploading ? "default" : "pointer",
                background: "linear-gradient(180deg,#1f5a1f,#0e2e0e)",
                border: "1px solid #2f7a2f", borderRadius: 5,
                color: "#bfffc0", fontWeight: 700, fontSize: 12,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}
            >
              {uploading ? "Uploading…" : "Upload PDF"}
            </button>
            {file && (
              <span style={{ fontSize: 11, color: "#aaa" }}>
                {file.name} · {formatSize(file.size)}
              </span>
            )}
          </div>
        </form>

        {error && (
          <div style={{ color: "#ff5555", fontSize: 12, fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* ── Song list ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Saved Songs ({songs.length})
          </div>

          {loading ? (
            <div style={{ color: "#aaa", fontSize: 13, padding: "8px 0" }}>Loading…</div>
          ) : songs.length === 0 ? (
            <div style={{ color: "#777", fontSize: 13, padding: "8px 0" }}>
              No songs yet. Upload a PDF above.
            </div>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px",
                  background: "#1d1d1d", border: "1px solid #333", borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 18 }}>🎼</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#eee", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {song.title}
                  </div>
                  <div style={{ color: "#888", fontSize: 11 }}>
                    {song.artist || "Unknown artist"} · {song.fileName} · {formatSize(song.fileSize)} · {formatDate(song.createdAt)}
                  </div>
                </div>
                <button
                  onClick={() => onView(song)}
                  style={{
                    padding: "6px 10px", fontSize: 11, fontWeight: 700,
                    cursor: "pointer", color: "#8ab4ff",
                    background: "#102036", border: "1px solid #2a4a7a", borderRadius: 4,
                    letterSpacing: "0.08em",
                  }}
                >
                  VIEW
                </button>
                <button
                  onClick={() => handleDelete(song.id)}
                  style={{
                    padding: "6px 10px", fontSize: 11, fontWeight: 700,
                    cursor: "pointer", color: "#ff8a8a",
                    background: "#331010", border: "1px solid #7a2a2a", borderRadius: 4,
                    letterSpacing: "0.08em",
                  }}
                >
                  DELETE
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
