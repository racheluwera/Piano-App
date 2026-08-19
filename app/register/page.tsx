"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/login");
    else setError((await res.json()).error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1008]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 p-8 bg-[#2a1f10] rounded-xl">
        <h1 className="text-white text-2xl font-bold">Register</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input className="p-2 rounded bg-[#3a2f20] text-white" placeholder="Username"
          value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <input className="p-2 rounded bg-[#3a2f20] text-white" placeholder="Email" type="email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="p-2 rounded bg-[#3a2f20] text-white" placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="bg-amber-600 hover:bg-amber-500 text-white py-2 rounded font-semibold">Register</button>
        <a href="/login" className="text-amber-400 text-sm text-center">Already have an account? Login</a>
      </form>
    </div>
  );
}
