"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Eye,
  ArrowRight,
  Search,
  Globe,
  Video,
  FileText,
  SlidersHorizontal,
  X,
  RotateCcw,
  CreditCard,
  Pencil,
  Share2,
  Check,
  MessageCircle,
  ChevronDown,
  Play,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import WishlistButton from "@/components/templates/WishlistButton";
import RazorpayCheckoutModal from "@/components/payment/RazorpayCheckoutModal";

interface CategoryTab {
  id: string;
  label: string;
}

interface TemplateCardItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  format: "website" | "video" | "pdf";
  price: number;
  likesCount?: number;
  badge?: string;
  thumbnail?: string;
  description: string;
  features: string[];
  bgGradient: string;
  accentColor: string;
  demoSlug?: string;
  previewUrl?: string;
  createdAt?: string;
}

const DEFAULT_CATEGORIES: CategoryTab[] = [
  { id: "all", label: "All Celebrations" },
  { id: "wedding", label: "Wedding (विवाह)" },
  { id: "engagement", label: "Engagement (सगाई)" },
  { id: "birthday", label: "Birthday (जन्मदिन)" },
  { id: "anniversary", label: "Anniversary (सालगिरह)" },
  { id: "housewarming", label: "House Warming (गृह प्रवेश)" },
  { id: "reception", label: "Reception (स्वागत समारोह)" },
];

