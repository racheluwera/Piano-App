import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const maxDuration = 60;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/songs/[id]">
) {
  const { id } = await ctx.params;

  try {
    const song = await prisma.song.findUnique({ where: { id } });

    if (!song) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    return new NextResponse(song.fileData, {
      status: 200,
      headers: {
        ...corsHeaders(),
        "Content-Type": song.mimeType || "application/pdf",
        "Content-Length": String(song.fileData.byteLength),
        "Content-Disposition": `inline; filename="${encodeURIComponent(song.fileName)}"`,
      },
    });
  } catch (err) {
    console.error("Song fetch failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load song" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/songs/[id]">
) {
  const { id } = await ctx.params;

  try {
    await prisma.song.delete({ where: { id } });
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders() }
    );
  } catch (err) {
    console.error("Song delete failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete song" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
