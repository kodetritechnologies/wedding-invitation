"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import WishlistButton from "@/components/templates/WishlistButton";
import {
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  MapPin,
  Users,
  Clock,
  Share2,
  Music,
  ShoppingBag,
  Pencil,
  ShieldCheck,
  Headphones,
  Zap,
  Gift,
  X,
  Check,
  ArrowRight,
} from "lucide-react";

interface TemplateDetailData {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  category: string;
  format?: string;
  price?: number;
  likesCount?: number;
  isDefault?: boolean;
  manifest?: any;
  designSettings?: any;
  createdAt?: string;
}

function TemplateDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = use(paramsPromise);

  const [template, setTemplate] = useState<TemplateDetailData | null>(null);
  const [similarTemplates, setSimilarTemplates] = useState<TemplateDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "faq">("features");

  // Buy Now modal state
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load single template
        const res = await fetch(`/api/templates/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.template) {
            setTemplate(data.template);

            // Fetch other templates for "Similar Templates"
            try {
              const allRes = await fetch(
                `/api/templates?category=${encodeURIComponent(data.template.category || "wedding")}`
              );
              if (allRes.ok) {
                const allData = await allRes.json();
                if (allData.success && Array.isArray(allData.templates)) {
                  setSimilarTemplates(
                    allData.templates
                      .filter((t: any) => t.slug !== slug)
                      .slice(0, 3)
                  );
                }
              }
            } catch {
              // ignore
            }
          } else {
            setTemplate(null);
          }
        } else {
          setTemplate(null);
        }
      } catch {
        setTemplate(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const handleDummyBuy = () => {
    setBuying(true);
    setTimeout(() => {
      setBuying(false);
      setBuySuccess(true);
    }, 1200);
  };

  const previewUrl = `/api/public/templates/${encodeURIComponent(slug)}/preview`;
  const customizeUrl = `/customize/${encodeURIComponent(slug)}`;
  const price = template?.price || 499;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between">
        <PublicHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-[#720E16] border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 animate-spin text-[#720E16]" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-800">
            Loading Invitation Design...
          </h2>
          <p className="text-xs text-stone-500 mt-1.5">
            Setting up interactive live preview and wedding motifs
          </p>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between">
        <PublicHeader />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Template Not Found
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            The wedding template you are looking for does not exist or has been unpublished.
          </p>
          <div className="pt-2">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#720E16] text-[#FFF3DA] text-xs font-bold shadow-md hover:bg-[#5A0910] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Templates</span>
            </Link>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const deviceWidths = {
    mobile: "max-w-[375px]",
    tablet: "max-w-[620px]",
    desktop: "max-w-full",
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Top Breadcrumb & Back Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2 text-stone-500">
            <Link href="/" className="hover:text-[#720E16] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/templates" className="hover:text-[#720E16] transition">
              Templates
            </Link>
            <span>/</span>
            <Link
              href={`/templates?category=${encodeURIComponent(template.category || "wedding")}`}
              className="capitalize hover:text-[#720E16] transition"
            >
              {template.category || "Wedding"}
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-bold truncate max-w-[200px]">
              {template.name}
            </span>
          </div>

          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#720E16] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Designs</span>
          </Link>
        </div>

        {/* MAIN 2-COLUMN HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: INTERACTIVE PREVIEW VIEWER (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Viewport Controls Bar */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeviceView("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    deviceView === "mobile"
                      ? "bg-white text-[#720E16] shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("tablet")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    deviceView === "tablet"
                      ? "bg-white text-[#720E16] shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                  title="Tablet View (620px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    deviceView === "desktop"
                      ? "bg-white text-[#720E16] shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                  title="Desktop View (Full)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Full</span>
                </button>
              </div>

              {/* Open in New Tab Button */}
              <Link
                href={previewUrl}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:text-[#720E16] hover:bg-stone-50 border border-stone-200 transition cursor-pointer"
              >
                <span>Live Fullscreen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Device Mockup Frame Container */}
            <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-stone-800 flex justify-center items-center min-h-[620px] sm:min-h-[700px] overflow-hidden relative">
              {/* Subtle Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Viewport Frame */}
              <div
                className={`w-full ${deviceWidths[deviceView]} transition-all duration-300 relative`}
              >
                {deviceView === "mobile" && (
                  /* Mobile Speaker & Camera Notch Bar */
                  <div className="w-full bg-[#1A1A1A] rounded-t-3xl pt-2 pb-1.5 flex justify-center items-center gap-2 border-t border-x border-stone-700">
                    <div className="w-10 h-1 bg-stone-700 rounded-full" />
                    <div className="w-2 h-2 rounded-full bg-stone-700" />
                  </div>
                )}

                <div
                  className={`bg-white shadow-2xl overflow-hidden border border-stone-700 ${
                    deviceView === "mobile"
                      ? "rounded-b-3xl h-[620px] sm:h-[680px]"
                      : deviceView === "tablet"
                      ? "rounded-2xl h-[640px] sm:h-[700px]"
                      : "rounded-2xl h-[640px] sm:h-[700px]"
                  }`}
                >
                  <iframe
                    src={previewUrl}
                    title={`${template.name} Live Demo`}
                    className="w-full h-full border-0 select-none bg-stone-900"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1.5">
              <span>✦</span>
              <span>Interactive preview — scroll inside to test RSVP, Music &amp; Maps</span>
              <span>✦</span>
            </p>
          </div>

          {/* RIGHT COLUMN: DETAILS, PRICING & BUY ACTIONS (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Main Header & Wishlist Row */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#720E16] uppercase">
                    {template.category || "Wedding"} Invitation
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                    {template.name}
                  </h1>
                </div>

                {/* WISHLIST / LIKE BUTTON WITH LIVE COUNT */}
                <div className="shrink-0 pt-1">
                  <WishlistButton
                    slug={template.slug}
                    initialCount={template.likesCount || 0}
                    size="md"
                    className="px-3.5 py-1.5 bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200/80 shadow-2xs"
                  />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed font-sans">
                {template.description ||
                  "Auspicious royal digital invitation website crafted with traditional motifs, turn-by-turn Google Maps venue navigation, RSVP headcount management, and 1-click WhatsApp guest sharing."}
              </p>

              {/* Price Banner - Single Clean Price */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF4EB] to-[#F5ECE0] border border-[#EADBCE] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-stone-600">
                    Direct Fixed Price &bull; No Subscription
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#720E16]">
                    ₹{price}
                  </div>
                </div>

                <div className="text-right text-[11px] text-stone-500 space-y-0.5">
                  <div className="font-semibold text-stone-800 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lifetime Hosting</span>
                  </div>
                  <div>Unlimited Guests</div>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* BUY NOW BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setBuyModalOpen(true);
                    setBuySuccess(false);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-amber-50 font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-200" />
                  <span>Buy Now &bull; ₹{price}</span>
                </button>

                {/* CUSTOMIZE LIVE BUTTON */}
                <Link
                  href={customizeUrl}
                  className="w-full py-3 px-5 rounded-2xl bg-[#720E16] hover:bg-[#5A0910] text-[#FFF3DA] font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Customize with Bride &amp; Groom Names</span>
                </Link>

                {/* PREVIEW IN NEW TAB */}
                <Link
                  href={previewUrl}
                  target="_blank"
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-stone-200 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
                  <span>Open Fullscreen Demo in New Tab</span>
                </Link>
              </div>

              {/* Trust Guarantees */}
              <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Instant Link Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Privacy Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>WhatsApp 1-Click Share</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-[#720E16] shrink-0" />
                  <span>Indore Studio Assistance</span>
                </div>
              </div>
            </div>

            {/* FEATURES ACCORDION / TABS */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
              {/* Tab Header */}
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("features")}
                  className={`text-xs font-bold pb-1 transition cursor-pointer ${
                    activeTab === "features"
                      ? "text-[#720E16] border-b-2 border-[#720E16]"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Included Features
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`text-xs font-bold pb-1 transition cursor-pointer ${
                    activeTab === "specs"
                      ? "text-[#720E16] border-b-2 border-[#720E16]"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("faq")}
                  className={`text-xs font-bold pb-1 transition cursor-pointer ${
                    activeTab === "faq"
                      ? "text-[#720E16] border-b-2 border-[#720E16]"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Studio Help &amp; FAQ
                </button>
              </div>

              {/* Tab 1: Features */}
              {activeTab === "features" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    {
                      icon: MapPin,
                      title: "Google Maps Navigation",
                      desc: "One-click directions directly to marriage garden or resort",
                    },
                    {
                      icon: Users,
                      title: "Live RSVP Tracker",
                      desc: "Collect guest attendance and meal counts in real-time",
                    },
                    {
                      icon: Clock,
                      title: "Muhurat Countdown",
                      desc: "Live ticker clock ticking down to Baraat and Varmala",
                    },
                    {
                      icon: Music,
                      title: "Background Music",
                      desc: "Traditional Shehnai and Mangal Dhun audio playback",
                    },
                    {
                      icon: Share2,
                      title: "WhatsApp Share",
                      desc: "Custom preview thumbnail banner when sharing link",
                    },
                    {
                      icon: Gift,
                      title: "Shagun UPI / QR",
                      desc: "Optional digital blessing &amp; wedding gift registry",
                    },
                  ].map((feat, i) => {
                    const Icon = feat.icon;
                    return (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1"
                      >
                        <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                          <Icon className="w-3.5 h-3.5 text-[#720E16]" />
                          <span>{feat.title}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug">
                          {feat.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Specs */}
              {activeTab === "specs" && (
                <div className="space-y-2.5 text-xs text-stone-600 pt-1 font-sans">
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Format:</span>
                    <span className="font-bold text-stone-800">Interactive Website Invite</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Compatibility:</span>
                    <span className="font-bold text-stone-800">Android, iOS, PC, WhatsApp, Insta</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Hosting Duration:</span>
                    <span className="font-bold text-stone-800">Lifetime Active (No Expiry)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Guest Limit:</span>
                    <span className="font-bold text-stone-800">Unlimited Guests &amp; Views</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-stone-500">Custom Domain / Link:</span>
                    <span className="font-bold text-stone-800">vivahvaani.com/w/[your-slug]</span>
                  </div>
                </div>
              )}

              {/* Tab 3: FAQ */}
              {activeTab === "faq" && (
                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <h5 className="font-bold text-stone-800">
                      Kya main khareedne ke baad details badal sakta hoon?
                    </h5>
                    <p className="text-stone-500 mt-0.5 leading-relaxed">
                      Haan! Aap kisi bhi samay apne client dashboard ya customize page se date, venue aur RSVP settings update kar sakte hain.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-800">
                      WhatsApp par kaise share hoga?
                    </h5>
                    <p className="text-stone-500 mt-0.5 leading-relaxed">
                      1-click WhatsApp share button milta hai. Link bhejte hi couple ka photo banner aur namaste message automatic preview ban jata hai.
                    </p>
                  </div>
                  <div className="pt-1">
                    <a
                      href="https://wa.me/919826012345?text=Namaste!%20Mujhe%20is%20template%20ke%20bare%20me%20puchhna%20hai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#720E16] font-bold underline inline-flex items-center gap-1"
                    >
                      <span>Need help? Chat with Indore Studio on WhatsApp</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIMILAR / RECOMMENDED TEMPLATES SECTION */}
        {similarTemplates.length > 0 && (
          <section className="pt-8 border-t border-stone-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#720E16] tracking-widest uppercase">
                  Explore More
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Similar Wedding Invitation Designs
                </h3>
              </div>

              <Link
                href="/templates"
                className="text-xs font-bold text-[#720E16] hover:underline inline-flex items-center gap-1"
              >
                <span>View All Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarTemplates.map((sim) => (
                <div
                  key={sim.slug}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Visual card */}
                  <div className="relative h-56 bg-gradient-to-br from-[#4a080e] via-[#6e131b] to-[#300509] overflow-hidden select-none">
                    {sim.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sim.thumbnail}
                        alt={sim.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#FFF3DA]">
                        <span className="text-xs font-serif font-bold tracking-widest text-amber-300">
                          || श्री गणेशाय नमः ||
                        </span>
                        <h4 className="font-serif text-xl font-bold mt-2">
                          {sim.name}
                        </h4>
                      </div>
                    )}

                    {/* Wishlist Button on Similar Card */}
                    <div className="absolute top-3 right-3 z-20">
                      <WishlistButton
                        slug={sim.slug}
                        initialCount={sim.likesCount || 0}
                        className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-2.5 py-1 border border-white/20"
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/templates/${encodeURIComponent(sim.slug)}`}
                          className="font-serif font-bold text-base text-stone-900 hover:text-[#720E16] transition line-clamp-1"
                        >
                          {sim.name}
                        </Link>
                        <span className="font-serif font-bold text-base text-[#720E16] shrink-0">
                          ₹{sim.price || 499}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                        {sim.description || "Interactive wedding invitation website with RSVP and maps."}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                      <Link
                        href={`/templates/${encodeURIComponent(sim.slug)}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold text-center transition"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/customize/${encodeURIComponent(sim.slug)}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#720E16] hover:bg-[#5A0910] text-[#FFF3DA] text-xs font-bold text-center transition shadow-xs"
                      >
                        Customize
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* DUMMY BUY NOW CHECKOUT MODAL */}
      {buyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-stone-200 relative text-left">
            {/* Close button */}
            <button
              onClick={() => {
                setBuyModalOpen(false);
                setBuySuccess(false);
              }}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {buySuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h4 className="font-serif font-bold text-xl text-stone-900">
                  Order Initiated Successfully!
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Aapka <strong>{template.name}</strong> template direct activate ho chuka hai. Ab aap bride &amp; groom ke shubh naam aur details customize kar sakte hain.
                </p>
                <div className="pt-3 flex flex-col gap-2">
                  <Link
                    href={customizeUrl}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#720E16] hover:bg-[#5A0910] text-[#FFF3DA] font-bold text-xs sm:text-sm text-center transition shadow-md"
                  >
                    Go to Live Customizer &gt;
                  </Link>
                  <button
                    onClick={() => {
                      setBuyModalOpen(false);
                      setBuySuccess(false);
                    }}
                    className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    Instant Purchase Checkout
                  </span>
                  <h4 className="font-serif font-bold text-xl text-stone-900 mt-0.5">
                    Order {template.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Direct purchase &bull; 100% Lifetime Event Hosting &bull; Zero Subscription
                  </p>
                </div>

                {/* Order Summary Box */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-stone-700">
                    <span>Design:</span>
                    <strong className="text-stone-900">{template.name}</strong>
                  </div>
                  <div className="flex justify-between items-center text-stone-700">
                    <span>Format:</span>
                    <span className="text-stone-900 font-medium capitalize">
                      {template.format || "Interactive Website"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-stone-700">
                    <span>Duration:</span>
                    <span className="text-stone-900 font-medium">Lifetime Active (No Expiry)</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                    <span className="font-bold text-stone-900">Total Fixed Amount:</span>
                    <span className="font-serif font-bold text-lg text-[#720E16]">
                      ₹{price}
                    </span>
                  </div>
                </div>

                {/* Dummy Input Details */}
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Your Name / Groom / Bride
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#720E16]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      WhatsApp Mobile Number (for delivery)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98260 12345"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-[#720E16]"
                    />
                  </div>
                </div>

                {/* Dummy Payment Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={buying}
                    onClick={handleDummyBuy}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-amber-50 font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {buying ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Processing Instant Activation...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-amber-200" />
                        <span>Proceed to Buy &bull; ₹{price} (Demo Payment)</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-400 text-center mt-2">
                    🔒 Demo Gateway: Instant activation without charging any real card.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}

export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col items-center justify-center p-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-[#720E16] border border-amber-200 flex items-center justify-center mb-4 shadow-sm">
            <Sparkles className="w-7 h-7 animate-spin text-[#720E16]" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-800">
            Loading Invitation Design...
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Setting up interactive live preview and wedding motifs
          </p>
        </div>
      }
    >
      <TemplateDetailContent paramsPromise={params} />
    </React.Suspense>
  );
}
