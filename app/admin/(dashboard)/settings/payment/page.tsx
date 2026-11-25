"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface PaymentSettingsData {
  isActive: boolean;
  mode: "test" | "live";
  testKeyId: string;
  testKeySecret: string;
  liveKeyId: string;
  liveKeySecret: string;
  currency: string;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettingsData>({
    isActive: true,
    mode: "test",
    testKeyId: "",
    testKeySecret: "",
    liveKeyId: "",
    liveKeySecret: "",
    currency: "INR",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("shaadi_super_admin_token")
        : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        const res = await fetch("/api/super-admin/payment-settings", {
          headers,
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings({
            isActive: data.settings.isActive ?? true,
            mode: data.settings.mode || "test",
            testKeyId: data.settings.testKeyId || "",
            testKeySecret: data.settings.testKeySecret || "",
            liveKeyId: data.settings.liveKeyId || "",
            liveKeySecret: data.settings.liveKeySecret || "",
            currency: data.settings.currency || "INR",
          });
        }
      } catch {
        setMessage({ type: "error", text: "Failed to load payment settings" });
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const headers = getAuthHeaders();
      const res = await fetch("/api/super-admin/payment-settings", {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Payment settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save settings" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong while saving" });
    } finally {
      setSaving(false);
    }
  };

  const isLive = settings.mode === "live";
  const currentKeyId = isLive ? settings.liveKeyId : settings.testKeyId;
  const currentKeySecret = isLive ? settings.liveKeySecret : settings.testKeySecret;

  const handleKeyIdChange = (val: string) => {
    if (isLive) {
      setSettings((prev) => ({ ...prev, liveKeyId: val }));
    } else {
      setSettings((prev) => ({ ...prev, testKeyId: val }));
    }
  };

  const handleKeySecretChange = (val: string) => {
    if (isLive) {
      setSettings((prev) => ({ ...prev, liveKeySecret: val }));
    } else {
      setSettings((prev) => ({ ...prev, testKeySecret: val }));
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <span>Payment Gateway (Razorpay)</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure your Razorpay Key ID and Secret for accepting payments.
        </p>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 border ${
            message.type === "success"
              ? "bg-emerald-950/60 text-emerald-200 border-emerald-800"
              : "bg-rose-950/60 text-rose-200 border-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Single Main Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSave} className="space-y-5">
          {/* 1. Mode Selection (Test vs Live) */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              Payment Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, mode: "test" }))}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                  !isLive
                    ? "bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500/30"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>🧪 Test Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, mode: "live" }))}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                  isLive
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>🚀 Live Mode</span>
              </button>
            </div>
          </div>

          {/* 2. Key ID Input */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Razorpay Key ID ({isLive ? "Live" : "Test"})
            </label>
            <input
              type="text"
              required
              placeholder={isLive ? "rzp_live_..." : "rzp_test_..."}
              value={currentKeyId}
              onChange={(e) => handleKeyIdChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs  placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* 3. Key Secret Input */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Razorpay Key Secret ({isLive ? "Live" : "Test"})
            </label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                required
                placeholder="Enter secret key"
                value={currentKeySecret}
                onChange={(e) => handleKeySecretChange(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs  placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer p-0.5"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
