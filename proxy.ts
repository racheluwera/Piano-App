import { NextRequest, NextResponse } from "next/server";

const rateMap = new Map<string, { count: number; ts: number }>();
const RATE_LIMIT = 120;
const WINDOW_MS = 60_000;

export function proxy(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now - entry.ts > WINDOW_MS) {
    rateMap.set(ip, { count: 1, ts: now });
  } else {
    entry.count++;
    if (entry.count > RATE_LIMIT) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "index, follow");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
