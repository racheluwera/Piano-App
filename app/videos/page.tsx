"use client";
import Link from "next/link";

type Video = { id: string; title: string; channel: string; duration: string; category: string };

const VIDEOS: Video[] = [
  { id: "naE-oMAdbGk", title: "Beethoven – Moonlight Sonata", channel: "Rousseau", duration: "5:09", category: "Classical" },
  { id: "7OYkWSW7u4k", title: "Chopin – Nocturne Op.9 No.2", channel: "Rousseau", duration: "4:33", category: "Classical" },
  { id: "CvFH_6DNRCY", title: "Debussy – Clair de Lune", channel: "Rousseau", duration: "5:10", category: "Classical" },
  { id: "RvRhUHTV_8k", title: "Yiruma – River Flows in You", channel: "Rousseau", duration: "3:52", category: "Modern" },
  { id: "aSgMBMFGSMI", title: "Bach – Prelude in C Major", channel: "Rousseau", duration: "2:26", category: "Classical" },
  { id: "Mza3pMfFCNE", title: "Liszt – La Campanella", channel: "Rousseau", duration: "4:52", category: "Classical" },
  { id: "wf1GBMrFGaA", title: "Chopin – Fantasie Impromptu", channel: "Rousseau", duration: "5:02", category: "Classical" },
  { id: "nPBHgBFNMg8", title: "Mozart – Turkish March", channel: "Rousseau", duration: "3:05", category: "Classical" },
];

const CATEGORIES = ["All", ...Array.from(new Set(VIDEOS.map((v) => v.category)))];

export default function VideosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1008]">
      <nav className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a] border-b border-[#333]">
        <Link href="/" className="text-white font-bold text-sm tracking-widest uppercase">
          My Piano
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm">Play</Link>
          <Link href="/learn" className="text-amber-400 hover:text-amber-300 text-sm">Learn</Link>
          <Link href="/about" className="text-amber-400 hover:text-amber-300 text-sm">About</Link>
        </div>
      </nav>

      <main className="flex flex-col items-center px-6 py-16">
        <h1 className="text-amber-300 text-4xl font-bold mb-2 tracking-tight">Piano Performances</h1>
        <p className="text-amber-100/60 text-sm uppercase tracking-widest mb-10">
          Watch and learn from world-class pianists
        </p>

        <div className="max-w-4xl w-full">
          {/* Category filters */}
          <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase cursor-pointer transition-colors
                  bg-[#2a1f10] text-amber-100/60 hover:text-amber-300 hover:bg-[#3a2f20]"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIDEOS.map((v) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl overflow-hidden border border-[#333] bg-[#222] transition-all hover:border-[#555] hover:shadow-lg hover:shadow-black/30"
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt={v.title}
                    className="w-full block"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg shadow-black/50">
                      <span className="text-white text-2xl ml-1">&#9654;</span>
                    </div>
                  </div>
                  {/* Duration badge */}
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {v.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="text-white text-sm font-bold leading-snug">{v.title}</h3>
                  <p className="text-[#888] text-xs">{v.channel}</p>
                  <span className="mt-2 text-[10px] font-bold tracking-widest uppercase text-amber-500/80">
                    Watch on YouTube &#8599;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center pt-12">
          <Link
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Playing
          </Link>
        </div>
      </main>
    </div>
  );
}
