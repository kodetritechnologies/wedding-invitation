"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [quickFilled, setQuickFilled] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Check if Super Admin is already logged in
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("shaadi_super_admin_token")
        : null;

    if (!token) return;

    async function checkSession() {
      setCheckingAuth(true);
      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
        };

        const res = await fetch("/api/auth/super-admin/me", {
          headers,
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.superAdmin) {
            router.replace("/admin/dashboard");
            return;
          }
        }
      } catch {
        // Stay on login page
      } finally {
        setCheckingAuth(false);
      }
    }

    checkSession();
  }, []);

  const handleQuickFill = () => {
    setEmail("admin@vivahvaani.kodetri.com");
    setPassword("ShaadiAdmin@2026");
    setQuickFilled(true);
    setError("");
    setFieldErrors({});
    setTimeout(() => setQuickFilled(false), 2000);
  };

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      errs.email = "Super admin email enter karein.";
    } else if (!emailRegex.test(emailTrimmed)) {
      errs.email = "Valid email address enter karein.";
    }

    if (!password) {
      errs.password = "Password enter karein.";
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
      const res = await fetch("/api/auth/super-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Super Admin credentials invalid");
      }

      if (data.token) {
        localStorage.setItem("shaadi_super_admin_token", data.token);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg);
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-4 font-sans">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-dark.png"
              alt="VivahVaani"
              className="h-16 w-auto mx-auto object-contain drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Super Admin Login
          </h1>
          <p className="text-xs text-zinc-400">
            VivahVaani Control Panel &bull; Kodetri Technologies
          </p>
        </div>

        {/* Quick-Fill Helper for Testing */}
        <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2">
          <span className="text-xs text-zinc-400">Master Credentials:</span>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {quickFilled ? "Loaded!" : "Auto-Fill"}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Login successful! Opening dashboard...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Super Admin Email
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${fieldErrors.email ? "text-red-400" : "text-zinc-500"}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="admin@vivahvaani.kodetri.com"
                className={`w-full pl-9 pr-4 py-2.5 bg-zinc-950 rounded-xl border text-white placeholder-zinc-500 text-sm focus:outline-none transition ${
                  fieldErrors.email
                    ? "border-red-500 focus:border-red-400"
                    : "border-zinc-800 focus:border-amber-500"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${fieldErrors.password ? "text-red-400" : "text-zinc-500"}`} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="••••••••••••"
                className={`w-full pl-9 pr-10 py-2.5 bg-zinc-950 rounded-xl border text-white placeholder-zinc-500 text-sm focus:outline-none transition ${
                  fieldErrors.password
                    ? "border-red-500 focus:border-red-400"
                    : "border-zinc-800 focus:border-amber-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800 text-center space-y-2">
          <Link
            href="/?login=true"
            className="text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            &larr; Switch to Business Admin Login
          </Link>
          <p className="text-[11px] text-zinc-500">
            Partner by{" "}
            <a
              href="https://www.kodetri.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2"
            >
              Kodetri Technologies
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
