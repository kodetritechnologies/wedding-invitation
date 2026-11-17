"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Lock, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed. Check your email or password.");
      }

      // Store token in localStorage as backup for client-side fetches
      if (data.token) {
        localStorage.setItem("shaadi_auth_token", data.token);
      }

      // Hard redirect to populate cookies in document
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 relative overflow-hidden font-sans">
      {/* Subtle Royal Motif Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-200/90 p-8 sm:p-10 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 via-rose-800 to-amber-900 flex items-center justify-center text-amber-300 shadow-sm border border-amber-400/30">
              <Heart className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>
            <span className="font-bold text-stone-900 tracking-tight text-2xl font-serif">
              Shaadi<span className="text-rose-700">Connect</span>
            </span>
          </Link>

          <div className="inline-block px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-[11px] font-cinzel font-semibold">
            ✦ Business &amp; Family Admin Portal ✦
          </div>

          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight pt-1">
            Apne Workspace Me Login Karein
          </h1>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Weddings, clients, function schedules aur live RSVP headcount manage karein.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@weddingbusiness.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In To Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100 text-center space-y-2 text-xs text-stone-500">
          <p>
            Naya account banana chahte hain?{" "}
            <Link href="/register" className="text-rose-700 font-bold hover:underline">
              Register Free Admin Workspace
            </Link>
          </p>
          <p className="text-[11px] text-stone-400">
            Platform governance &amp; templates:{" "}
            <Link href="/admin" className="text-stone-600 hover:underline">
              Super Admin Login (/admin)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