function getCategoryIcon(catId: string, isSelected: boolean) {
  const strokeClass = isSelected ? "text-[#FFF3DA]" : "text-[#720E16]";
  switch (catId) {
    case "wedding":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="14" r="5" />
          <circle cx="16" cy="14" r="5" />
          <path d="M12 6.5l2-2.5 2 2.5-2 2.5z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      );
    case "engagement":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M11 3v6l-4 3" />
          <path d="M13 3v6l4 3" />
        </svg>
      );
    case "birthday":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
          <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
          <path d="M2 21h20" />
          <path d="M12 7v4" />
          <path d="M12 3a1 1 0 0 0 0 2 1 1 0 0 0 0-2" fill="currentColor" />
        </svg>
      );
    case "anniversary":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case "housewarming":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "reception":
      return (
        <svg className={`w-4 h-4 ${strokeClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 22h8" />
          <path d="M12 15v7" />
          <path d="M12 15a5 5 0 0 0 5-5V2H7v8a5 5 0 0 0 5 5Z" />
        </svg>
      );
    default:
      return <Sparkles className={`w-4 h-4 ${strokeClass}`} />;
  }
}

// Format badge helper
function FormatBadge({ format }: { format: "website" | "video" | "pdf" }) {
  const map = {
    website: { label: "Website", icon: Globe, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    video: { label: "Video", icon: Play, color: "bg-purple-100 text-purple-700 border-purple-200" },
    pdf: { label: "PDF", icon: FileText, color: "bg-blue-100 text-blue-700 border-blue-200" },
  };
  const cfg = map[format];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

function TemplatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = (searchParams?.get("category") || "all").toLowerCase();
  const rawFmt = (searchParams?.get("format") || "all").toLowerCase();
  const initialFormat =
    rawFmt === "website" || rawFmt === "video" || rawFmt === "pdf" ? rawFmt : "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCat);
  const [selectedFormat, setSelectedFormat] = useState<"all" | "website" | "video" | "pdf">(
    initialFormat as "all" | "website" | "video" | "pdf"
  );
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "priceAsc" | "priceDesc">("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryTabs, setCategoryTabs] = useState<CategoryTab[]>(DEFAULT_CATEGORIES);
  const [dbTemplates, setDbTemplates] = useState<TemplateCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [buyModalTemplate, setBuyModalTemplate] = useState<TemplateCardItem | null>(null);

  useEffect(() => {
    const cat = (searchParams?.get("category") || "all").toLowerCase();
    setActiveCategory(cat);
    const raw = (searchParams?.get("format") || "all").toLowerCase();
    const fmt = raw === "website" || raw === "video" || raw === "pdf" ? raw : "all";
    setSelectedFormat(fmt as "all" | "website" | "video" | "pdf");
  }, [searchParams]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/public/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
            const mappedTabs: CategoryTab[] = [
              { id: "all", label: "All Celebrations" },
              ...data.categories.map((c: { slug: string; name: string }) => ({
                id: c.slug.toLowerCase(),
                label: c.name,
              })),
            ];
            setCategoryTabs(mappedTabs);
          }
        }
      } catch {
        // Keep default tabs
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadDb() {
      try {
        setLoading(true);
        const res = await fetch("/api/templates");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.templates)) {
            const gradients = [
              "from-[#4a080e] via-[#6e131b] to-[#300509]",
              "from-[#063327] via-[#094d3b] to-[#042019]",
              "from-[#3b1236] via-[#5c1c54] to-[#240a21]",
              "from-[#42210b] via-[#633314] to-[#291304]",
            ];
            const accents = ["#E8B966", "#99F6E4", "#FBCFE8", "#FED7AA"];

            const mapped: TemplateCardItem[] = data.templates.map((t: any, idx: number) => ({
              id: `db-${t._id || t.slug}`,
              slug: t.slug,
              title: t.name,
              category: (t.category || "wedding").toLowerCase(),
              format: (t.format || "website") as "website" | "video" | "pdf",
              price: t.price || 399,
              badge: idx === 0 ? "POPULAR" : idx < 3 ? "NEW" : undefined,
              thumbnail: t.thumbnail,
              description:
                t.description ||
                "Interactive invitation website with live guest RSVP headcount, Google Maps turn-by-turn navigation, and Vedic motifs.",
              features: [
                "Google Maps Live Navigation",
                "Live RSVP Headcount Tracker",
                "Countdown Timer Clock",
                "WhatsApp 1-Click Share",
              ],
              bgGradient: gradients[idx % gradients.length],
              accentColor: accents[idx % accents.length],
              demoSlug: t.slug,
              previewUrl: `/api/public/templates/${t.slug}/preview`,
              likesCount: t.likesCount || 0,
              createdAt: t.createdAt,
            }));
            setDbTemplates(mapped);
          } else {
            setDbTemplates([]);
          }
        } else {
          setDbTemplates([]);
        }
      } catch {
        setDbTemplates([]);
      } finally {
        setLoading(false);
      }
    }
    loadDb();
  }, []);

  const allTemplates: TemplateCardItem[] = dbTemplates;

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    const params = new URLSearchParams();
    if (catId !== "all") params.set("category", catId);
    if (selectedFormat !== "all") params.set("format", selectedFormat);
    const qs = params.toString();
    router.push(qs ? `/templates?${qs}` : "/templates", { scroll: false });
  };

  const handleSelectFormat = (fmt: "all" | "website" | "video" | "pdf") => {
    setSelectedFormat(fmt);
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (fmt !== "all") params.set("format", fmt);
    const qs = params.toString();
    router.push(qs ? `/templates?${qs}` : "/templates", { scroll: false });
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSelectedFormat("all");
    setSearchQuery("");
    setSortBy("featured");
    router.push("/templates", { scroll: false });
  };

  const filteredTemplates = useMemo(() => {
    let list = allTemplates.filter((t) => {
      const matchesCategory =
        activeCategory === "all" ||
        t.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesFormat = selectedFormat === "all" || t.format === selectedFormat;
      const matchesSearch =
        searchQuery.trim() === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesFormat && matchesSearch;
    });

    if (sortBy === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") {
      list = [...list].sort((a, b) => {
        const d1 = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const d2 = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return d2 - d1;
      });
    }
    return list;
  }, [allTemplates, activeCategory, selectedFormat, searchQuery, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allTemplates.length };
    for (const t of allTemplates) {
      const cat = t.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [allTemplates]);

  const formatCounts = useMemo(() => {
    const list =
      activeCategory === "all"
        ? allTemplates
        : allTemplates.filter((t) => t.category.toLowerCase() === activeCategory.toLowerCase());
    return {
      all: list.length,
      website: list.filter((t) => t.format === "website").length,
      video: list.filter((t) => t.format === "video").length,
      pdf: list.filter((t) => t.format === "pdf").length,
    };
  }, [allTemplates, activeCategory]);

  const hasActiveFilters =
    activeCategory !== "all" || selectedFormat !== "all" || searchQuery.trim() !== "";

  // ─── Filter Sidebar ───────────────────────────────────────────────
  const FilterSidebar = () => (
    <div className="space-y-0">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-[#720E16]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 3h15a1 1 0 0 1 .8 1.6l-5.3 7.07V19a1 1 0 0 1-1.45.9l-4-2A1 1 0 0 1 9 17v-5.33L3.7 4.6A1 1 0 0 1 4.5 3Z"/>
          </svg>
          <span className="font-bold text-xl text-stone-900">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition"
            title="Clear all filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Search ── */}
      <div className="px-5 py-4 border-b border-stone-100">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search theme, style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-[#FAF4EB] border border-[#EADBCE] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16]/40 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Occasion / Category ── */}
      <div className="px-5 py-4 border-b border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base text-stone-900">Tradition &amp; Culture</span>
          <span className="w-6 h-6 rounded-full bg-[#FCECEE] text-[#720E16] flex items-center justify-center text-sm font-bold leading-none select-none">−</span>
        </div>
        <div className="space-y-1">
          {categoryTabs.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => { handleSelectCategory(cat.id); setMobileFilterOpen(false); }}
                className="w-full flex items-center gap-3 py-2 px-1 cursor-pointer group text-left"
              >
                {/* Custom checkbox box */}
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#720E16] border-[#720E16]"
                    : "border-stone-300 bg-white group-hover:border-[#720E16]/60"
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm flex-1 transition-colors ${isSelected ? "text-stone-900 font-semibold" : "text-stone-600 group-hover:text-stone-900"}`}>
                  {cat.label}
                </span>
                <span className="text-xs text-stone-400">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Format ── */}
      <div className="px-5 py-4 border-b border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-base text-stone-900">Format</span>
          <span className="w-6 h-6 rounded-full bg-[#FCECEE] text-[#720E16] flex items-center justify-center text-sm font-bold leading-none select-none">−</span>
        </div>
        <div className="space-y-1">
          {[
            { id: "all", label: "All Formats", count: formatCounts.all },
            { id: "website", label: "Website", count: formatCounts.website },
            { id: "video", label: "Video", count: formatCounts.video },
            { id: "pdf", label: "PDF / Printable", count: formatCounts.pdf },
          ].map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => { handleSelectFormat(fmt.id as any); setMobileFilterOpen(false); }}
                className="w-full flex items-center gap-3 py-2 px-1 cursor-pointer group text-left"
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#720E16] border-[#720E16]"
                    : "border-stone-300 bg-white group-hover:border-[#720E16]/60"
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm flex-1 transition-colors ${isSelected ? "text-stone-900 font-semibold" : "text-stone-600 group-hover:text-stone-900"}`}>
                  {fmt.label}
                </span>
                <span className="text-xs text-stone-400">({fmt.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── WhatsApp CTA ── */}
      <div className="px-5 py-4 border-b border-stone-100">
        <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#EADBCE]">
          <div className="flex items-center gap-2 text-[#720E16] mb-1.5">
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold text-sm">Custom Card Replica</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed mb-2.5">
            Already have a printed card? Get exact digital replica in 24h.
          </p>
          <a
            href="https://wa.me/919826012345?text=Namaste!%20Mujhe%20apne%20printed%20card%20ka%20digital%20replica%20banvana%20hai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#720E16] hover:underline"
          >
            Chat on WhatsApp <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── Bottom Action Buttons ── */}
      <div className="px-5 py-4 flex gap-3">
        <button
          onClick={handleResetFilters}
          className="flex-1 py-2.5 rounded-full border-2 border-[#720E16] text-[#720E16] font-bold text-sm hover:bg-[#FAF4EB] transition cursor-pointer"
        >
          Clear All
        </button>
        <button
          onClick={() => setMobileFilterOpen(false)}
          className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#720E16] to-[#5A0910] text-white font-bold text-sm shadow-sm hover:shadow-md transition cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF4EB]/60 via-[#FDFBF7] to-white text-stone-900 font-sans flex flex-col">
      <PublicHeader />

      <main className="flex-1 w-full">

        {/* ── HERO BANNER ── */}
        <div className="w-full border-b border-[#c9a96e]/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Elegant Indian Wedding Invitations.png"
            alt="Wedding Invitation Templates Banner"
            className="w-full object-cover max-h-[280px] sm:max-h-[340px] lg:max-h-[400px]"
          />
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex gap-7 items-start">

            {/* LEFT SIDEBAR (Desktop) */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-24">
              <div className="bg-white border border-[#EADBCE] rounded-2xl shadow-sm">
                <FilterSidebar />
              </div>
            </aside>

            {/* RIGHT: Templates Grid */}
            <div className="flex-1 min-w-0">

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white border border-[#EADBCE] rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF4EB] hover:bg-[#FCECEE] border border-[#EADBCE] text-xs font-bold text-stone-800 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#720E16]" />
                    Filters
                    {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-[#720E16]" />}
                  </button>

                  <div className="text-xs text-stone-500">
                    <span className="font-bold text-base text-stone-900 mr-1">{filteredTemplates.length}</span>
                    {filteredTemplates.length === 1 ? "design found" : "designs found"}
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-400 text-[11px]">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      aria-label="Sort designs"
                      className="bg-[#FAF4EB] border border-[#EADBCE] rounded-xl px-3 py-1.5 text-xs text-stone-800 font-semibold focus:outline-none focus:border-[#720E16]/40 cursor-pointer pr-7 appearance-none"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="priceAsc">Price: Low → High</option>
                      <option value="priceDesc">Price: High → Low</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="text-[11px] font-semibold text-stone-400">Active:</span>
                  {activeCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#720E16]/10 text-xs font-bold text-[#720E16] border border-[#720E16]/20 capitalize">
                      {activeCategory}
                      <button onClick={() => handleSelectCategory("all")} className="hover:text-red-700 cursor-pointer" title="Remove">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedFormat !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4EB] text-xs font-bold text-[#720E16] border border-[#EADBCE] uppercase">
                      {selectedFormat}
                      <button onClick={() => handleSelectFormat("all")} className="hover:text-red-700 cursor-pointer" title="Remove">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery.trim() !== "" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-xs font-semibold text-stone-700 border border-stone-200">
                      &ldquo;{searchQuery}&rdquo;
                      <button onClick={() => setSearchQuery("")} className="hover:text-red-700 cursor-pointer" title="Clear">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button onClick={handleResetFilters} className="text-[11px] font-semibold text-stone-400 hover:text-[#720E16] underline cursor-pointer">
                    Clear all
                  </button>
                </div>
              )}

              {/* ── TEMPLATE CARDS GRID ── */}
              {loading ? (
                <div className="text-center py-28 bg-white rounded-3xl border border-[#EADBCE] shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#FAF4EB] flex items-center justify-center mx-auto mb-4 border border-[#EADBCE]">
                    <Sparkles className="w-7 h-7 animate-spin text-[#720E16]" />
                  </div>
                  <p className="text-sm font-bold text-stone-800">Loading Invitation Collection...</p>
                  <p className="text-xs text-stone-400 mt-1">Fetching beautiful designs for you</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-20 px-8 bg-white rounded-3xl border border-[#EADBCE] shadow-sm space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FAF4EB] flex items-center justify-center mx-auto border border-[#EADBCE]">
                    <Sparkles className="w-7 h-7 text-[#720E16]" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {activeCategory !== "all"
                      ? `No designs for "${activeCategory}" yet`
                      : "No invitation templates published yet"}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                    Our team is working on beautiful designs. Meanwhile, WhatsApp us your printed card for a custom digital replica.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        View All Designs
                      </button>
                    )}
                    <a
                      href="https://wa.me/919826012345?text=Namaste!%20Mujhe%20custom%20invitation%20design%20banvana%20hai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#720E16] hover:bg-[#5A0910] text-white text-xs font-bold transition shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Request Custom Design
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                  {filteredTemplates.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group relative border border-stone-100"
                    >
                      {/* ── CARD THUMBNAIL (Full bleed cover image) ── */}
                      <div className="relative overflow-hidden">
                        <Link href={`/templates/${encodeURIComponent(item.slug)}`} className="block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnail || "/images/ganesh-cover.jpg"}
                            alt={item.title}
                            className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Dark overlay at bottom of image for readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        </Link>

                        {/* Top-right: Format badge */}
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="px-2.5 py-1 rounded-full bg-white text-[10px] font-black text-stone-800 shadow-sm tracking-wide uppercase">
                            {item.format}
                          </span>
                        </div>

                        {/* Center: Play icon (for video format, or always as UX hint) */}
                        <Link
                          href={`/templates/${encodeURIComponent(item.slug)}`}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                        >
                          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/30">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </Link>

                        {/* Bottom-right: Preview pill */}
                        {item.previewUrl && (
                          <div className="absolute bottom-3 right-3 z-10">
                            <Link
                              href={item.previewUrl}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold hover:bg-black/90 transition shadow-md"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye className="w-3 h-3" />
                              Preview
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* ── CARD BODY ── */}
                      <div className="p-4 flex flex-col gap-2.5">
                        {/* Title */}
                        <Link
                          href={`/templates/${encodeURIComponent(item.slug)}`}
                          className="font-bold text-sm sm:text-[15px] text-stone-900 hover:text-[#720E16] transition leading-snug line-clamp-1"
                        >
                          {item.title}
                        </Link>

                        {/* Category • Format subtitle */}
                        <p className="text-[11px] text-stone-400 capitalize">
                          {item.category} &bull; {item.format === "website" ? "English" : item.format === "video" ? "Video" : "PDF"}
                        </p>

                        {/* Price */}
                        <p className="text-base font-black text-[#720E16]">
                          ₹{item.price}
                        </p>

                        {/* Primary CTA: Edit This Template */}
                        <Link
                          href={`/customize/${encodeURIComponent(item.slug)}`}
                          className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#720E16] to-[#5A0910] hover:from-[#5A0910] hover:to-[#42060B] text-white font-bold text-sm shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-center"
                        >
                          Edit This Template
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Razorpay Modal */}
      <RazorpayCheckoutModal
        isOpen={Boolean(buyModalTemplate)}
        onClose={() => setBuyModalTemplate(null)}
        template={buyModalTemplate}
      />

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#EADBCE] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#720E16]" />
                  <h3 className="font-bold text-sm text-stone-900">Filter Designs</h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>
            <div className="pt-5 border-t border-[#EADBCE] mt-5">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#720E16] text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Show {filteredTemplates.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#FAF4EB] to-white flex items-center justify-center">
          <Sparkles className="w-7 h-7 animate-spin text-[#720E16]" />
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
