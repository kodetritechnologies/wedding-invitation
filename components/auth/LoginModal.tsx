"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  X,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: { name: string; email: string }) => void;
  redirectAfterLogin?: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  redirectAfterLogin = "/dashboard",
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError("");
      setFieldErrors({});
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      errs.email = "Kripya apna email address enter karein.";
    } else if (!emailRegex.test(emailTrimmed)) {
      errs.email = "Kripya valid email address enter karein (jaise name@gmail.com).";
    }

    if (!password) {
      errs.password = "Kripya apna password enter karein.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      // Store tokens
      if (data.token) {
        localStorage.setItem("shaadi_auth_token", data.token);
        localStorage.setItem("token", data.token);
      }

      if (onSuccess && data.user) {
        onSuccess({ name: data.user.name, email: data.user.email });
      }

      onClose();

      // Navigate or reload to refresh authenticated state
      if (redirectAfterLogin) {
        window.location.href = redirectAfterLogin;
      } else {
        window.location.reload();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl shadow-2xl border border-stone-200/90 p-6 sm:p-8 space-y-5 z-10 animate-in zoom-in-95 duration-200 overflow-hidden font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-login-title"
      >
        {/* Top subtle decorative pattern */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-700 via-rose-800 to-amber-700" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="VivahVaani"
            className="h-12 w-auto mx-auto object-contain"
          />

          <div className="inline-block px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-[11px] font-cinzel font-semibold">
            ✦ Client Login &bull; Wedding Portal ✦
          </div>

          <h2 id="modal-login-title" className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
            Apne Account Me Login Karein
          </h2>
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            Apna wedding card, event schedule aur live RSVP headcount manage karein.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs font-sans">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${fieldErrors.email ? "text-red-500" : "text-stone-400"}`} />
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="name@weddingbusiness.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white focus:outline-none text-stone-800 text-xs sm:text-sm transition ${
                  fieldErrors.email
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                    : "border-stone-200 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${fieldErrors.password ? "text-red-500" : "text-stone-400"}`} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white focus:outline-none text-stone-800 text-xs sm:text-sm transition ${
                  fieldErrors.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                    : "border-stone-200 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm mt-2"
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

        {/* Footer links */}
        <div className="pt-2 border-t border-stone-200 text-center space-y-1.5 text-xs text-stone-500">
          <p>
            Naya account banana chahte hain?{" "}
            <Link
              href="/register"
              onClick={onClose}
              className="text-rose-700 font-bold hover:underline"
            >
              Register Workspace
            </Link>
          </p>
          <p className="text-[11px] text-stone-400">
            Super Admin Access:{" "}
            <Link
              href="/admin"
              onClick={onClose}
              className="text-stone-600 hover:underline"
            >
              Super Admin Login (/admin)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
