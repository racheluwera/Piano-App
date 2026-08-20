"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1008]">
      <nav className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a] border-b border-[#333]">
        <Link href="/" className="text-white font-bold text-sm tracking-widest uppercase">
          My Piano
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm">Play</Link>
          <Link href="/learn" className="text-amber-400 hover:text-amber-300 text-sm">Learn</Link>
        </div>
      </nav>

      <main className="flex flex-col items-center px-6 py-16">
        <h1 className="text-amber-300 text-4xl font-bold mb-2 tracking-tight">About My Piano</h1>
        <p className="text-amber-100/60 text-sm uppercase tracking-widest mb-12">Virtual Piano Synthesizer</p>

        <div className="max-w-2xl w-full space-y-8">
          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">What is My Piano?</h2>
            <p className="text-amber-100/80 leading-relaxed">
              My Piano is a browser-based virtual piano that lets you play music using your
              keyboard, touchscreen, or mouse. No downloads, no installs — just open and play.
              It works on desktops, laptops, tablets, and phones.
            </p>
          </section>

          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">Features</h2>
            <ul className="space-y-3 text-amber-100/80">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Multiple instruments</strong> — Switch between synth, grand piano, and organ sounds.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">5 octaves</strong> — A wide range from C2 to C7, fully playable.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Scales &amp; modes</strong> — Play chromatic, major, minor, or pentatonic scales.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Sustain pedal</strong> — Hold notes like a real piano.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Recording &amp; playback</strong> — Record your performance and play it back.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Metronome</strong> — Keep time with a built-in click track.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Audio controls</strong> — Adjust volume, reverb, tone, and velocity sensitivity.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Sheet music library</strong> — Upload and view PDF sheet music alongside the keyboard.</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">How to Play</h2>
            <div className="text-amber-100/80 leading-relaxed space-y-3">
              <p>
                Use your computer keyboard to play notes. The middle row maps to white keys:
                <strong className="text-white"> A S D F G H J</strong> correspond to
                C D E F G A B. Black keys use:
                <strong className="text-white"> W E T Y U</strong>.
              </p>
              <p>
                On touchscreen devices, tap the keys directly. You can also click with a mouse.
                The sustain pedal is toggled with the <strong className="text-white">Space</strong> key
                or the sustain button on the control panel.
              </p>
              <p>
                Transpose the keyboard up or down, change octaves, and switch between keyboard
                mappings to find what feels natural.
              </p>
            </div>
          </section>

          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">Built With</h2>
            <div className="flex flex-wrap gap-3">
              {["Next.js", "React", "TypeScript", "Tone.js", "Tailwind CSS", "Prisma", "MongoDB"].map((tech) => (
                <span key={tech} className="bg-[#3a2f20] text-amber-300 text-sm px-4 py-2 rounded-lg font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <div className="text-center pt-8">
            <Link href="/" className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Playing
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
