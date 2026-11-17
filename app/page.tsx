"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  CalendarHeart,
  Share2,
  Users,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  MessageCircle,
  Eye,
  Check,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"haldi" | "sangeet" | "vivah" | "reception">("vivah");

  const eventPreview = {
    haldi: {
      title: "Pavitra Haldi Samaroh",
      time: "10:30 AM onwards",
      date: "14 Dec 2026",
      venue: "Poolside Lawn, Brilliant Convention Centre",
      dressCode: "Haldi Peela / Yellow Ethnic",
      badge: "Haldi",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    },
    sangeet: {
      title: "Sur & Sangeet Night",
      time: "07:00 PM onwards",
      date: "14 Dec 2026",
      venue: "Grand Crystal Ballroom, Indore",
      dressCode: "Indo-Western Glamour & Shimmer",
      badge: "Sangeet",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    },
    vivah: {
      title: "Shubh Vivah & Pheras",
      time: "06:30 PM &bull; Muhurat: 08:15 PM",
      date: "15 Dec 2026",
      venue: "Royal Mandap Lawn, BCC, Vijay Nagar",
      dressCode: "Traditional Regal & Silk Sarees / Kurta",
      badge: "Shubh Vivah",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
    },
    reception: {
      title: "Grand Wedding Reception",
      time: "07:30 PM onwards",
      date: "16 Dec 2026",
      venue: "The Grand Banquet, Bypass Road, Indore",
      dressCode: "Formal Ethnic & Western Suits",
      badge: "Reception",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION: Authentic Indian Voice & Interactive Mobile Preview */}
        <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          {/* Subtle Royal Motif Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
            {/* Left Column: Human Relatable Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Regional Cultural Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-2xs">
                <span className="text-amber-600 font-serif">ॐ</span>
                <span>Designed with Cultural Reverence in Indore, Madhya Pradesh</span>
              </div>

              {/* Punchy Headline (The Real Pain Point) */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif font-bold text-stone-900 leading-[1.18] tracking-tight">
                WhatsApp par PDF card bhejna purana ho gaya.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-1.5">
                  Bhejiye ek shandar Royal Digital Patrika.
                </span>
              </h1>

              {/* Relatable Subheading */}
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-xl font-sans">
                Haldi, Mehendi, Sangeet aur Vivah ka poora schedule ek jagah. Google Maps se 1-click direct venue navigation aur live RSVP headcount tracking — <strong className="text-stone-900 font-semibold">bina kisi app download ke</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/w/aarav-diya"
                  target="_blank"
                  className="px-6 py-3.5 bg-gradient-to-r from-rose-700 via-rose-800 to-amber-900 hover:from-rose-800 hover:to-amber-950 text-amber-50 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm border border-amber-400/30 group"
                >
                  <Eye className="w-4 h-4 text-amber-300 group-hover:scale-110 transition" />
                  <span>See Live Sample Patrika</span>
                </Link>

                <Link
                  href="/register"
                  className="px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-xs transition text-sm text-center flex items-center justify-center gap-2"
                >
                  <span>Create Free Workspace</span>
                  <ArrowRight className="w-4 h-4 text-stone-500" />
                </Link>
              </div>

              {/* WhatsApp Distribution Snippet Highlight */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Instant WhatsApp 1-Click Sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Papa ji ko call par address nahi samjhana padega</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic iPhone Mobile Simulator & WhatsApp Chat Preview */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              {/* Realistic WhatsApp Chat Bubble Popup */}
              <div className="w-full max-w-sm mb-4 bg-white rounded-2xl p-3.5 shadow-lg border border-emerald-100 flex items-start gap-3 relative z-10 animate-fade-in">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">WhatsApp Invite Preview</span>
                    <span className="text-[10px] text-stone-400">Just now</span>
                  </div>
                  <p className="text-stone-700 leading-snug">
                    💌 <em>&ldquo;Pranaam Sharma Ji! You are cordially invited to Diya &amp; Aarav&apos;s Wedding in Indore. Tap to open the digital patrika &amp; maps:&rdquo;</em>
                  </p>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold block pt-0.5">
                    shaadiconnect.in/w/aarav-diya
                  </span>
                </div>
              </div>

              {/* Realistic Luxury Mobile Frame */}
              <div className="w-full max-w-[340px] bg-stone-900 p-3 rounded-[42px] shadow-2xl border-4 border-stone-800 relative ring-1 ring-amber-400/30">
                {/* Speaker Notch */}
                <div className="w-28 h-4 bg-stone-900 rounded-b-xl mx-auto absolute top-3 left-1/2 -translate-x-1/2 z-20" />

                {/* Mobile Screen Surface */}
                <div className="bg-[#FAF7F2] rounded-[34px] overflow-hidden text-stone-800 font-serif border border-stone-200">
                  {/* Phone Header Strip */}
                  <div className="bg-gradient-to-b from-rose-950 via-rose-900 to-rose-950 text-amber-50 pt-8 pb-5 px-4 text-center relative">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300 font-sans font-bold block mb-1">
                      || श्री गणेशाय नमः ||
                    </span>
                    <h2 className="text-xl font-bold tracking-wide text-amber-100">
                      Diya <span className="text-rose-300 font-light">&amp;</span> Aarav
                    </h2>
                    <p className="text-[10px] text-amber-200/90 font-sans mt-0.5">
                      15 December 2026 &bull; Indore, MP
                    </p>

                    <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-[9px] text-amber-200 font-sans border border-amber-300/20">
                      Honoured Guest: <strong>Mr. Rajesh Sharma &amp; Family</strong>
                    </div>
                  </div>

                  {/* Interactive Ceremony Tabs Inside Phone */}
                  <div className="p-3 bg-white border-b border-stone-100">
                    <p className="text-[10px] font-sans font-bold uppercase tracking-wider text-rose-800 text-center mb-1.5">
                      Tap Ceremony to Preview Schedule
                    </p>
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-sans font-semibold">
                      {(["haldi", "sangeet", "vivah", "reception"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-1.5 rounded-lg capitalize transition cursor-pointer text-center ${
                            activeTab === tab
                              ? "bg-rose-700 text-white shadow-2xs font-bold"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Event Card Inside Phone */}
                  <div className="p-4 space-y-3 bg-[#FAF7F2]">
                    <div className="bg-white rounded-xl p-3.5 shadow-2xs border border-stone-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-bold uppercase font-sans px-2 py-0.5 rounded-full border ${eventPreview[activeTab].badgeColor}`}
                        >
                          {eventPreview[activeTab].badge}
                        </span>
                        <span className="text-[10px] font-sans text-stone-500 font-medium">
                          {eventPreview[activeTab].date}
                        </span>
                      </div>

                      <h3 className="font-bold text-stone-900 text-sm">
                        {eventPreview[activeTab].title}
                      </h3>

                      <div className="font-sans text-[11px] text-stone-600 space-y-1 pt-1 border-t border-stone-100">
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-rose-700 shrink-0" />
                          <span>{eventPreview[activeTab].time}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-rose-700 shrink-0" />
                          <span className="truncate">{eventPreview[activeTab].venue}</span>
                        </p>
                      </div>

                      {/* Map CTA Button */}
                      <a
                        href="https://maps.google.com/?q=Brilliant+Convention+Centre+Indore"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-sans font-bold text-[10px] rounded-lg flex items-center justify-center gap-1.5 transition border border-rose-200"
                      >
                        <MapPin className="w-3 h-3 text-rose-700" />
                        <span>Open Exact Location in Google Maps</span>
                      </a>
                    </div>

                    {/* Quick RSVP Bar Inside Phone */}
                    <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 flex items-center justify-between font-sans text-[11px]">
                      <div>
                        <span className="font-bold text-emerald-950 block text-[10px]">
                          Quick Attendance RSVP
                        </span>
                        <span className="text-[10px] text-emerald-700">Sharma Family &bull; 3 Attending</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px]">
                        ✓ Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE REAL WEDDING PAIN POINTS (Human & Relatable) */}
        <section className="py-20 px-6 sm:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-widest font-sans">
              Asli Samasya vs. ShaadiConnect Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
              Shaadi ki taiyari mein in 4 pareshaniyon se bachhiye
            </h2>
            <p className="text-sm text-stone-600 font-sans">
              Har saal hazaron parivaar wahi galtiyan karte hain jo traditional cards aur messy WhatsApp messages se hoti hain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            {/* Pain Point 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4 hover:border-amber-400 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-base">
                  ❌
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                    Pareshani #1
                  </span>
                  <h3 className="text-base font-bold text-stone-900">
                    &ldquo;Papa ji, lawn ka rasta kaunsa hai?&rdquo;
                  </h3>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Baarat ke din dulhe ya dulhan ke pita ko 50 rishtedaaron ke call aate hain sirf venue ka address aur landmark poochhne ke liye.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <strong className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ShaadiConnect Solution:</span>
                </strong>
                <p className="text-[11px] text-emerald-800/90 pl-5">
                  Har function card mein verified <strong>Google Maps link</strong> hota hai. Mehmaan 1 click mein sidha venue ke main gate tak GPS se pahunchte hain.
                </p>
              </div>
            </div>

            {/* Pain Point 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4 hover:border-amber-400 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-base">
                  ❌
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                    Pareshani #2
                  </span>
                  <h3 className="text-base font-bold text-stone-900">
                    &ldquo;Catering wale ko kitni plate ka order dein? 400 ya 600?&rdquo;
                  </h3>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Rishtedaaron ko bulaya toh 500 tha, lekin aayenge kitne log? Andaza lagane par ya toh khana kam pad jata hai ya lakho rupaye barbad hote hain.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <strong className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ShaadiConnect Solution:</span>
                </strong>
                <p className="text-[11px] text-emerald-800/90 pl-5">
                  Guest WhatsApp link par bina account banaye apni family ka headcount (e.g. 3 log) submit karta hai. Aapke dashboard par live count dikhta hai.
                </p>
              </div>
            </div>

            {/* Pain Point 3 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4 hover:border-amber-400 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-base">
                  ❌
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                    Pareshani #3
                  </span>
                  <h3 className="text-base font-bold text-stone-900">
                    &ldquo;Haldi kab hai aur Sangeet kab? 10 messages mein kho gaya&rdquo;
                  </h3>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                WhatsApp group me alag-alag function ke PDF ya photo bhejte hain, jo chat me upar chale jate hain aur rishtedaar date-time bhool jate hain.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <strong className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ShaadiConnect Solution:</span>
                </strong>
                <p className="text-[11px] text-emerald-800/90 pl-5">
                  Ek single digital link par Haldi, Mehendi, Sangeet aur Vivah ka sundar timeline hota hai jisme dress code aur time structured rehta hai.
                </p>
              </div>
            </div>

            {/* Pain Point 4 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4 hover:border-amber-400 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-base">
                  ❌
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                    Pareshani #4
                  </span>
                  <h3 className="text-base font-bold text-stone-900">
                    &ldquo;Kagaz ke card chapwaane mein ₹25,000+ aur hafte nikal gaye&rdquo;
                  </h3>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Printing press ke chakkar, delivery ka kharcha, aur fir bhi wedding ke agle din 90% cards dustbin me chale jate hain.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <strong className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ShaadiConnect Solution:</span>
                </strong>
                <p className="text-[11px] text-emerald-800/90 pl-5">
                  ₹299–₹799 ke one-time package mein 15 minute ke andar live royal digital patrika tayar ho jati hai jo hamesha online safe rehti hai.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: VISUAL DESIGN SHOWCASE TEASER */}
        <section className="py-16 px-6 sm:px-8 bg-gradient-to-b from-stone-900 via-rose-950 to-stone-900 text-white">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-sans">
                  Royal &amp; Modern Themes
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50">
                  Har Parivaar Ki Pasand Ke Liye Shandar Designs
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-xl">
                  Rajputi Mahal theme se lekar modern blush pastel tak — har design mobile par fast khulta hai.
                </p>
              </div>

              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold text-xs rounded-xl shadow-md transition shrink-0 font-sans"
              >
                <span>View All 50+ Templates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Featured Themes Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              {/* Card 1: Jaipur Royal */}
              <div className="bg-stone-950/80 rounded-2xl border border-amber-500/20 p-5 space-y-4 hover:border-amber-400 transition">
                <div className="h-44 rounded-xl bg-gradient-to-br from-rose-950 via-rose-900 to-amber-950 p-4 flex flex-col justify-between border border-amber-400/20">
                  <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-900/50 px-2.5 py-0.5 rounded-full w-fit">
                    Royal Heritage
                  </span>
                  <div className="text-center">
                    <p className="font-serif text-lg font-bold text-amber-100">Jaipur Royal Palace</p>
                    <p className="text-[10px] text-amber-200/80">Maroon &amp; Antique Gold</p>
                  </div>
                  <div className="text-center text-[10px] text-amber-300 font-serif">✦ ━━━ ❖ ━━━ ✦</div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Mughal &amp; Rajputi Heritage</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Traditional arches, auspicious Sanskrit shlokas, and royal palatial fonts.
                  </p>
                </div>
              </div>

              {/* Card 2: Floral Pastel */}
              <div className="bg-stone-950/80 rounded-2xl border border-amber-500/20 p-5 space-y-4 hover:border-amber-400 transition">
                <div className="h-44 rounded-xl bg-gradient-to-br from-pink-950 via-rose-900 to-stone-950 p-4 flex flex-col justify-between border border-rose-400/20">
                  <span className="text-[10px] uppercase font-bold text-rose-300 bg-rose-900/50 px-2.5 py-0.5 rounded-full w-fit">
                    Pastel Romance
                  </span>
                  <div className="text-center">
                    <p className="font-serif text-lg font-bold text-rose-100">Blush Botanical Lawn</p>
                    <p className="text-[10px] text-rose-200/80">Soft Pink, Green &amp; Gold</p>
                  </div>
                  <div className="text-center text-[10px] text-rose-300 font-serif">✦ ━━━ ❖ ━━━ ✦</div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Contemporary Garden Wedding</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Delicate watercolor eucalyptus leaves, soft pastels, and elegant calligraphy.
                  </p>
                </div>
              </div>

              {/* Card 3: Traditional Gold */}
              <div className="bg-stone-950/80 rounded-2xl border border-amber-500/20 p-5 space-y-4 hover:border-amber-400 transition">
                <div className="h-44 rounded-xl bg-gradient-to-br from-red-950 via-amber-900 to-stone-950 p-4 flex flex-col justify-between border border-amber-400/20">
                  <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-900/50 px-2.5 py-0.5 rounded-full w-fit">
                    Vedic Gold
                  </span>
                  <div className="text-center">
                    <p className="font-serif text-lg font-bold text-amber-100">Kashi Shubh Mandap</p>
                    <p className="text-[10px] text-amber-200/80">Sindoor Red &amp; Marigold</p>
                  </div>
                  <div className="text-center text-[10px] text-amber-300 font-serif">✦ ━━━ ❖ ━━━ ✦</div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Sacred Vedic Traditions</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Auspicious Kalash, sacred Agni Kund motifs, and complete muhurat timings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: REAL LOCAL TESTIMONIALS (Trust & Authenticity) */}
        <section className="py-20 px-6 sm:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-widest font-sans">
              Asli Anubhav &bull; Madhya Pradesh
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              Parivaar aur Wedding Planners Kya Kehte Hain
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Beti ki shaadi me sabse badi tension thi ki outstation rishtedaar BCC convention centre kaise pahuchenge. ShaadiConnect ke Google Maps button se sab log bina kisi call ke seedha gate par pahunch gaye!&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100">
                <p className="font-bold text-xs text-stone-900">Rajesh &amp; Sunita Verma</p>
                <p className="text-[10px] text-stone-500">Bride&apos;s Parents &bull; Vijay Nagar, Indore</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Main pichhle 8 saal se Indore mein wedding planning kar raha hoon. ShaadiConnect ke RSVP dashboard se hume catering ka exact headcount mil gaya. Client ke lagbhag ₹45,000 khane ki wastage me bach gaye.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100">
                <p className="font-bold text-xs text-stone-900">Mayank Soni</p>
                <p className="text-[10px] text-stone-500">Wedding Planner &bull; Shubh Lagan Events, Indore</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Hum apne studio ke har wedding package ke sath ek digital patrika gift karte hain. Clients itne khush hote hain ki unhe traditional cards print karane ki zaroorat hi nahi lagti.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100">
                <p className="font-bold text-xs text-stone-900">Kunal &amp; Team</p>
                <p className="text-[10px] text-stone-500">Kunal Studios &bull; Arera Colony, Bhopal</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL REGAL CALL TO ACTION */}
        <section className="pb-20 px-6 sm:px-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-amber-950 rounded-3xl p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden border border-amber-400/30 font-sans space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-amber-300 border border-amber-300/30 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 max-w-xl mx-auto leading-tight">
              Apni Shaadi Ki Digital Patrika Aaj Hi Tayar Karein
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
              15 minute mein create karein, WhatsApp par share karein aur mehmaanon ko de ek modern, regal invitation experience.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                Create Digital Patrika Free
              </Link>
              <Link
                href="/templates"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
              >
                Browse All Designs
              </Link>
            </div>

            <p className="text-[11px] text-amber-200/60 font-serif italic pt-2">
              ✦ Shubham Bhavatu &bull; Happy Wedding Planning ✦
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
