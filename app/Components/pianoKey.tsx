"use client";

type PianoKeyProps = {
    note: string;
    onPlay: (note: string) =>void;

};

export default function Pianokey({ note, onPlay }: PianoKeyProps){
    return(
        <button onClick={() =>onPlay(note)}
        className="w-20 h-60 border bg-white text-black hover:bg-gray-200">
            {note}
        </button>
    );

}