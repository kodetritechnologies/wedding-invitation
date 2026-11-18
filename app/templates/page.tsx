"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Eye,
  ArrowRight,
  Palette,
  Heart,
  Crown,
  Check,
  Search,
  MessageCircle,
  PhoneCall,
  Flame,
  Calendar,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

interface TemplateItem {
  id: string;
  title: string;
  regionalTheme: string;
  category: "all" | "royal" | "floral" | "traditional" | "modern" | "south";
  tier: "Royal" | "Premium" | "Essential";
  popularBadge?: string;
  couples: string;
  subTitle: string;
  location: string;
  description: string;
  features: string[];
  colors: string[];
  bgGradient: string;
  accentColor: string;
  demoSlug: string;
}

const TEMPLATES_CATALOG: TemplateItem[] = [
  {
    id: "royal-rajputana",
    title: "Rajwada Darbar",
    regionalTheme: "Jaipur & Udaipur Heritage",
    category: "royal",
    tier: "Royal",
    popularBadge: "⭐ Most Loved in Indore & Rajasthan",
    couples: "Aarav & Diya",
    subTitle: "|| श्री गणेशाय नमः || शुभ विवाह",
    location: "Indore & Udaipur",
    description: "Deep regal crimson, rich gold leaf border arches, royal elephant motifs, and classical wedding shehnai aesthetics.",
    features: ["Gold Arch Motifs", "Live RSVP Headcount", "Multi-Day Muhurat Timeline", "Google Maps Directions"],
    colors: ["#7F1D1D", "#D97706", "#FFFBEB"],
    bgGradient: "from-[#450a0a] via-[#781212] to-[#2b0505]",
    accentColor: "border-amber-400/60 text-amber-300",
    demoSlug: "aarav-diya",
  },
  {
    id: "gulab-botanical",
    title: "Gulab & Chandan Blush",
    regionalTheme: "Romantic Pastel Lawn Soiree",
    category: "floral",
    tier: "Premium",
    popularBadge: "🌸 Trending for Day Weddings",
    couples: "Ananya & Kabir",
    subTitle: "Two Hearts &bull; One Soul",
    location: "Goa & Mumbai",
    description: "Watercolored blush roses, eucalyptus foliage, warm champagne gold, and delicate romantic calligraphy for open-air lawn ceremonies.",
    features: ["Pastel Watercolor Art", "Custom Dress Code Tags", "Interactive Photo Gallery", "1-Click WhatsApp Share"],
    colors: ["#FCE7F3", "#047857", "#9D174D"],
    bgGradient: "from-[#500724] via-[#701a75] to-[#3b0764]",
    accentColor: "border-pink-300/60 text-pink-200",
    demoSlug: "aarav-diya",
  },
  {
    id: "kashi-vedic",
    title: "Kashi Shubh Vivah",
    regionalTheme: "Sacred Vedic & Temple Sanskriti",
    category: "traditional",
    tier: "Essential",
    popularBadge: "🕉️ Authentic Sanskrit Shlokas",
    couples: "Meera & Rohan",
    subTitle: "माङ्गल्यं तन्तुनानेन &bull; सप्तपदी",
    location: "Varanasi & Bhopal",
    description: "Sacred sindoor red, marigold orange trims, and Vedic shlokas celebrating seven sacred pheras with divine blessings.",
    features: ["Sanskrit Phera Shlokas", "Family Lineage Honor", "Bilingual Hindi/English", "Direct Maps Navigation"],
    colors: ["#B91C1C", "#EA580C", "#FEF08A"],
    bgGradient: "from-[#7f1d1d] via-[#9a3412] to-[#450a0a]",
    accentColor: "border-amber-300/60 text-amber-200",
    demoSlug: "aarav-diya",
  },
  {
    id: "coastal-minimal",
    title: "Champagne Elegance",
    regionalTheme: "Destination & Contemporary Luxury",
    category: "modern",
    tier: "Premium",
    couples: "Riya & Siddharth",
    subTitle: "Join Us Under The Stars",
    location: "Jaipur & Dubai",
    description: "Architectural luxury lines, warm beige tones, refined editorial typography, and minimalist European-Indian fusion.",
    features: ["Minimalist Aesthetic", "Destination Itinerary", "Countdown Clock", "Smart RSVP Headcount"],
    colors: ["#F5F5F4", "#78716C", "#1C1917"],
    bgGradient: "from-[#1c1917] via-[#292524] to-[#0c0a09]",
    accentColor: "border-stone-400/60 text-stone-200",
    demoSlug: "aarav-diya",
  },
  {
    id: "nawabi-emerald",
    title: "Nawabi Emerald & Pearl",
    regionalTheme: "Opulent Sangeet & Reception",
    category: "modern",
    tier: "Royal",
    popularBadge: "✨ Sangeet & Cocktail Favorite",
    couples: "Zoya & Farhan",
    subTitle: "Dawat-e-Ishq & Celebration",
    location: "Lucknow & Delhi",
    description: "Rich peacock emerald velvet, shimmering foil borders, and candlelit ambiance tailored for evening musical sangeets.",
    features: ["Deep Emerald & Gold Theme", "Song / Music Embed", "Family Video Message", "VIP Guest RSVP Codes"],
    colors: ["#064E3B", "#D97706", "#ECFDF5"],
    bgGradient: "from-[#022c22] via-[#064e3b] to-[#021d17]",
    accentColor: "border-emerald-300/60 text-emerald-200",
    demoSlug: "aarav-diya",
  },
  {
    id: "chettinad-temple",
    title: "Thirumangalyam Gopuram",
    regionalTheme: "Traditional South Indian Kalyanam",
    category: "south",
    tier: "Royal",
    couples: "Lakshmi & Ashwin",
    subTitle: "शुभ लग्न &bull; Kalyanam",
    location: "Chennai & Bangalore",
    description: "Inspired by Chettinad brass lamps, banana leaf auspicious greens, temple gopuram silhouettes, and authentic nadaswaram spirit.",
    features: ["Temple Gopuram Motifs", "Muhurtham Countdown", "Detailed Tiffin & Feast Menu", "Direct Family Contacts"],
    colors: ["#78350F", "#F59E0B", "#FEF3C7"],
    bgGradient: "from-[#451a03] via-[#78350f] to-[#270f03]",
    accentColor: "border-amber-300/60 text-amber-200",
    demoSlug: "aarav-diya",
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "Sabhi Designs (All)" },
  { id: "royal", label: "👑 Rajwada & Royal Palace" },
  { id: "floral", label: "🌸 Floral & Pastel Lawn" },
  { id: "traditional", label: "🕉️ Vedic & Shubh Vivah" },
  { id: "modern", label: "✨ Contemporary Minimal" },
  { id: "south", label: "🪔 South Indian Kalyanam" },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = TEMPLATES_CATALOG.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.regionalTheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.couples.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION: Royal Indian Gallery Header */}
        <section className="relative overflow-hidden pt-14 pb-16 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          {/* Subtle Royal Motif Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-4 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-2xs font-cinzel">
              <span>✦</span>
              <span>Exclusive Patrika Gallery &bull; 2026 Collections</span>
              <span>✦</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Har Shaadi Ki Apni Kahani,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-1">
                Har Parivar Ka Apna Andaaz.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto font-sans">
              Jaipur ke Rajwada Darbar se leke Goa ke sunset lawn tak — hamare har digital card me Google Maps GPS, Haldi-Sangeet-Vivah schedule aur live RSVP headcount inbuilt hota hai.
            </p>

            {/* Live Search & Filter Bar */}
            <div className="pt-4 max-w-md mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by theme, city, or style (e.g. Rajwada, Floral, Vedic)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY FILTER PILLS */}
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === tab.id
                    ? "bg-rose-700 text-amber-50 shadow-sm border border-rose-800 scale-102"
                    : "bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50 hover:border-stone-300"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* TEMPLATES GRID */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-stone-800">
                Koi design match nahi hua
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Aap custom template request kar sakte hain — hamari Indore design team aapke physical printed card ko digital me convert kar sakti hai.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
              >
                Show All Templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Luxury Mockup Card Header Preview */}
                  <div
                    className={`h-64 bg-gradient-to-b ${item.bgGradient} p-6 flex flex-col justify-between text-white relative overflow-hidden`}
                  >
                    {/* Subtle Gold Foil Accent Frame */}
                    <div className="absolute inset-2 border border-amber-400/20 rounded-2xl pointer-events-none" />

                    {/* Top Badges */}
                    <div className="flex items-center justify-between relative z-10">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          item.tier === "Royal"
                            ? "bg-amber-400/20 text-amber-300 border-amber-300/40"
                            : item.tier === "Premium"
                            ? "bg-rose-400/20 text-rose-200 border-rose-300/40"
                            : "bg-white/10 text-stone-200 border-white/20"
                        }`}
                      >
                        {item.tier === "Royal" && <Crown className="w-2.5 h-2.5 inline mr-1 text-amber-300" />}
                        {item.tier} Edition
                      </span>

                      <span className="text-[10px] text-amber-200/80 font-cinzel tracking-widest">
                        {item.location}
                      </span>
                    </div>

                    {/* Center Royal Couple Title */}
                    <div className="text-center space-y-1.5 relative z-10 py-2">
                      <span className="text-[10px] text-amber-300/90 font-cinzel font-semibold tracking-[0.2em] block">
                        {item.subTitle}
                      </span>
                      <h3 className="font-serif text-3xl font-bold tracking-wide text-amber-100">
                        {item.couples}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 text-[10px] text-amber-200/80 font-sans">
                        <Calendar className="w-3 h-3 text-amber-300" />
                        <span>Shubh Muhurat &bull; 15 Dec 2026</span>
                      </div>
                    </div>

                    {/* Bottom Swatches & Theme Pill */}
                    <div className="flex items-center justify-between relative z-10 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-sans text-stone-300 font-medium">
                        {item.regionalTheme}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-white/40 shadow-xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Description & Inclusions */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {item.popularBadge && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                          <span>{item.popularBadge}</span>
                        </div>
                      )}

                      <h4 className="text-xl font-serif font-bold text-stone-900 group-hover:text-rose-700 transition">
                        {item.title}
                      </h4>

                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        {item.description}
                      </p>

                      {/* Feature Bullet Points */}
                      <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px] text-stone-700 font-sans">
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 font-sans">
                      <Link
                        href={`/w/${item.demoSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-rose-700 transition py-2 px-3 rounded-xl hover:bg-stone-50 border border-stone-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-600" />
                        <span>Live Demo Dekho</span>
                      </Link>

                      <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 text-xs font-bold rounded-xl shadow-xs transition group-hover:shadow-md"
                      >
                        <span>Yeh Design Chunein</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CUSTOM PHYSICAL CARD REPLICA CONCIERGE BANNER */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 text-amber-50 rounded-3xl p-8 sm:p-14 shadow-xl border border-amber-400/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
            {/* Subtle background motif */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-cinzel font-semibold">
                <span>✦</span>
                <span>Tatkal Custom Digital Replica Service</span>
                <span>✦</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 leading-tight">
                Physical Printed Card Hai? Uska Exact Digital Replica Chahiye?
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl font-sans">
                Agar aapne physical wedding card already print karva liya hai, to bas uski photo hamare Indore design desk ko WhatsApp karein. Hamari team aapke card ke exact fonts, motifs aur couple monograms ke sath <strong className="text-amber-200">24 ghante ke andar</strong> live interactive digital link deliver karegi.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300 font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>100% Same Font & Motif Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Google Maps & Live RSVP Inbuilt</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center font-sans">
              <a
                href="https://wa.me/919826012345?text=Namaste!%20Mujhe%20apne%20printed%20wedding%20card%20ka%20digital%20replica%20banvana%20hai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                <span>WhatsApp Par Card Photo Bhejo</span>
              </a>

              <Link
                href="/contact"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-amber-100 font-bold rounded-xl border border-amber-300/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>Talk to Indore Concierge</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
