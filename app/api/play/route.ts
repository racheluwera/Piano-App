import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const VALID_NOTES = /^[A-Gb#]{1,2}[2-6]$/;

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.note || !VALID_NOTES.test(body.note)) {
    return NextResponse.json(
      { success: false, error: "Invalid note. Example: C4, D#3, A5" },
      { status: 400, headers: cors() }
    );
  }

  return NextResponse.json(
    { success: true, note: body.note, playedAt: new Date().toISOString() },
    { headers: cors() }
  );
}
