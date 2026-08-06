"use client";
type PianoKeyProps = {
  note: string;
  label: string;
  isBlack?: boolean;
  onPlay: (note: string) => void;
};

export default function Pianokey({ note, label, isBlack, onPlay }: PianoKeyProps){
    return(
       <button
  onClick={() => onPlay(note)}
  className={
    isBlack
      ? "w-12 h-36 bg-black text-white rounded absolute"
      : "w-20 h-60 bg-white text-black border"
  }
>
  {label}
</button>
    );

}