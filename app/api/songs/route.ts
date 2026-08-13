import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export const maxDuration = 60;

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

const SONG_META = {
  id: true,
  title: true,
  artist: true,
  fileName: true,
  mimeType: true,
  fileSize: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function GET() {
  const songs = await prisma.song.findMany({
    select: SONG_META,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    { success: true, data: songs },
    { headers: corsHeaders() }
  );
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = (formData.get("title") as string | null)?.trim() || "";
    const artist = (formData.get("artist") as string | null)?.trim() || "";
    const file = formData.get("file");

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "A PDF file is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed" },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "PDF file exceeds the 100 MB limit" },
        { status: 413, headers: corsHeaders() }
      );
    }

    const fileData = Buffer.from(await file.arrayBuffer());

    const song = await prisma.song.create({
      data: {
        title,
        artist: artist || null,
        fileName: file.name,
        mimeType: file.type || "application/pdf",
        fileSize: file.size,
        fileData,
      },
      select: SONG_META,
    });

    return NextResponse.json(
      { success: true, data: song },
      { status: 201, headers: corsHeaders() }
    );
  } catch (err) {
    console.error("Song upload failed:", err);
    return NextResponse.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500, headers: corsHeaders() }
    );
  }
}
