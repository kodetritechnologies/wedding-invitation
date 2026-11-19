"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Lock, Mail, User, Phone, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.token) {
        localStorage.setItem("shaadi_auth_token", data.token);
        localStorage.setItem("token", data.token);
      }

      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 py-12 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-200/90 p-8 sm:p-10 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="VivahVaani"
              className="h-14 w-auto mx-auto object-contain"
            />
          </Link>

          <div className="inline-block px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-[11px] font-cinzel font-semibold">
            ✦ Shubh Aarambh &bull; Create Invitation ✦
          </div>

          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight pt-1">
            Apna Free Account Banayein
          </h1>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Sirf 1 minute me register karein aur apni shaadi ka shandar digital card banana shuru karein.
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
              Aapka Shubh Naam *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              WhatsApp Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98260 00000"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Password (Min 6 Characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Account Banaya Ja Raha Hai...</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Start</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-stone-100 text-center text-xs text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="text-rose-700 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
