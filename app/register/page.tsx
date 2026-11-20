"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { MdShare, MdGroup, MdAutoAwesome } from "react-icons/md";
import LoginModal from "@/components/auth/LoginModal";

const HIGHLIGHTS = [
  {
    icon: MdAutoAwesome,
    title: "Free Digital Wedding Card",
    desc: "Shandar digital patrika bilkul free banayein",
  },
  {
    icon: MdShare,
    title: "1-Click WhatsApp Share",
    desc: "Sabhi rishtedaron ko ek click me invite karein",
  },
  {
    icon: MdGroup,
    title: "Live RSVP & Guest Headcount",
    desc: "Real-time aane wale mehmano ki list dekhein",
  },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = (): boolean => {
    const errs: { name?: string; phone?: string; email?: string; password?: string } = {};
    const nameTrimmed = name.trim();
    const phoneDigits = phone.replace(/[^0-9]/g, "");
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameTrimmed) errs.name = "Kripya apna shubh naam enter karein.";
    else if (nameTrimmed.length < 2) errs.name = "Naam kam se kam 2 aksharon ka hona chahiye.";

    if (!phone.trim()) errs.phone = "Kripya WhatsApp number enter karein.";
    else if (phoneDigits.length < 10) errs.phone = "10 ankon ka valid mobile number enter karein.";

    if (!emailTrimmed) errs.email = "Kripya email address enter karein.";
    else if (!emailRegex.test(emailTrimmed)) errs.email = "Valid email enter karein (jaise name@gmail.com).";

    if (!password) errs.password = "Kripya password enter karein.";
    else if (password.length < 6) errs.password = "Password kam se kam 6 characters ka hona chahiye.";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Registration failed");
      if (data.token) {
        localStorage.setItem("shaadi_auth_token", data.token);
        localStorage.setItem("token", data.token);
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 900);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl border text-stone-800 text-xs sm:text-sm transition-all duration-200 ${
      hasError
        ? "border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-300/40 focus:border-red-500 focus:outline-none"
        : "border-stone-200 bg-stone-50/60 hover:border-amber-400/50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-[#7A0E1A] focus:outline-none"
    }`;

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#FAF7F2] flex flex-col justify-between relative p-2 sm:p-3 lg:p-4 selection:bg-rose-100 selection:text-rose-900">

      {/* ── AMBIENT LUXURY BACKGROUND ORBS & TEXTURE ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #FDE68A 0%, rgba(254,243,199,0) 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #FDA4AF 0%, rgba(255,228,230,0) 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "url('/assets/steps/maroon-damask-bg.png')",
            backgroundSize: "320px 320px",
          }}
        />
      </div>

      {/* ── TOP NAV BAR ── */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-1 px-1 shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Home Page</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-stone-500">Pehle se account hai?</span>
          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30 bg-white/80 hover:bg-white text-[#7A0E1A] shadow-sm transition-all cursor-pointer"
          >
            Sign In Karein
          </button>
        </div>
      </header>

      {/* ── CENTERED LUXURY FOLIO CARD ── */}
      <main className="relative z-10 w-full max-w-4xl lg:max-w-[920px] mx-auto my-auto flex-1 flex items-center justify-center py-1 sm:py-2">
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(92,6,18,0.18),0_1px_3px_rgba(0,0,0,0.04)] border border-amber-300/40 ring-1 ring-amber-400/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          {/* ═══════════════════════════════════════
              LEFT PANEL — Editorial Wedding Story
          ═══════════════════════════════════════ */}
          <div className="lg:col-span-5 relative overflow-hidden p-5 sm:p-6 flex flex-col justify-between">

            {/* Background Wedding Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: "url('/assets/steps/d6ac1b076954f2df18dbcdc119c7f878.jpg')",
              }}
              aria-hidden="true"
            />

            {/* Rich Royal Maroon-Amber Duotone Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, rgba(45,3,8,0.92) 0%, rgba(92,6,18,0.86) 45%, rgba(122,14,26,0.88) 100%)",
              }}
              aria-hidden="true"
            />

            {/* Ornate Golden Mandala Corner Flourish */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/steps/Ornate_Golden_Lotus_Mandala-removebg-preview.png"
              alt=""
              aria-hidden="true"
              className="absolute -bottom-16 -left-16 w-56 opacity-20 pointer-events-none select-none"
            />

            {/* Top Brand & Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <Link href="/" className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-dark.png"
                  alt="VivahVaani"
                  className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_10px_rgba(212,163,69,0.5)]"
                />
              </Link>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-sm">
                ✦ Royal Edition
              </span>
            </div>

            {/* Middle Quote & Feature Pills */}
            <div className="relative z-10 my-auto py-2 sm:py-3 space-y-3">
              <div className="space-y-1">
                <p className="text-amber-300/90 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Shubh Vivaah Nimantran
                </p>
                <h2 className="text-white text-lg sm:text-xl font-bold leading-snug">
                  हर शादी की शुरुआत,
                  <br />
                  <span className="text-amber-300 font-extrabold">एक खूबसूरत</span>
                  <br />
                  निमंत्रण से होती है।
                </h2>
                <p className="text-white/70 text-[11px] leading-relaxed max-w-xs">
                  VivahVaani ke sath banayein apni shaadi ka digital aagaz aur mehmano ko bhejein shandar patrika.
                </p>
              </div>

              {/* 3 Highlights */}
              <div className="space-y-1.5 pt-0.5">
                {HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-2.5 bg-white/[0.08] hover:bg-white/[0.12] backdrop-blur-md border border-white/15 rounded-xl px-2.5 py-1.5 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shrink-0">
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-amber-100 text-[11px] font-semibold leading-tight">{item.title}</p>
                      <p className="text-white/60 text-[9.5px] truncate leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Badges */}
            <div className="relative z-10 pt-1 flex items-center gap-1.5 flex-wrap">
              {["100% Free", "Safe & Private", "Instant Setup"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/25 border border-white/10 text-white/75 text-[9.5px] font-medium"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════
              RIGHT PANEL — Cohesive Warm Luxury Form
          ═══════════════════════════════════════ */}
          <div className="lg:col-span-7 bg-[#FFFDFB] p-5 sm:p-6 lg:p-7 flex flex-col justify-center relative">

            {/* Subtle Top-Right Accent */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #FCDDB0 0%, transparent 70%)" }}
              aria-hidden="true"
            />

            {/* Header */}
            <div className="mb-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/70 text-[#7A0E1A] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  ✦ Shubh Aarambh ✦
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Free Card
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                Apna Account Banayein
              </h1>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Sirf 1 minute me digital card create karna shuru karein — koi card zaroori nahi.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-2 p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {success && (
              <div className="mb-2 p-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                <span>Account ban gaya! Dashboard khul raha hai...</span>
              </div>
            )}

            {/* Form with pure JavaScript validation */}
            <form onSubmit={handleSubmit} noValidate className="space-y-2">

              {/* Name Field */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-0.5">
                  Aapka Shubh Naam
                </label>
                <div className="relative">
                  <User
                    className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors ${
                      fieldErrors.name ? "text-red-400" : "text-stone-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className={inputClass(fieldErrors.name)}
                    autoFocus
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-0.5 text-[10px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* WhatsApp Field */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-0.5">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <Phone
                    className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors ${
                      fieldErrors.phone ? "text-red-400" : "text-stone-400"
                    }`}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
                    }}
                    placeholder="+91 98260 00000"
                    className={inputClass(fieldErrors.phone)}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-0.5 text-[10px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-0.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors ${
                      fieldErrors.email ? "text-red-400" : "text-stone-400"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="name@gmail.com"
                    className={inputClass(fieldErrors.email)}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-0.5 text-[10px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-0.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors ${
                      fieldErrors.password ? "text-red-400" : "text-stone-400"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="Minimum 6 characters"
                    className={`${inputClass(fieldErrors.password)} pr-9`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-0.5 text-[10px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full mt-1.5 py-2 sm:py-2.5 bg-gradient-to-r from-[#7A0E1A] via-[#9B1627] to-[#5C0612] hover:from-[#5C0612] hover:to-[#3D0208] text-amber-50 font-bold rounded-xl shadow-[0_8px_20px_-4px_rgba(155,22,39,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-200" />
                    <span>Account Ban Raha Hai...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Account Ready! Shubh Aarambh...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Prompt */}
            <p className="mt-2.5 text-center text-[11px] text-stone-500">
              Pehle se account hai?{" "}
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="text-[#7A0E1A] font-bold hover:underline cursor-pointer ml-0.5"
              >
                Sign In karein →
              </button>
            </p>

            {/* Terms micro-text */}
            <p className="mt-1 text-center text-[9.5px] text-stone-400 leading-tight">
              Register karke aap hamare{" "}
              <Link href="/terms" className="underline hover:text-stone-600">
                Terms
              </Link>{" "}
              aur{" "}
              <Link href="/privacy" className="underline hover:text-stone-600">
                Privacy Policy
              </Link>{" "}
              se agree karte hain.
            </p>
          </div>
        </div>
      </main>

      {/* ── FOOTER COPYRIGHT ── */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto py-0.5 text-center shrink-0">
        <p className="text-[9.5px] text-stone-400">
          © 2026 VivahVaani. Sampoorna Digital Nimantran Patrika Portal.
        </p>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        redirectAfterLogin="/dashboard"
      />
    </div>
  );
}
