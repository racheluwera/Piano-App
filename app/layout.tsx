import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import LogoutButton from "./Components/LogoutButton";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Piano — Play from anywhere",
  description: "A beautiful piano you can play in any browser — keyboard, touch, or click. No download needed.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "My Piano" },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  themeColor: "#1a1008",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <nav className="flex items-center justify-end gap-4 px-6 py-3 bg-[#1a1008] text-sm">
          {user ? (
            <>
              <span className="text-amber-300">{user.username}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <a href="/login" className="text-amber-400 hover:text-amber-300">Login</a>
              <a href="/register" className="text-amber-400 hover:text-amber-300">Register</a>
            </>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}
