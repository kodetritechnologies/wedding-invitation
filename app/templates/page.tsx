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
  ShoppingBag,
  Zap,
  MessageCircle,
  ChevronDown,
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

// Rich SVG category icons matching Indian traditional ceremonies
function getCategoryIcon(catId: string, isSelected: boolean) {
  const strokeClass = isSelected ? "text-[#FFF3DA]" : "text-amber-700";

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

  // Sync category state when URL searchParams change
  useEffect(() => {
    const cat = (searchParams?.get("category") || "all").toLowerCase();
    setActiveCategory(cat);

    const raw = (searchParams?.get("format") || "all").toLowerCase();
    const fmt = raw === "website" || raw === "video" || raw === "pdf" ? raw : "all";
    setSelectedFormat(fmt as "all" | "website" | "video" | "pdf");
  }, [searchParams]);

  // Load dynamic categories from database
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

  // Load purely dynamic database master templates
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
              badge: idx === 0 ? "POPULAR MASTER" : "LIVE THEME",
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

  // Strictly dynamic from MongoDB
  const allTemplates: TemplateCardItem[] = dbTemplates;

  // Handle category switch and update URL
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

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let list = allTemplates.filter((t) => {
      const matchesCategory =
        activeCategory === "all" ||
        t.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesFormat =
        selectedFormat === "all" || t.format === selectedFormat;

      const matchesSearch =
        searchQuery.trim() === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesFormat && matchesSearch;
    });

    if (sortBy === "priceAsc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list = [...list].sort((a, b) => {
        const d1 = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const d2 = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return d2 - d1;
      });
    }

    return list;
  }, [allTemplates, activeCategory, selectedFormat, searchQuery, sortBy]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allTemplates.length };
    for (const t of allTemplates) {
      const cat = t.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [allTemplates]);

  // Counts per format
  const formatCounts = useMemo(() => {
    const list =
      activeCategory === "all"
        ? allTemplates
        : allTemplates.filter(
            (t) => t.category.toLowerCase() === activeCategory.toLowerCase()
          );
    return {
      all: list.length,
      website: list.filter((t) => t.format === "website").length,
      video: list.filter((t) => t.format === "video").length,
      pdf: list.filter((t) => t.format === "pdf").length,
    };
  }, [allTemplates, activeCategory]);

  const hasActiveFilters =
    activeCategory !== "all" || selectedFormat !== "all" || searchQuery.trim() !== "";

  // Luxury Studio Filter Sidebar
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Studio Filter Header */}
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#720E16]" />
          <span className="font-serif font-bold text-sm text-stone-900 tracking-wide uppercase">
            Filter Collection
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-[11px] font-semibold text-[#720E16] hover:text-[#911620] flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Luxury Search Box */}
      <div>
        <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-2">
          Search Designs
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search theme, city, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-stone-50/80 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/15 focus:border-[#720E16] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Celebration Occasions */}
      <div>
        <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-2.5">
          Occasion / Category
        </label>
        <div className="space-y-1">
          {categoryTabs.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  handleSelectCategory(cat.id);
                  setMobileFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left group ${
                  isSelected
                    ? "bg-[#720E16] text-[#FFF3DA] font-bold shadow-md scale-[1.01]"
                    : "text-stone-700 hover:bg-amber-50/60 hover:text-stone-900 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`transition-transform duration-200 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}>
                    {getCategoryIcon(cat.id, isSelected)}
                  </span>
                  <span>{cat.label}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors ${
                    isSelected
                      ? "bg-white/20 text-[#FFF3DA]"
                      : "bg-stone-100 text-stone-500 group-hover:bg-amber-100/60 group-hover:text-amber-900"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format Selector (Website / Video / PDF) */}
      <div className="pt-3 border-t border-amber-900/10">
        <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-2.5">
          Invitation Format
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { id: "all", label: "All Formats", icon: SlidersHorizontal, desc: "Website, Video & PDF", count: formatCounts.all },
            { id: "website", label: "Website Invite", icon: Globe, desc: "Interactive RSVP & GPS", count: formatCounts.website },
            { id: "video", label: "Video Invite", icon: Video, desc: "HD WhatsApp Animated", count: formatCounts.video },
            { id: "pdf", label: "Printable PDF", icon: FileText, desc: "High-Res Vector Card", count: formatCounts.pdf },
          ].map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            const IconComp = fmt.icon;
            return (
              <button
                key={fmt.id}
                onClick={() => {
                  handleSelectFormat(fmt.id as any);
                  setMobileFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "bg-[#FAF4EB] border-[#D6A64B] shadow-2xs"
                    : "bg-white border-stone-200/80 hover:border-amber-300 hover:bg-stone-50/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#720E16] text-[#FFF3DA]" : "bg-stone-100 text-stone-600"}`}>
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{fmt.label}</div>
                    <div className="text-[10px] text-stone-500">{fmt.desc}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-stone-500">
                  ({fmt.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Card Concierge Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF4EB] to-[#F5ECE0] border border-[#EADBCE] space-y-2.5">
        <div className="flex items-center gap-2 text-[#720E16]">
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span className="font-serif font-bold text-xs tracking-tight">
            Physical Card Replica
          </span>
        </div>
        <p className="text-[11px] text-stone-600 leading-relaxed font-normal">
          Already printed your card? WhatsApp its photo for an exact 1:1 digital replica within 24h.
        </p>
        <a
          href="https://wa.me/919826012345?text=Namaste!%20Mujhe%20apne%20printed%20card%20ka%20digital%20replica%20banvana%20hai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#720E16] hover:underline pt-1"
        >
          <span>Chat on WhatsApp</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Banner Section: Pick a design. Make it yours. */}
        <div className="bg-[#FAF4EB] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 mb-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          {/* Left Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-900 tracking-tight">
              Pick a design.{" "}
              <span className="italic text-[#720E16] font-normal">
                Make it yours.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-sans mt-1.5">
              Open any invitation website before you buy &bull; Direct Fixed Pricing &bull; Zero Subscription
            </p>
          </div>

          {/* Right Steps Indicator */}
          <div className="flex items-center justify-center gap-1 sm:gap-2.5 shrink-0">
            {/* Step 1: Choose */}
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FCECEE] flex items-center justify-center text-[#720E16] relative shadow-xs">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="14" x="3" y="5" rx="2" />
                  <path d="M7 12h8" />
                  <path d="m11 8 4 4-4 4" />
                </svg>
                <span className="w-4 h-4 rounded-full bg-[#720E16] text-white text-[10px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5 shadow-xs">
                  1
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 mt-1.5">Choose</span>
            </div>

            {/* Connector */}
            <div className="w-4 sm:w-8 md:w-10 border-t-2 border-dashed border-[#D6A64B]/60 mb-5 shrink-0" />

            {/* Step 2: Edit */}
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FCECEE] flex items-center justify-center text-[#720E16] relative shadow-xs">
                <Pencil className="w-5 h-5" />
                <span className="w-4 h-4 rounded-full bg-[#720E16] text-white text-[10px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5 shadow-xs">
                  2
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 mt-1.5">Edit</span>
            </div>

            {/* Connector */}
            <div className="w-4 sm:w-8 md:w-10 border-t-2 border-dashed border-[#D6A64B]/60 mb-5 shrink-0" />

            {/* Step 3: Pay */}
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FCECEE] flex items-center justify-center text-[#720E16] relative shadow-xs">
                <CreditCard className="w-5 h-5" />
                <span className="w-4 h-4 rounded-full bg-[#720E16] text-white text-[10px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5 shadow-xs">
                  3
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 mt-1.5">Pay</span>
            </div>

            {/* Connector */}
            <div className="w-4 sm:w-8 md:w-10 border-t-2 border-dashed border-[#D6A64B]/60 mb-5 shrink-0" />

            {/* Step 4: Share */}
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FCECEE] flex items-center justify-center text-[#720E16] relative shadow-xs">
                <Share2 className="w-5 h-5" />
                <span className="w-4 h-4 rounded-full bg-[#720E16] text-white text-[10px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5 shadow-xs">
                  4
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 mt-1.5">Share</span>
            </div>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: Left Filter Section + Right Templates Display */}
        <div className="flex gap-8 items-start">
          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
              <FilterSidebar />
            </div>
          </aside>

          {/* RIGHT SIDE MAIN TEMPLATES GRID */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar: Count, Active Filter Chips, and Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold text-stone-800 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#720E16]" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#720E16]" />
                  )}
                </button>

                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <span className="font-serif font-bold text-sm text-stone-900">
                    {filteredTemplates.length}
                  </span>{" "}
                  <span>
                    {filteredTemplates.length === 1 ? "design available" : "designs available"}
                  </span>
                </div>
              </div>

              {/* Sorting & Active Chips */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-stone-400 text-[11px]">Sort:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      aria-label="Sort designs by"
                      className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-semibold focus:outline-none focus:border-[#720E16] cursor-pointer pr-7 appearance-none"
                    >
                      <option value="featured">Featured / Popular</option>
                      <option value="newest">Newest Releases</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-stone-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filter Chips Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[11px] font-semibold text-stone-400">Active Filters:</span>
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#720E16]/10 text-xs font-bold text-[#720E16] border border-[#720E16]/20 capitalize">
                    {activeCategory}
                    <button
                      onClick={() => handleSelectCategory("all")}
                      className="hover:text-red-700 cursor-pointer"
                      title="Remove category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedFormat !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-xs font-bold text-amber-900 border border-amber-300/80 uppercase">
                    {selectedFormat}
                    <button
                      onClick={() => handleSelectFormat("all")}
                      className="hover:text-red-700 cursor-pointer"
                      title="Remove format filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() !== "" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-xs font-semibold text-stone-700 border border-stone-300">
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-red-700 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-stone-500 hover:text-[#720E16] underline cursor-pointer ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Content State: Loading / Empty / Luxury Cards Grid */}
            {loading ? (
              <div className="text-center py-28 bg-white rounded-3xl border border-stone-200/90 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 animate-spin text-[#720E16]" />
                </div>
                <p className="text-sm font-serif font-bold text-stone-800">Loading Invitation Collection...</p>
                <p className="text-xs text-stone-400 mt-1">Fetching live master templates from database</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-20 px-8 bg-white rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF4EB] text-[#720E16] border border-[#EADBCE] flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    {activeCategory !== "all"
                      ? `No published designs for "${activeCategory.toUpperCase()}" yet`
                      : "No invitation templates published yet"}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                    Super Admin can upload and publish real invitation themes from the dashboard. Alternatively, our Indore studio can convert any printed physical card into a digital master link.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>View All Available Designs</span>
                    </button>
                  )}
                  <a
                    href="https://wa.me/919826012345?text=Namaste!%20Mujhe%20custom%20invitation%20design%20banvana%20hai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#720E16] hover:bg-[#5A0910] text-[#FFF3DA] text-xs font-bold transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Request Custom Design (WhatsApp)</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:border-[#D6A64B]/60 transition-all duration-300 flex flex-col justify-between group relative"
                  >
                    {/* Visual Invitation Preview Card (Click leads to detail page) */}
                    <div className="relative">
                      <Link
                        href={`/templates/${encodeURIComponent(item.slug)}`}
                        className={`h-64 sm:h-72 bg-gradient-to-b ${item.bgGradient} p-5 flex flex-col justify-between text-white relative overflow-hidden select-none block`}
                      >
                        {/* Background photo thumbnail if present */}
                        {item.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : null}

                        {/* Delicate Golden Filigree Arch Border */}
                        <div className="absolute inset-2.5 border border-[#D6A64B]/35 rounded-2xl pointer-events-none group-hover:border-[#D6A64B]/70 transition-colors" />
                        <div className="absolute inset-3 border border-white/10 rounded-xl pointer-events-none" />

                        {/* Ornate Indian Card Center Motif */}
                        <div className="relative z-10 text-center py-3 space-y-1.5 my-auto">
                          {/* Auspicious Shlok */}
                          <div className="text-[11px] font-serif font-bold tracking-widest text-amber-300/90 drop-shadow-xs">
                            || श्री गणेशाय नमः ||
                          </div>

                          {/* Grand Couple / Title */}
                          <h3 className="font-serif text-2xl sm:text-[26px] font-bold tracking-tight text-[#FFF3DA] drop-shadow-md leading-tight line-clamp-2 px-2">
                            {item.title}
                          </h3>

                          {/* Subtle Arch Ornament */}
                          <div className="flex items-center justify-center gap-2 pt-1 text-amber-300/60">
                            <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-amber-300/60" />
                            <span className="text-[10px]">✦</span>
                            <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-amber-300/60" />
                          </div>
                        </div>
                      </Link>

                      {/* Wishlist Like Button in Thumbnail Corner */}
                      <div className="absolute top-3 right-3 z-20">
                        <WishlistButton
                          slug={item.slug}
                          initialCount={item.likesCount || 0}
                          className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-2.5 py-1 border border-white/20 shadow-xs"
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Card Content & Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/templates/${encodeURIComponent(item.slug)}`}
                            className="font-serif font-bold text-base text-stone-900 group-hover:text-[#720E16] transition leading-snug line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <span className="font-serif font-bold text-base text-[#720E16] shrink-0">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Action Row */}
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        <div className="flex items-center gap-2">
                          {item.previewUrl ? (
                            <Link
                              href={item.previewUrl}
                              target="_blank"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-700 hover:text-[#720E16] transition py-2 px-2.5 rounded-xl border border-stone-200 hover:bg-stone-50"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#720E16]" />
                              <span>Preview</span>
                            </Link>
                          ) : null}

                          <Link
                            href={`/customize/${encodeURIComponent(item.slug)}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-200/80 transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 text-stone-600" />
                            <span>Customize</span>
                          </Link>
                        </div>

                        {/* DIRECT BUY NOW BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            setBuyModalTemplate(item);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-amber-50 font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4 text-amber-200" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RAZORPAY BUY NOW CHECKOUT MODAL */}
      <RazorpayCheckoutModal
        isOpen={Boolean(buyModalTemplate)}
        onClose={() => setBuyModalTemplate(null)}
        template={buyModalTemplate}
      />

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#720E16]" />
                  <h3 className="font-serif font-bold text-sm text-stone-900 uppercase tracking-wide">
                    Filter Designs
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar />
            </div>

            <div className="pt-6 border-t border-stone-200 mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#720E16] text-[#FFF3DA] text-xs font-bold shadow-xs cursor-pointer"
              >
                Apply Filters ({filteredTemplates.length} results)
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
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <Sparkles className="w-6 h-6 animate-spin text-[#720E16]" />
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
