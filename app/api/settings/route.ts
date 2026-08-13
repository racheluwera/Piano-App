import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export const maxDuration = 60;

const SETTINGS_KEY = "default";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  try {
    const settings = await prisma.pianoSettings.findUnique({
      where: { key: SETTINGS_KEY },
    });

    return NextResponse.json(
      { success: true, data: settings?.data ?? null },
      { headers: corsHeaders() }
    );
  } catch (err) {
    console.error("Settings fetch failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load settings" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid settings payload" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const settings = await prisma.pianoSettings.upsert({
      where: { key: SETTINGS_KEY },
      update: { data: body },
      create: { key: SETTINGS_KEY, data: body },
    });

    return NextResponse.json(
      { success: true, data: settings.data },
      { headers: corsHeaders() }
    );
  } catch (err) {
    console.error("Settings save failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
