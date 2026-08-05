"use client"

import * as Tone from "tone";
import PianoKey from "./pianoKey";
const notes = ["C4","D4","E4","G4","A4", "B4"];

const synth = new Tone.Synth().toDestination();

export default function Piano(){
    async function playNote(note: string){
        await Tone.start();
        synth.triggerAttackRelease(note,"8n");

    }
    return(
        <div className= "flex justify-center gap-1 mt-10">
            {notes.map((note) => (
                <PianoKey
                key={note}
                note={note}
                onPlay={playNote} />
            ))}
        </div>
    );
}