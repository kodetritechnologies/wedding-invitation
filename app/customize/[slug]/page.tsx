"use client";

import { useEffect, useState, useRef, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Heart,
  MapPin,
  Palette,
  PartyPopper,
  User,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  Loader2,
  Check,
  X,
  ShoppingBag,
  Layers,
  Wifi,
  Signal,
  Edit3,
  Eye,
} from "lucide-react";
import { BRAND } from "@/lib/brand";

interface ManifestField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
}

interface ManifestDesignSetting {
  key: string;
  label: string;
  type: string;
  default?: string;
  options?: string[];
}

interface TemplateData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  format?: string;
  category?: string;
  price?: number;
  manifest?: {
    name: string;
    description?: string;
    customerFields?: ManifestField[];
    designSettings?: ManifestDesignSetting[];
  };
  designSettings?: Record<string, any>;
}

function TemplateCustomizeContent({ slug }: { slug: string }) {
  const router = useRouter();

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Editor form values (Dynamic from manifest)
  const [customerData, setCustomerData] = useState<Record<string, any>>({});
  const [designSettings, setDesignSettings] = useState<Record<string, any>>({});

  // UI State
  const [activeTab, setActiveTab] = useState<string>("couple");
  const [mobileViewMode, setMobileViewMode] = useState<"edit" | "preview">("edit");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewSynced, setPreviewSynced] = useState(true);

  // Auth / Save modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [savingProject, setSavingProject] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // 1. Fetch template metadata
  useEffect(() => {
    async function loadTemplate() {
      try {
        setLoading(true);
        setLoadError("");

        const res = await fetch(`/api/templates/${slug}`);
        const data = await res.json();

        if (!res.ok || !data.success || !data.template) {
          throw new Error(data.error || "Template not found");
        }

        const t: TemplateData = data.template;
        setTemplate(t);

        // Check for draft in localStorage
        const draftKey = `shaadi_draft_${slug}`;
        let initialData: Record<string, any> = {};
        let initialDesign: Record<string, any> = {};

        try {
          const savedDraft = localStorage.getItem(draftKey);
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            if (parsed.customerData) initialData = parsed.customerData;
            if (parsed.designSettings) initialDesign = parsed.designSettings;
          }
        } catch {
          // Ignore localStorage parse error
        }

        // Initialize dynamic fields purely from manifest customerFields
        const defaults: Record<string, any> = {};

        if (t.manifest?.customerFields && Array.isArray(t.manifest.customerFields)) {
          for (const f of t.manifest.customerFields) {
            if (initialData[f.key] !== undefined) {
              defaults[f.key] = initialData[f.key];
            } else if (f.defaultValue !== undefined && f.defaultValue !== "") {
              defaults[f.key] = f.defaultValue;
            } else if (f.placeholder) {
              defaults[f.key] = f.placeholder;
            } else if (f.key === "brideName") {
              defaults[f.key] = "Priya Verma";
            } else if (f.key === "groomName") {
              defaults[f.key] = "Rahul Sharma";
            } else if (f.key === "weddingDate") {
              defaults[f.key] = "2027-02-14";
            } else if (f.key === "venue" || f.key === "venueName") {
              defaults[f.key] = "Grand Heritage Palace";
            } else if (f.key === "city" || f.key === "venueCity") {
              defaults[f.key] = "Indore";
            } else {
              defaults[f.key] = "";
            }
          }
        } else {
          // Fallback if no manifest customerFields defined
          defaults.groomName = initialData.groomName || "Rahul Sharma";
          defaults.brideName = initialData.brideName || "Priya Verma";
          defaults.weddingDate = initialData.weddingDate || "2027-02-14";
          defaults.venue = initialData.venue || "Grand Heritage Palace";
          defaults.city = initialData.city || "Indore";
        }

        setCustomerData(defaults);

        // Initialize designSettings from manifest
        const initialStyles: Record<string, any> = {
          ...(t.designSettings || {}),
          ...initialDesign,
        };

        if (t.manifest?.designSettings && Array.isArray(t.manifest.designSettings)) {
          for (const ds of t.manifest.designSettings) {
            if (initialDesign[ds.key] !== undefined) {
              initialStyles[ds.key] = initialDesign[ds.key];
            } else if (ds.default) {
              initialStyles[ds.key] = ds.default;
            }
          }
        }

        setDesignSettings(initialStyles);

        // Fetch initial preview
        fetchPreview(t.slug, defaults, initialStyles);
      } catch (err: any) {
        setLoadError(err.message || "Failed to load template");
      } finally {
        setLoading(false);
      }
    }

    loadTemplate();
  }, [slug]);

  // Fetch updated preview HTML from server
  const fetchPreview = async (
    templateSlug: string,
    data: Record<string, any>,
    styles: Record<string, any>
  ) => {
    try {
      setPreviewLoading(true);
      const res = await fetch(`/api/public/templates/${templateSlug}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerData: data,
          designSettings: styles,
        }),
      });

      if (res.ok) {
        const html = await res.text();
        setPreviewHtml(html);
        setPreviewSynced(true);
      } else {
        const errText = await res.text();
        console.error("Preview render returned status:", res.status, errText);
      }
    } catch (e) {
      console.error("Preview render failed:", e);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Debounced auto-preview & localStorage sync on user input
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!template) return;

    setPreviewSynced(false);

    // Save to localStorage draft
    try {
      localStorage.setItem(
        `shaadi_draft_${slug}`,
        JSON.stringify({ customerData, designSettings })
      );
    } catch {
      // Ignore storage quota
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchPreview(template.slug, customerData, designSettings);
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [customerData, designSettings, template, slug]);

  const handleFieldChange = (key: string, value: any) => {
    setCustomerData((prev) => ({
      ...prev,
      [key]: value,
      // Keep aliases in sync if either exists
      ...(key === "venue" ? { venueName: value } : {}),
      ...(key === "venueName" ? { venue: value } : {}),
      ...(key === "city" ? { venueCity: value } : {}),
      ...(key === "venueCity" ? { city: value } : {}),
    }));
  };

  const handleStyleChange = (key: string, value: any) => {
    setDesignSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Dynamic categorizer for fields
  const categorizeField = (field: ManifestField): "couple" | "venue" | "ceremonies" | "custom" => {
    const k = field.key.toLowerCase();
    const l = field.label.toLowerCase();

    if (
      k.includes("venue") ||
      k.includes("address") ||
      k.includes("city") ||
      k.includes("location") ||
      k.includes("map") ||
      l.includes("venue") ||
      l.includes("location") ||
      l.includes("city") ||
      l.includes("address")
    ) {
      return "venue";
    }

    if (
      k.includes("haldi") ||
      k.includes("mehndi") ||
      k.includes("sangeet") ||
      k.includes("jaimala") ||
      k.includes("varmala") ||
      k.includes("phera") ||
      k.includes("phere") ||
      k.includes("pujan") ||
      k.includes("reception") ||
      k.includes("ceremony") ||
      l.includes("ceremony") ||
      l.includes("rasam") ||
      l.includes("muhurat")
    ) {
      return "ceremonies";
    }

    if (
      k.includes("groom") ||
      k.includes("bride") ||
      k.includes("date") ||
      k.includes("time") ||
      k.includes("quote") ||
      k.includes("story") ||
      k.includes("message") ||
      k.includes("photo") ||
      k.includes("couple") ||
      l.includes("groom") ||
      l.includes("bride") ||
      l.includes("couple")
    ) {
      return "couple";
    }

    return "custom";
  };

  const allFields: ManifestField[] = template?.manifest?.customerFields || [];
  const coupleFields = allFields.filter((f) => categorizeField(f) === "couple");
  const venueFields = allFields.filter((f) => categorizeField(f) === "venue");
  const ceremonyFields = allFields.filter((f) => categorizeField(f) === "ceremonies");
  const customFields = allFields.filter((f) => categorizeField(f) === "custom");
  const designSettingList = template?.manifest?.designSettings || [];

  // Determine available tabs dynamically
  const availableTabs: { id: string; label: string; icon: any; count: number }[] = [];

  if (coupleFields.length > 0) {
    availableTabs.push({ id: "couple", label: "Couple & Date", icon: Heart, count: coupleFields.length });
  }
  if (venueFields.length > 0) {
    availableTabs.push({ id: "venue", label: "Venue & Map", icon: MapPin, count: venueFields.length });
  }
  if (ceremonyFields.length > 0) {
    availableTabs.push({ id: "ceremonies", label: "Ceremonies", icon: PartyPopper, count: ceremonyFields.length });
  }
  if (customFields.length > 0) {
    availableTabs.push({ id: "custom", label: "Other Details", icon: Layers, count: customFields.length });
  }
  if (designSettingList.length > 0) {
    availableTabs.push({ id: "style", label: "Colors & Style", icon: Palette, count: designSettingList.length });
  }

  // Ensure activeTab is valid
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.some((t) => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  // Save / Publish Invitation flow
  const handleSaveClick = async () => {
    const token = localStorage.getItem("shaadi_auth_token") || localStorage.getItem("token");

    if (!token) {
      // Guest user -> Open auth modal to register / login without losing edits
      setShowAuthModal(true);
      return;
    }

    // Authenticated user -> Save wedding directly
    await createWeddingProject(token);
  };

  const createWeddingProject = async (authToken: string) => {
    if (!template) return;
    setSavingProject(true);
    setSaveSuccessMsg("");

    try {
      const payload = {
        title: `${customerData.groomName || "Groom"} & ${customerData.brideName || "Bride"} Wedding`,
        brideName: customerData.brideName || "Bride",
        groomName: customerData.groomName || "Groom",
        weddingDate: customerData.weddingDate || new Date().toISOString().split("T")[0],
        venue: customerData.venue || customerData.venueName || "Heritage Grand Palace",
        city: customerData.city || customerData.venueCity || "Indore",
        templateId: template._id,
        templateContent: customerData,
        story: customerData.story || customerData.weddingQuote || "",
        familyMessage: customerData.familyMessage || "",
        packageTier: "basic",
      };

      const res = await fetch("/api/admin/weddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save invitation");
      }

      // Clear draft after successful creation
      localStorage.removeItem(`shaadi_draft_${slug}`);

      setSaveSuccessMsg("Your wedding invitation has been saved successfully!");
      setTimeout(() => {
        router.push(`/dashboard/weddings/${data.wedding._id}`);
      }, 1200);
    } catch (err: any) {
      alert(err.message || "Failed to save wedding project");
    } finally {
      setSavingProject(false);
    }
  };

  // Auth Modal Submit Handler (Register or Login)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "register") {
        if (!authName.trim()) throw new Error("Please enter your name");
        if (!authPhone.trim()) throw new Error("Please enter your WhatsApp phone number");
        if (!authEmail.trim()) throw new Error("Please enter your email");
        if (authPassword.length < 6) throw new Error("Password must be at least 6 characters");

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: authName.trim(),
            email: authEmail.trim(),
            phone: authPhone.trim(),
            password: authPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Registration failed");
        }

        const token = data.token;
        if (token) {
          localStorage.setItem("shaadi_auth_token", token);
          localStorage.setItem("token", token);
        }

        setShowAuthModal(false);
        await createWeddingProject(token);
      } else {
        if (!authEmail.trim()) throw new Error("Please enter your email");
        if (!authPassword) throw new Error("Please enter your password");

        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authEmail.trim(),
            password: authPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Invalid email or password");
        }

        const token = data.token;
        if (token) {
          localStorage.setItem("shaadi_auth_token", token);
          localStorage.setItem("token", token);
        }

        setShowAuthModal(false);
        await createWeddingProject(token);
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // Dynamic Input Component for any Manifest Field
  const renderFieldInput = (field: ManifestField) => {
    const val = customerData[field.key] ?? field.defaultValue ?? "";

    if (field.type === "textarea") {
      return (
        <textarea
          rows={3}
          value={val}
          placeholder={field.placeholder || `Enter ${field.label}...`}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          className="w-full px-3 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#7A0E1A] focus:bg-white focus:ring-2 focus:ring-[#7A0E1A]/10 transition resize-none"
        />
      );
    }

    if (field.type === "select" && Array.isArray(field.options) && field.options.length > 0) {
      return (
        <select
          value={val}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          className="w-full px-3 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#7A0E1A] focus:bg-white focus:ring-2 focus:ring-[#7A0E1A]/10 transition"
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    const inputType =
      field.type === "date"
        ? "date"
        : field.type === "time"
        ? "time"
        : field.type === "number"
        ? "number"
        : field.type === "url" || field.type === "image"
        ? "url"
        : "text";

    return (
      <input
        type={inputType}
        value={val}
        placeholder={field.placeholder || `Enter ${field.label}...`}
        onChange={(e) => handleFieldChange(field.key, e.target.value)}
        className="w-full px-3 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#7A0E1A] focus:bg-white focus:ring-2 focus:ring-[#7A0E1A]/10 transition"
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 text-stone-800 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-[#5C0612] text-amber-300 flex items-center justify-center shadow-lg mb-4">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl  font-bold text-[#3D0A0E]">
          Loading Design Studio...
        </h2>
        <p className="text-xs text-stone-500 mt-1">Preparing your wedding template live customizer</p>
      </div>
    );
  }

  if (loadError || !template) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center text-stone-800 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs mb-3">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl  font-bold text-stone-900">Template Not Found</h1>
        <p className="text-stone-600 text-sm max-w-md mt-1 mb-6">
          {loadError || "The requested template does not exist or may have been unlisted."}
        </p>
        <Link
          href="/templates"
          className="px-6 py-2.5 bg-[#7A0E1A] hover:bg-[#5C0612] text-amber-200 font-bold rounded-xl text-xs shadow-md transition"
        >
          Explore All Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] w-full max-w-full overflow-hidden flex flex-col bg-[#FAF7F2] text-stone-900 font-sans select-none">
      {/* ═════════════════════════════════════════════════════════
          TOP AUSPICIOUS STRIP (Matches Website Brand)
      ═════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-amber-50 text-[11px] sm:text-xs py-1 px-4 text-center font-sans flex items-center justify-center gap-2 shadow-inner font-medium shrink-0">
        <span>✦ {BRAND.name} • Live Wedding Invitation Customizer Studio ✦</span>
      </div>

      {/* ═════════════════════════════════════════════════════════
          MAIN HEADER BAR (Matches Website Public Header)
      ═════════════════════════════════════════════════════════ */}
      <header className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-3 sm:px-6 flex items-center justify-between z-20 shadow-xs">
        {/* Left: Brand / Back & Template Name */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/templates"
            className="flex items-center gap-1.5 text-stone-700 hover:text-[#5C0612] text-xs font-semibold py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 transition border border-stone-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Designs</span>
          </Link>

          <div className="h-5 w-[1px] bg-stone-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#5C0612] text-amber-300  font-bold text-xs flex items-center justify-center shadow-xs">
              V
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm  font-bold text-[#3D0A0E] truncate max-w-[130px] sm:max-w-xs md:max-w-md">
                  {template.name}
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
                  ₹{template.price || 499}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hidden md:inline">
                  Live Customizer
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-medium hidden sm:block">
                Edit details below &amp; preview live in real time
              </p>
            </div>
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setPreviewDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              previewDevice === "mobile"
                ? "bg-white text-[#5C0612] font-bold shadow-xs border border-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-700" />
            <span>Mobile Phone</span>
          </button>
          <button
            onClick={() => setPreviewDevice("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              previewDevice === "tablet"
                ? "bg-white text-[#5C0612] font-bold shadow-xs border border-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Tablet className="w-3.5 h-3.5 text-amber-700" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setPreviewDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              previewDevice === "desktop"
                ? "bg-white text-[#5C0612] font-bold shadow-xs border border-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-amber-700" />
            <span>Fullscreen</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Sync Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200">
            {previewLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span className="text-amber-700 font-medium text-[11px]">Syncing...</span>
              </>
            ) : previewSynced ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-medium text-[11px]">Live Auto-Sync</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-stone-500 text-[11px]">Updating...</span>
              </>
            )}
          </div>

          <a
            href={`/api/public/templates/${template.slug}/preview`}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 text-xs text-stone-700 hover:text-[#5C0612] font-medium px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 transition"
            title="Open preview in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>New Tab</span>
          </a>

          {/* Primary Buy Now / Save Button */}
          <button
            onClick={handleSaveClick}
            disabled={savingProject}
            className="flex items-center gap-1.5 px-3 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-amber-50 font-bold text-xs sm:text-sm shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {savingProject ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-amber-200" />
            )}
            <span className="hidden sm:inline">Buy Now</span>
            <span className="sm:hidden">Buy Now</span>
          </button>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════
          MAIN WORKSPACE: Responsive Layout
      ═════════════════════════════════════════════════════════ */}
      {/* Mobile View Toggle Bar (Only visible on screens < md) */}
      <div className="md:hidden flex items-center bg-stone-100 p-1 mx-3 mt-2 mb-1 rounded-xl border border-stone-200/90 shrink-0 z-20">
        <button
          type="button"
          onClick={() => setMobileViewMode("edit")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            mobileViewMode === "edit"
              ? "bg-[#5C0612] text-amber-200 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Customize Details ({allFields.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileViewMode("preview")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            mobileViewMode === "preview"
              ? "bg-[#5C0612] text-amber-200 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-rose-400" />
          <span>Live Card Preview</span>
          {previewSynced && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        {/* ── LEFT PANEL: DYNAMIC CUSTOMIZATION CONTROLS ── */}
        <aside
          className={`w-full md:w-[390px] lg:w-[450px] xl:w-[490px] shrink-0 bg-white border-r border-stone-200/90 flex-col h-full z-10 shadow-xs min-h-0 ${
            mobileViewMode === "edit" ? "flex flex-1 md:flex-initial" : "hidden md:flex"
          }`}
        >
          {/* Dynamic Navigation Tabs (Only shows categories that exist in this template) */}
          <div className="flex items-center border-b border-stone-200 bg-[#FFFDF9] px-2.5 py-2 shrink-0 overflow-x-auto no-scrollbar gap-1.5">
            {availableTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? "bg-[#5C0612] text-amber-200 shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <IconComponent
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-amber-300" : "text-stone-500"
                    }`}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full  ${
                      isActive ? "bg-black/25 text-amber-100" : "bg-stone-200/70 text-stone-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form Fields Area: Rendered Dynamically From Manifest */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF7F2] select-text custom-scrollbar">
            {/* Dynamic Intro Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs text-amber-900 leading-relaxed shadow-2xs">
              Personalize the details below. Your card preview on the right updates automatically as you type.
            </div>

            {/* ════ TAB 1: COUPLE & DATE ════ */}
            {activeTab === "couple" && coupleFields.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C0612] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                    <span>Couple &amp; Auspicious Details</span>
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {coupleFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700 block">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {renderFieldInput(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ TAB 2: VENUE & LOCATION ════ */}
            {activeTab === "venue" && venueFields.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C0612] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>Venue &amp; GPS Location</span>
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {venueFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700 block">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {renderFieldInput(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ TAB 3: CEREMONIES & FUNCTIONS ════ */}
            {activeTab === "ceremonies" && ceremonyFields.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C0612] flex items-center gap-1.5">
                    <PartyPopper className="w-3.5 h-3.5 text-purple-600" />
                    <span>Ceremonies &amp; Timings</span>
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {ceremonyFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700 block">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {renderFieldInput(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ TAB 4: OTHER CUSTOM FIELDS ════ */}
            {activeTab === "custom" && customFields.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C0612] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Additional Details</span>
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {customFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700 block">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {renderFieldInput(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ TAB 5: COLORS & STYLE (Dynamic From Manifest DesignSettings) ════ */}
            {activeTab === "style" && designSettingList.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C0612] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Theme Styling &amp; Colors</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {designSettingList.map((ds) => {
                    const val = designSettings[ds.key] ?? ds.default ?? "";

                    if (ds.type === "color") {
                      return (
                        <div
                          key={ds.key}
                          className="space-y-1.5 bg-stone-50/80 p-3 rounded-xl border border-stone-200"
                        >
                          <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                            <span>{ds.label}</span>
                            <span className="text-[11px]  text-amber-800">{val}</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={val}
                              onChange={(e) => handleStyleChange(ds.key, e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                            />
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => handleStyleChange(ds.key, e.target.value)}
                              className="flex-1 px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs  text-stone-800"
                            />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={ds.key}
                        className="space-y-1.5 bg-stone-50/80 p-3 rounded-xl border border-stone-200"
                      >
                        <label className="text-xs font-bold text-stone-700">{ds.label}</label>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleStyleChange(ds.key, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar inside Left Panel */}
          <div className="p-3.5 bg-white border-t border-stone-200 flex items-center justify-between text-xs gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileViewMode("preview")}
              className="md:hidden flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#5C0612] font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-200 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-rose-600" />
              <span>See Live Preview</span>
            </button>
            <span className="hidden md:inline text-stone-500 text-[11px]">
              Edits automatically saved in browser draft
            </span>
            <button
              onClick={handleSaveClick}
              disabled={savingProject}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#7A0E1A] hover:bg-[#5C0612] text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </aside>

        {/* ── RIGHT PANEL: INTERACTIVE LIVE PREVIEW CANVAS ── */}
        <main
          className={`flex-1 bg-[#F5EFE6] relative flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden min-h-0 ${
            mobileViewMode === "preview" ? "flex h-full w-full !p-0" : "hidden md:flex"
          }`}
        >
          {/* Subtle Royal Damask / Warm Ambient Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none" />

          {/* MOBILE VIEWPORT ONLY (< md): Clean full-size screen with floating button */}
          <div className="md:hidden w-full h-full flex flex-col relative bg-stone-950 overflow-hidden">
            {previewHtml ? (
              <iframe
                title="Wedding Invitation Mobile Live Preview"
                srcDoc={previewHtml}
                className="w-full h-full border-0 bg-stone-950"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-300">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
                <span className="text-xs">Generating live interactive preview...</span>
              </div>
            )}

            {/* Floating Switch Back Button on Mobile */}
            <button
              type="button"
              onClick={() => setMobileViewMode("edit")}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-[#5C0612]/95 hover:bg-[#45040d] text-amber-200 font-bold text-xs shadow-xl backdrop-blur-md flex items-center gap-2 z-30 transition border border-amber-500/30 cursor-pointer active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>Back to Customize Details</span>
            </button>
          </div>

          {/* DESKTOP/TABLET (>= md): Authentic Device Mockup Showcase */}
          <div className="hidden md:flex flex-col items-center justify-center w-full h-full p-2 relative overflow-hidden">
            {/* MOBILE DEVICE (Ultra-Realistic iPhone 16 Pro Mockup - Auto-Responsive Fit) */}
            {previewDevice === "mobile" && (
              <div
                className="relative transition-all duration-300 ease-out select-none shrink-0 max-w-full my-auto"
                style={{
                  height: "min(560px, calc(100vh - 170px))",
                  maxHeight: "calc(100% - 24px)",
                  aspectRatio: "9 / 18.5",
                }}
              >
              {/* Physical Titanium Side Buttons */}
              <div className="w-[3px] h-6 bg-[#3A3A3E] rounded-l-xs absolute -left-[3px] top-20 shadow-xs" />
              <div className="w-[3px] h-10 bg-[#3A3A3E] rounded-l-xs absolute -left-[3px] top-29 shadow-xs" />
              <div className="w-[3px] h-10 bg-[#3A3A3E] rounded-l-xs absolute -left-[3px] top-42 shadow-xs" />
              <div className="w-[3px] h-14 bg-[#3A3A3E] rounded-r-xs absolute -right-[3px] top-28 shadow-xs" />

              {/* Outer Titanium Chassis with Metallic Edge Gradient & Deep Drop Shadow */}
              <div className="w-full h-full rounded-[44px] p-[3px] bg-gradient-to-b from-[#48484E] via-[#242428] to-[#161618] shadow-[0_20px_50px_-12px_rgba(30,10,10,0.35),0_10px_20px_-8px_rgba(0,0,0,0.2)] ring-1 ring-white/10 flex flex-col relative">
                {/* Inner Black Bezel */}
                <div className="w-full h-full rounded-[41px] p-[6px] bg-black ring-1 ring-black/90 flex flex-col overflow-hidden relative">
                  {/* Active Screen Display */}
                  <div className="w-full h-full rounded-[35px] overflow-hidden relative bg-[#0A0505] flex flex-col">
                    {/* Top Status Bar with Dynamic Island */}
                    <div className="absolute top-0 left-0 right-0 h-8 z-30 flex items-center justify-between px-5 pointer-events-none select-none bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                      {/* Left: Time */}
                      <span className="text-[11px] font-semibold text-white/95 tracking-tight font-sans pl-1">
                        9:41
                      </span>

                      {/* Center: Dynamic Island */}
                      <div className="w-[84px] h-[20px] bg-black rounded-full flex items-center justify-between px-2 shadow-sm ring-1 ring-white/10">
                        <div className="w-2 h-2 rounded-full bg-[#060D1E] ring-1 ring-[#15233E]/70 flex items-center justify-center">
                          <div className="w-0.5 h-0.5 rounded-full bg-[#1A3868]" />
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#09090C] ring-1 ring-stone-900" />
                      </div>

                      {/* Right: Network & Battery */}
                      <div className="flex items-center gap-1.5 text-white/95 pr-1">
                        <Signal className="w-3 h-3" />
                        <Wifi className="w-3 h-3" />
                        <div className="w-4 h-2 rounded-[3px] border border-white/90 p-[1px] flex items-center">
                          <div className="w-full h-full bg-white rounded-[1.5px]" />
                        </div>
                      </div>
                    </div>

                    {/* Iframe Viewport Area */}
                    <div className="w-full h-full pt-7 pb-3 overflow-hidden relative">
                      {previewHtml ? (
                        <iframe
                          title="Wedding Invitation Live Preview"
                          srcDoc={previewHtml}
                          className="w-full h-full border-0 bg-stone-950"
                          sandbox="allow-scripts allow-same-origin allow-popups"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-300">
                          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
                          <span className="text-xs">Generating live interactive preview...</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Home Indicator Bar */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-[3.5px] bg-white/40 backdrop-blur-md rounded-full z-30 pointer-events-none" />

                    {/* Glass Glare Reflection Sheen */}
                    <div className="absolute -top-32 -left-28 w-80 h-96 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-full rotate-25 pointer-events-none z-20" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TABLET DEVICE (iPad Pro Mockup - Auto-Responsive Fit) */}
          {previewDevice === "tablet" && (
            <div
              className="relative transition-all duration-300 ease-out select-none shrink-0 max-w-full my-auto"
              style={{
                height: "min(540px, calc(100vh - 170px))",
                maxHeight: "calc(100% - 24px)",
                width: "min(640px, calc((100vh - 170px) * 1.25))",
                maxWidth: "94%",
              }}
            >
              <div className="w-full h-full rounded-[34px] p-[3px] bg-gradient-to-b from-[#4A4A50] via-[#2A2A2E] to-[#1C1C1E] shadow-[0_20px_50px_-12px_rgba(30,10,10,0.35),0_10px_20px_-8px_rgba(0,0,0,0.2)] ring-1 ring-white/10 flex flex-col relative">
                <div className="w-full h-full rounded-[31px] p-[8px] bg-black ring-1 ring-black/90 flex flex-col overflow-hidden relative">
                  <div className="w-full h-full rounded-[23px] overflow-hidden relative bg-[#0A0505] flex flex-col">
                    <div className="absolute top-0 left-0 right-0 h-7 z-30 flex items-center justify-between px-6 pointer-events-none select-none bg-gradient-to-b from-black/80 via-black/35 to-transparent">
                      <span className="text-[11px] font-semibold text-white/90 pl-1 font-sans">9:41 AM</span>
                      <div className="w-2 h-2 rounded-full bg-[#060D1E] ring-1 ring-[#15233E]/70" />
                      <div className="flex items-center gap-1.5 text-white/90 pr-1">
                        <Signal className="w-3 h-3" />
                        <Wifi className="w-3 h-3" />
                        <div className="w-4 h-2 rounded-[3px] border border-white/90 p-[1px] flex items-center">
                          <div className="w-full h-full bg-white rounded-[1.5px]" />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-full pt-6 pb-3 overflow-hidden relative">
                      {previewHtml ? (
                        <iframe
                          title="Wedding Invitation Live Preview"
                          srcDoc={previewHtml}
                          className="w-full h-full border-0 bg-stone-950"
                          sandbox="allow-scripts allow-same-origin allow-popups"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-300">
                          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
                          <span className="text-xs">Generating live interactive preview...</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-[3.5px] bg-white/40 backdrop-blur-md rounded-full z-30 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESKTOP BROWSER (macOS Safari Mockup - Auto-Responsive Fit) */}
          {previewDevice === "desktop" && (
            <div
              className="w-full max-w-5xl rounded-2xl border border-stone-300/90 bg-white overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.22)] flex flex-col transition-all duration-300 shrink-0 my-auto"
              style={{
                height: "min(540px, calc(100vh - 170px))",
                maxHeight: "calc(100% - 24px)",
              }}
            >
              <div className="h-9 bg-stone-100/95 border-b border-stone-200 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-2xs" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-2xs" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-2xs" />
                </div>
                <div className="px-5 py-0.5 bg-white border border-stone-200/90 rounded-lg text-xs  text-stone-600 flex items-center gap-2 shadow-2xs">
                  <span className="text-emerald-600 text-[10px]">🔒</span>
                  <span className="truncate max-w-xs text-[11px]">vivahvaani.com/invitation/{template.slug}</span>
                </div>
                <div className="w-16" />
              </div>

              <div className="w-full flex-1 overflow-hidden relative">
                {previewHtml ? (
                  <iframe
                    title="Wedding Invitation Live Preview"
                    srcDoc={previewHtml}
                    className="w-full h-full border-0 bg-stone-950"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-300">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
                    <span className="text-xs">Generating live interactive preview...</span>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════
          AUTH MODAL: Save Without Losing Customized Edits
      ═════════════════════════════════════════════════════════ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div
            className="fixed inset-0"
            onClick={() => setShowAuthModal(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-[#FFFDF9] text-stone-900 rounded-3xl shadow-2xl border border-stone-200/90 p-6 sm:p-7 space-y-4 z-10 overflow-hidden font-sans">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-rose-700 to-amber-600" />

            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#5C0612] text-amber-300 flex items-center justify-center shadow-md mb-2">
                <Sparkles className="w-6 h-6 fill-amber-300" />
              </div>
              <h2 className="text-xl  font-bold text-[#3D0A0E]">
                Save Your Customized Invitation
              </h2>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                All your customized details are preserved! Sign in or register to publish and share on WhatsApp.
              </p>
            </div>

            {/* Template Order & Pricing Summary */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 flex items-center justify-between text-left">
              <div>
                <p className="text-xs font-bold text-stone-900">{template.name}</p>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fixed Price &bull; Zero Subscription</span>
                </p>
                <p className="text-[10px] text-stone-500 mt-0.5">Includes 1-Year Live Hosting, RSVP &amp; Maps</p>
              </div>
              <div className="text-right pl-3 shrink-0">
                <span className="text-base  font-bold text-[#5C0612] block">
                  ₹{template.price || 499}
                </span>
                <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  authMode === "register"
                    ? "bg-white text-[#5C0612] shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Create Free Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  authMode === "login"
                    ? "bg-white text-[#5C0612] shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === "register" && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#7A0E1A] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      WhatsApp Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="tel"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="10-digit WhatsApp number"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#7A0E1A] focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#7A0E1A] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#7A0E1A] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7A0E1A] to-[#A31621] hover:from-[#650B15] hover:to-[#8E131C] text-amber-200 font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {authMode === "register"
                    ? "Create Account & Buy Now"
                    : "Sign In & Buy Now"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          SUCCESS TOAST MODAL
      ═════════════════════════════════════════════════════════ */}
      {saveSuccessMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-3 shadow-2xl border border-stone-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg  font-bold text-stone-900">Saved Successfully!</h3>
            <p className="text-xs text-stone-600">{saveSuccessMsg}</p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-800 font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to your dashboard...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCustomizeWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <TemplateCustomizeContent slug={slug} />;
}

export default function TemplateCustomizePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-900 text-amber-100">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <TemplateCustomizeWrapper params={params} />
    </Suspense>
  );
}
