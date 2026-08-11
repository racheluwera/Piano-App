import { NextResponse } from "next/server";
import {
  OCTAVES, WHITE_NOTES, WHITE_KEY_LABELS, WHITE_KEY_HINTS,
  BLACK_NOTE_POSITIONS, KEY_MAP_BASE, INSTRUMENT_TYPES, INSTRUMENT_ICONS,
} from "../../lib/constants";

// Allow any origin to fetch this API
export const runtime = "edge";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=86400", // config rarely changes — cache 24h
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const config = {
    version: "1.0",
    octaves: OCTAVES,
    defaultOctave: 4,
    whiteNotes: WHITE_NOTES,
    whiteKeyLabels: WHITE_KEY_LABELS,
    whiteKeyHints: WHITE_KEY_HINTS,
    blackKeys: BLACK_NOTE_POSITIONS,
    keyMap: KEY_MAP_BASE,
    instruments: INSTRUMENT_TYPES.map((id) => ({
      id,
      icon: INSTRUMENT_ICONS[id],
      label: id.charAt(0).toUpperCase() + id.slice(1),
    })),
    defaultInstrument: "piano",
    settings: {
      defaultVolume: 0,
      minVolume: -30,
      maxVolume: 0,
      defaultReverb: 0,
      defaultSustain: false,
    },
  };

  return NextResponse.json(
    { success: true, data: config },
    { headers: corsHeaders() }
  );
}
