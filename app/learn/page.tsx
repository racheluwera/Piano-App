"use client";
import Link from "next/link";

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1008]">
      <nav className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a] border-b border-[#333]">
        <Link href="/" className="text-white font-bold text-sm tracking-widest uppercase">
          My Piano
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm">Play</Link>
          <Link href="/about" className="text-amber-400 hover:text-amber-300 text-sm">About</Link>
        </div>
      </nav>

      <main className="flex flex-col items-center px-6 py-16">
        <h1 className="text-amber-300 text-4xl font-bold mb-2 tracking-tight">Learn Piano</h1>
        <p className="text-amber-100/60 text-sm uppercase tracking-widest mb-12">Basics, Theory &amp; Tips</p>

        <div className="max-w-2xl w-full space-y-8">

          {/* Keyboard Layout */}
          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">Keyboard Layout</h2>
            <p className="text-amber-100/80 leading-relaxed mb-6">
              A piano keyboard is made of white and black keys arranged in a repeating pattern of 12 notes.
              White keys play the natural notes (C, D, E, F, G, A, B) and black keys play the sharps and flats.
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-6 font-mono text-sm">
              <div className="flex justify-center gap-1 mb-2">
                <span className="w-10 h-20 bg-white text-gray-800 rounded-b flex items-end justify-center pb-2 font-bold">C</span>
                <span className="w-10 h-20 bg-white text-gray-800 rounded-b flex items-end justify-center pb-2 font-bold">D</span>
                <span className="w-10 h-20 bg-white text-gray-800 rounded-b flex items-end justify-center pb-2 font-bold">E</span>
                <span className="w-10 h-20 bg-white text-gray-800 rounded-b flex items-end justify-center pb-2 font-bold">F</span>
                <span className="w-10 h-20 bg-white text-gray-800 rounded-b flex items-end justify-center pb-2 font-bold">G</span>
                <span className="w-10 h-20 bg-white text-gray-800 rounded-b flex items-end justify-center pb-2 font-bold">A</span>
                <span className="w-10 h-20 bg-white text-gray-800 rounded-b flex items-end justify-center pb-2 font-bold">B</span>
              </div>
              <p className="text-amber-100/60 text-center text-xs mt-4">One octave: 7 white keys + 5 black keys = 12 notes</p>
            </div>
          </section>

          {/* Computer Keyboard Mapping */}
          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">Computer Keyboard Mapping</h2>
            <p className="text-amber-100/80 leading-relaxed mb-4">
              On this virtual piano, your computer keyboard maps directly to piano keys:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded-lg p-5">
                <h3 className="text-amber-300 font-bold text-sm mb-3 uppercase tracking-wider">White Keys</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-amber-100/80"><span>A</span><span className="text-white font-mono">C</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>S</span><span className="text-white font-mono">D</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>D</span><span className="text-white font-mono">E</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>F</span><span className="text-white font-mono">F</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>G</span><span className="text-white font-mono">G</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>H</span><span className="text-white font-mono">A</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>J</span><span className="text-white font-mono">B</span></div>
                </div>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-5">
                <h3 className="text-amber-300 font-bold text-sm mb-3 uppercase tracking-wider">Black Keys</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-amber-100/80"><span>W</span><span className="text-white font-mono">C&#9839;</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>E</span><span className="text-white font-mono">D&#9839;</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>T</span><span className="text-white font-mono">F&#9839;</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>Y</span><span className="text-white font-mono">G&#9839;</span></div>
                  <div className="flex justify-between text-amber-100/80"><span>U</span><span className="text-white font-mono">A&#9839;</span></div>
                </div>
              </div>
            </div>
            <p className="text-amber-100/60 text-xs mt-4">
              The default mapping is QWERTY (max range). Switch to &quot;Real&quot; mapping in the control panel for a layout that mirrors actual piano finger positions.
            </p>
          </section>

          {/* Music Theory Basics */}
          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">Music Theory Basics</h2>
            <div className="space-y-6 text-amber-100/80 leading-relaxed">
              <div>
                <h3 className="text-amber-300 font-bold mb-2">Scales</h3>
                <p>
                  A <strong className="text-white">scale</strong> is a sequence of notes ordered by pitch.
                  This piano supports four scale modes:
                </p>
                <ul className="mt-2 space-y-1 ml-4 list-disc text-sm">
                  <li><strong className="text-white">Chromatic</strong> — All 12 notes in order (no filtering).</li>
                  <li><strong className="text-white">Major</strong> — Happy, bright sound (W-W-H-W-W-W-H pattern).</li>
                  <li><strong className="text-white">Minor</strong> — Sad, moody sound (W-H-W-W-H-W-W pattern).</li>
                  <li><strong className="text-white">Pentatonic</strong> — 5-note scale, great for melodies and improvisation.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-amber-300 font-bold mb-2">Intervals</h3>
                <p>
                  An <strong className="text-white">interval</strong> is the distance between two notes.
                  Common intervals: unison (same note), octave (12 semitones up), fifth (7 semitones),
                  and fourth (5 semitones). The fifth is the most consonant interval after the octave.
                </p>
              </div>
              <div>
                <h3 className="text-amber-300 font-bold mb-2">Chords</h3>
                <p>
                  A <strong className="text-white">chord</strong> is two or more notes played together.
                  The most common are major and minor triads. Play multiple keys at once on this
                  piano to create chords — the virtual instrument supports full polyphony.
                </p>
              </div>
            </div>
          </section>

          {/* Playing Tips */}
          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">Playing Tips</h2>
            <ul className="space-y-3 text-amber-100/80">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Use sustain wisely.</strong> Press Space or the sustain button to hold notes, simulating a real piano pedal. Great for legato passages.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Try different instruments.</strong> The synth sounds different from the grand piano. Experiment to find what fits your style.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Adjust the tone.</strong> Use the tone slider to make the sound brighter or warmer. A brighter tone cuts through mixes; warmer tones are gentler for practice.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Add reverb.</strong> A little reverb adds depth and space, making the piano sound like it&apos;s in a room rather than a dry studio.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Record yourself.</strong> Use the record button to capture your playing, then listen back to spot mistakes and track your progress.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Use the metronome.</strong> Practice with the metronome to develop a steady sense of rhythm. Start slow and increase tempo as you improve.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">&#9654;</span>
                <span><strong className="text-white">Transpose for range.</strong> Use the transpose control to shift the keyboard up or down, letting you reach higher or lower notes without changing hand position.</span>
              </li>
            </ul>
          </section>

          {/* Practice Exercises */}
          <section className="bg-[#2a1f10] rounded-xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">Beginner Exercises</h2>
            <div className="space-y-4 text-amber-100/80 leading-relaxed">
              <div>
                <h3 className="text-amber-300 font-bold mb-1">1. Five-Finger Pattern</h3>
                <p className="text-sm">
                  Place your fingers on A S D F G (C D E F G). Press each key in order, one at a time,
                  going up and then back down. Repeat until smooth. This builds finger independence.
                </p>
              </div>
              <div>
                <h3 className="text-amber-300 font-bold mb-1">2. Major Scale</h3>
                <p className="text-sm">
                  Play: A W S E D F T G Y H J (C C# D D# E F F# G G# A A# B).
                  In the Major scale mode, the app will highlight only the notes in C Major:
                  A S D F G H J (C D E F G A B).
                </p>
              </div>
              <div>
                <h3 className="text-amber-300 font-bold mb-1">3. Chord Practice</h3>
                <p className="text-sm">
                  Try playing three notes together: A + D + G (C + E + G) — this is a C Major triad.
                  Then try A + D + J (C + E + B) for a C Major 7th. Experiment with different combinations.
                </p>
              </div>
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
