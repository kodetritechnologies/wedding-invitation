"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Filter,
  Eye,
  ArrowRight,
  Palette,
  Heart,
  Crown,
  Check,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  tier: "Basic" | "Premium" | "Royal";
  description: string;
  tags: string[];
  colors: string[];
  bgGradient: string;
}

const TEMPLATES_CATALOG: TemplateItem[] = [
  {
    id: "royal-palace",
    title: "Jaipur Royal Palace",
    category: "Royal Heritage",
    tier: "Royal",
    description: "Rich maroon and gold accents with classic Rajputi arch motifs and elegant typography.",
    tags: ["Mughal Arches", "Maroon & Gold", "Palace Theme"],
    colors: ["#7F1D1D", "#D97706", "#FFFBEB"],
    bgGradient: "from-rose-950 via-rose-900 to-amber-950",
  },
  {
    id: "floral-romance",
    title: "Blush Botanical Romance",
    category: "Floral Pastel",
    tier: "Premium",
    description: "Soft pastel blush, water-colored eucalyptus leaves, and romantic serif script.",
    tags: ["Pastel Pink", "Watercolor Floral", "Outdoor Lawn"],
    colors: ["#FCE7F3", "#047857", "#831843"],
    bgGradient: "from-pink-900 via-rose-900 to-stone-900",
  },
  {
    id: "traditional-gold",
    title: "Kashi Shubh Vivah",
    category: "Traditional Gold",
    tier: "Basic",
    description: "Sacred marigold orange and auspicious vermillion red with traditional Sanskrit Shlokas.",
    tags: ["Mandap Theme", "Marigold & Red", "Vedic Heritage"],
    colors: ["#DC2626", "#EA580C", "#FEF08A"],
    bgGradient: "from-red-950 via-amber-900 to-red-900",
  },
  {
    id: "modern-minimalist",
    title: "Minimalist Champagne Gold",
    category: "Modern Luxury",
    tier: "Basic",
    description: "Clean contemporary lines, warm beige tones, and refined luxury typography.",
    tags: ["Destination Wedding", "Champagne Beige", "Sleek"],
    colors: ["#F5F5F4", "#78716C", "#1C1917"],
    bgGradient: "from-stone-900 via-neutral-900 to-stone-950",
  },
  {
    id: "emerald-glamour",
    title: "Royal Emerald & Pearl",
    category: "Modern Luxury",
    tier: "Royal",
    description: "Deep emerald green with glistening gold foil borders for opulent Sangeet & Reception nights.",
    tags: ["Emerald Green", "Gold Foil", "Night Event"],
    colors: ["#064E3B", "#D97706", "#ECFDF5"],
    bgGradient: "from-emerald-950 via-teal-950 to-stone-950",
  },
  {
    id: "south-indian-classic",
    title: "Traditional Temple Gopuram",
    category: "Traditional Gold",
    tier: "Premium",
    description: "Temple jewelry inspired design with banana leaf accents and classic golden border trims.",
    tags: ["South Indian", "Kalyanam", "Temple Motifs"],
    colors: ["#78350F", "#F59E0B", "#FEF3C7"],
    bgGradient: "from-amber-950 via-stone-900 to-yellow-950",
  },
];

const CATEGORIES = [
  "All",
  "Royal Heritage",
  "Floral Pastel",
  "Traditional Gold",
  "Modern Luxury",
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates =
    activeCategory === "All"
      ? TEMPLATES_CATALOG
      : TEMPLATES_CATALOG.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 space-y-10">
        {/* Header Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
            <Palette className="w-3.5 h-3.5" />
            <span>Master Design Gallery</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
            Handcrafted Digital Wedding Templates
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            Every template is engineered with responsive mobile layouts, multi-event schedules, interactive Google Maps pins, and instant RSVP headcount tracking.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {filteredTemplates.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-rose-300 transition flex flex-col justify-between group"
            >
              {/* Mockup Card Header Preview */}
              <div
                className={`h-56 bg-gradient-to-b ${item.bgGradient} p-6 flex flex-col justify-between text-white relative`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.tier === "Royal"
                        ? "bg-amber-400 text-rose-950"
                        : item.tier === "Premium"
                        ? "bg-rose-500 text-white"
                        : "bg-white/20 text-white backdrop-blur-xs"
                    }`}
                  >
                    {item.tier === "Royal" && <Crown className="w-2.5 h-2.5 inline mr-1" />}
                    {item.tier} Tier
                  </span>

                  <span className="text-[10px] text-white/70 uppercase tracking-widest font-mono">
                    {item.category}
                  </span>
                </div>

                <div className="text-center space-y-1">
                  <Heart className="w-6 h-6 text-amber-300 fill-amber-300 mx-auto opacity-80" />
                  <p className="font-serif text-2xl font-bold tracking-wide text-amber-100">
                    Aarav & Diya
                  </p>
                  <p className="text-[11px] text-stone-300 tracking-wider">
                    SUBH VIVAH SAMAROH
                  </p>
                </div>

                {/* Color swatches preview */}
                <div className="flex items-center gap-1.5 justify-center">
                  {item.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-rose-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <Link
                    href="/w/aarav-diya"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-rose-600 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-400" />
                    <span>Live Sample</span>
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            Need a Bespoke Template for Your Wedding Business?
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            Our platform allows Super Admin uploads of custom declarative templates with custom fonts, colors, and layout components.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-block px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl transition"
            >
              Contact Our Design Team in Indore
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
