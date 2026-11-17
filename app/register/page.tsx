"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Lock, Mail, User, Building, Phone, ArrowRight, Loader2, Sparkles } from "lucide-react";

const BUSINESS_TYPE_OPTIONS = [
  { id: "invitation_designer", label: "Invitation Designer / Studio" },
  { id: "wedding_planner", label: "Wedding Event Planner" },
  { id: "photographer", label: "Photographer / Cinematographer" },
  { id: "videographer", label: "Videographer" },
  { id: "decorator", label: "Decorator & Florist" },
  { id: "caterer", label: "Caterer / Food Service" },
  { id: "makeup_artist", label: "Makeup & Mehndi Artist" },
  { id: "other", label: "Family / Individual Couple" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["invitation_designer"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleBusinessType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

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
          businessName,
          businessTypes: selectedTypes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.token) {
        localStorage.setItem("shaadi_auth_token", data.token);
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

      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-stone-200/90 p-8 sm:p-10 space-y-6 relative z-10">
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
            ✦ Shubh Aarambh &bull; Free Workspace ✦
          </div>

          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight pt-1">
            Naya Business Workspace Banayein
          </h1>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Sirf 2 minute me register karein — weddings create karein, Google Maps set karein aur mehmaano ke live RSVP manage karein.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="e.g. Vikramaditya Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Business / Studio Name *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Royal Vivah Creations"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="name@business.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                WhatsApp Phone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98260 00000"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                />
              </div>
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
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
              />
            </div>
          </div>

          {/* Business Type Multi-select */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
              Aapka Role Ya Business Type (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BUSINESS_TYPE_OPTIONS.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => toggleBusinessType(type.id)}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer text-xs flex items-center justify-between ${
                      isSelected
                        ? "bg-rose-50 border-rose-500 text-rose-900 font-bold shadow-2xs"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span className="truncate">{type.label}</span>
                    {isSelected && <span className="text-rose-700 text-xs">✓</span>}
                  </button>
                );
              })}
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
                  <span>Workspace Taiyar Kiya Ja Raha Hai...</span>
                </>
              ) : (
                <>
                  <span>Create Admin Workspace</span>
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
