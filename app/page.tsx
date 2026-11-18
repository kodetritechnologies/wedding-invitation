"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  ShieldCheck,
  Calendar,
  Star,
  Quote,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  content: string;
}

const initialTestimonials: TestimonialItem[] = [
  {
    _id: "1",
    name: "Rajesh & Sunita Verma",
    role: "Bride's Parents",
    city: "Vijay Nagar, Indore",
    rating: 5,
    content:
      "Beti ki shaadi me sabse badi tension thi ki outstation rishtedaar BCC convention centre kaise pahuchenge. VivahVaani ke Google Maps button se sab log bina kisi call ke seedha gate par pahunch gaye!",
  },
  {
    _id: "2",
    name: "Mayank Soni",
    role: "Wedding Planner",
    city: "Shubh Lagan Events, Indore",
    rating: 5,
    content:
      "Main pichhle 8 saal se Indore mein wedding planning kar raha hoon. VivahVaani ke RSVP dashboard se hume catering ka exact headcount mil gaya. Client ke lagbhag ₹45,000 khane ki wastage me bach gaye.",
  },
  {
    _id: "3",
    name: "Kunal & Team",
    role: "Studio Director",
    city: "Kunal Studios, Bhopal",
    rating: 5,
    content:
      "Hum apne studio ke har wedding package ke sath ek digital patrika gift karte hain. Clients itne khush hote hain ki unhe traditional cards print karane ki zaroorat hi nahi lagti.",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"haldi" | "sangeet" | "vivah" | "reception">("vivah");
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/public/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.testimonials && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
        }
      } catch {
        // Fallback
      }
    }
    loadTestimonials();
  }, []);

  const displayList = testimonials.length > 0 ? testimonials : initialTestimonials;

  // Auto-slide every 5 seconds when not paused
  useEffect(() => {
    if (isPaused || displayList.length <= 1) return;
    const timer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % displayList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, displayList.length]);

  const handlePrevSlide = () => {
    setSliderIndex((prev) => (prev === 0 ? displayList.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setSliderIndex((prev) => (prev + 1) % displayList.length);
  };

  const eventPreview = {
    haldi: {
      title: "पवित्र हल्दी समारोह",
      titleEn: "Pavitra Haldi Samaroh",
      time: "10:30 AM onwards",
      date: "14 Dec 2026",
      venue: "Poolside Lawn, Brilliant Convention Centre",
      dressCode: "Haldi Peela / Yellow Ethnic",
      badge: "हल्दी • Haldi",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    },
    sangeet: {
      title: "सुर & संगीत संध्या",
      titleEn: "Sur & Sangeet Night",
      time: "07:00 PM onwards",
      date: "14 Dec 2026",
      venue: "Grand Crystal Ballroom, Indore",
      dressCode: "Indo-Western Glamour & Shimmer",
      badge: "संगीत • Sangeet",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    },
    vivah: {
      title: "शुभ विवाह & पाणिग्रहण संस्कार",
      titleEn: "Shubh Vivah & Pheras",
      time: "06:30 PM • Muhurat: 08:15 PM",
      date: "15 Dec 2026",
      venue: "Royal Mandap Lawn, BCC, Vijay Nagar",
      dressCode: "Traditional Regal & Silk Sarees / Kurta",
      badge: "शुभ विवाह • Vivah",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
    },
    reception: {
      title: "मंगल प्रीतिभोज & आशीर्वाद",
      titleEn: "Grand Wedding Reception",
      time: "07:30 PM onwards",
      date: "16 Dec 2026",
      venue: "The Grand Banquet, Bypass Road, Indore",
      dressCode: "Formal Ethnic & Western Suits",
      badge: "प्रीतिभोज • Reception",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION: Authentic Indian Voice & Viewport-Fitted Interactive Mobile Preview */}
        <section className="relative overflow-hidden py-12 lg:py-16 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          {/* Subtle Royal Motif Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative">
            {/* Left Column: Human Relatable Copy */}
            <div className="lg:col-span-6 space-y-5 text-left">
              {/* Regional Cultural Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-2xs">
                <span className="text-amber-600 font-serif">ॐ</span>
                <span>Designed with Cultural Reverence in Indore, Madhya Pradesh</span>
              </div>

              {/* Punchy Headline (The Real Pain Point) */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold text-stone-900 leading-[1.18] tracking-tight">
                WhatsApp par PDF card bhejna purana ho gaya.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-1">
                  Bhejiye ek shandar Royal Digital Patrika.
                </span>
              </h1>

              {/* Relatable Subheading */}
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-lg font-sans">
                Haldi, Mehendi, Sangeet aur Vivah ka poora schedule ek jagah. Google Maps se 1-click direct venue navigation aur live RSVP headcount tracking — <strong className="text-stone-900 font-semibold">bina kisi app download ke</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/w/aarav-diya"
                  target="_blank"
                  className="px-6 py-3 bg-gradient-to-r from-rose-700 via-rose-800 to-amber-900 hover:from-rose-800 hover:to-amber-950 text-amber-50 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm border border-amber-400/30 group"
                >
                  <Eye className="w-4 h-4 text-amber-300 group-hover:scale-110 transition" />
                  <span>See Live Sample Patrika</span>
                </Link>

                <Link
                  href="/register"
                  className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-xs transition text-sm text-center flex items-center justify-center gap-2"
                >
                  <span>Create Free Workspace</span>
                  <ArrowRight className="w-4 h-4 text-stone-500" />
                </Link>
              </div>

              {/* WhatsApp Distribution Snippet Highlight */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-medium">
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

            {/* Right Column: Modern Interactive Royal Patrika Device Showcase */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
              {/* Outer Decorative Glow Halo */}
              <div className="absolute -inset-4 bg-radial from-amber-400/15 via-rose-400/5 to-transparent rounded-[48px] blur-2xl pointer-events-none" />

              {/* Floating Satellite Card 1: Top-Right WhatsApp Invite Delivery */}
              <div className="hidden sm:flex absolute -top-5 -right-2 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-emerald-200 items-center gap-3 animate-bounce [animation-duration:5s]">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm p-1.5 border border-emerald-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full object-contain" />
                </div>
                <div className="text-left text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-950 text-[11px]">WhatsApp Invite</span>
                    <span className="text-[10px] text-emerald-600 font-medium font-sans">Delivered ✓✓</span>
                  </div>
                  <p className="text-stone-600 text-[11px] font-sans">
                    Sharma ji opened: <strong>Diya &amp; Aarav Vivah</strong>
                  </p>
                </div>
              </div>

              {/* Floating Satellite Card 2: Bottom-Left Live Headcount Tracker */}
              <div className="hidden sm:flex absolute -bottom-5 -left-3 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-amber-200 items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900 text-[11px]">Live RSVP Tracker</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-stone-600 text-[11px] font-sans">
                    <strong>184 Guests Attending</strong> &bull; 12 Jain Meals
                  </p>
                </div>
              </div>

              {/* The Realistic iPhone Luxury Mockup */}
              <div className="w-full max-w-[370px] bg-stone-900 p-3 rounded-[44px] shadow-2xl border-4 border-stone-800 relative ring-2 ring-amber-400/30 z-10">
                {/* Dynamic Island Notch */}
                <div className="w-24 h-4 bg-stone-950 rounded-full mx-auto absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-between px-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] text-amber-200 font-sans tracking-wide">Shehnai 🎵</span>
                </div>

                {/* Mobile Screen Surface */}
                <div className="bg-[#FAF7F2] rounded-[34px] overflow-hidden text-stone-800 font-serif border border-stone-200/90 shadow-inner">
                  {/* Phone Header Banner */}
                  <div className="bg-gradient-to-b from-rose-950 via-rose-900 to-rose-950 text-amber-50 pt-7 pb-4 px-4 text-center relative">
                    <span className="text-xs tracking-wider text-amber-300 font-devanagari font-bold block mb-1">
                      ॥ श्री गणेशाय नमः ॥
                    </span>

                    {/* Royal Monogram Ring */}
                    <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-300/60 flex items-center justify-center text-amber-100 font-cinzel font-bold text-sm shadow-md mb-1.5">
                      A&amp;D
                    </div>

                    <h2 className="text-2xl font-bold tracking-wide font-serif text-amber-100">
                      Diya <span className="text-rose-300 font-serif italic text-lg">&amp;</span> Aarav
                    </h2>

                    <p className="text-[10px] text-amber-200/90 font-cinzel tracking-wider mt-0.5">
                      15 December 2026 &bull; Indore, MP
                    </p>

                    <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-[9px] text-amber-200 font-sans border border-amber-300/25">
                      Honoured Guest: <strong>Mr. Rajesh Sharma &amp; Family</strong>
                    </div>
                  </div>

                  {/* Interactive Ceremony Tabs Inside Phone */}
                  <div className="px-2.5 py-2 bg-white border-b border-stone-200/70">
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-sans font-semibold">
                      {[
                        { id: "haldi", hi: "हल्दी", en: "Haldi" },
                        { id: "sangeet", hi: "संगीत", en: "Sangeet" },
                        { id: "vivah", hi: "विवाह", en: "Vivah" },
                        { id: "reception", hi: "प्रीतिभोज", en: "Reception" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as "haldi" | "sangeet" | "vivah" | "reception")}
                          className={`py-1 rounded-md transition cursor-pointer text-center ${
                            activeTab === item.id
                              ? "bg-rose-800 text-white shadow-xs font-bold"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                          }`}
                        >
                          <span className="block font-devanagari text-[11px] font-bold leading-tight">{item.hi}</span>
                          <span className="block text-[8px] opacity-75 font-sans leading-none">{item.en}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Event Card Inside Phone */}
                  <div className="p-3.5 space-y-2.5 bg-[#FAF7F2]">
                    <div className="bg-white rounded-2xl p-3 shadow-xs border border-stone-200 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold font-devanagari px-2.5 py-0.5 rounded-full border ${eventPreview[activeTab].badgeColor}`}
                        >
                          {eventPreview[activeTab].badge}
                        </span>
                        <span className="text-[10px] font-sans text-stone-500 font-medium">
                          {eventPreview[activeTab].date}
                        </span>
                      </div>

                      <h3 className="font-rozha text-stone-900 text-base leading-snug">
                        {eventPreview[activeTab].title}
                      </h3>

                      <div className="font-sans text-[11px] text-stone-600 space-y-1 pt-1.5 border-t border-stone-100">
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
                        className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-sans font-bold text-[10px] rounded-lg flex items-center justify-center gap-1.5 transition border border-rose-200 cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-rose-700" />
                        <span>Navigate in Google Maps</span>
                      </a>
                    </div>

                    {/* Quick RSVP Bar Inside Phone */}
                    <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 flex items-center justify-between font-sans text-xs">
                      <div className="text-left">
                        <span className="font-bold text-emerald-950 block text-[10px]">
                          Live Attendance RSVP
                        </span>
                        <span className="text-[9px] text-emerald-700">Sharma Family &bull; 3 Attending</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>Confirmed</span>
                      </span>
                    </div>

                    {/* Preview Link inside phone */}
                    <Link
                      href="/w/aarav-diya"
                      target="_blank"
                      className="block text-center text-[10px] font-sans font-bold text-amber-800 hover:text-amber-950 pt-1"
                    >
                      Tap to open full experience →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE REAL WEDDING PAIN POINTS (Human & Relatable Redesign) */}
        <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto space-y-14">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-2xs font-sans">
              <span className="text-amber-600 font-serif">✦</span>
              <span>Purana Kagazi Tareeka vs. VivahVaani Smart Patrika</span>
              <span className="text-amber-600 font-serif">✦</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Shaadi ki taiyari mein in 4 pareshaniyon se bachhiye
            </h2>

            <p className="text-sm sm:text-base text-stone-600 font-sans max-w-2xl mx-auto leading-relaxed">
              Traditional printed cards aur messy WhatsApp PDF se hone wale confusion aur fizulkharchi ko khatam karein.
            </p>
          </div>

          {/* 4 Redesigned Problem vs Solution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
            {/* Card 1: Venue Navigation */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400/80 hover:shadow-md transition-all duration-300 group">
              {/* Top: The Real Problem */}
              <div className="p-6 sm:p-7 bg-gradient-to-b from-red-50/50 to-white border-b border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                    Pareshani #01 &bull; Address &amp; Navigation
                  </span>
                  <span className="text-xs font-semibold text-red-500 font-mono">Purana Tareeka ✕</span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  &ldquo;Papa ji, lawn ka rasta kaunsa hai? Landmark bataiye!&rdquo;
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Baarat ke din dulhe ya dulhan ke pita ko 50 rishtedaaron ke call aate hain sirf lawn ka rasta poochhne ke liye. Khushi ke din phone pakad kar rasta batana padta hai.
                </p>
              </div>

              {/* Bottom: The ShaadiConnect Solution */}
              <div className="p-6 sm:p-7 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>VivahVaani Solution</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Google Maps GPS
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  Har function card mein verified <strong>Google Maps link</strong> hota hai. Mehmaan 1 click mein sidha venue ke main gate tak GPS turn-by-turn navigation se pahunchte hain.
                </p>

                <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Zero confusing phone calls on wedding day</span>
                </div>
              </div>
            </div>

            {/* Card 2: Food & Catering Waste */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400/80 hover:shadow-md transition-all duration-300 group">
              {/* Top: The Real Problem */}
              <div className="p-6 sm:p-7 bg-gradient-to-b from-red-50/50 to-white border-b border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                    Pareshani #02 &bull; Catering &amp; Headcount
                  </span>
                  <span className="text-xs font-semibold text-red-500 font-mono">Purana Tareeka ✕</span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  &ldquo;Catering wale ko kitni plate ka order dein? 400 ya 600?&rdquo;
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Bulaya 500 ko tha, par aayenge kitne log? Sirf andaza lagane se ya toh khana kam padne ka darr rehta hai ya fir lakho rupaye ka khana barbad hota hai.
                </p>
              </div>

              {/* Bottom: The ShaadiConnect Solution */}
              <div className="p-6 sm:p-7 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>VivahVaani Solution</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Live RSVP Tracker
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  Guest WhatsApp invite par bina app download kiye <strong>1-click me attending headcount (e.g. 3 log)</strong> submit karte hain. Aapke dashboard par real headcount live dikhta hai.
                </p>

                <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Exact catering budget &bull; Zero food wastage</span>
                </div>
              </div>
            </div>

            {/* Card 3: Lost Messages & Scattered Timings */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400/80 hover:shadow-md transition-all duration-300 group">
              {/* Top: The Real Problem */}
              <div className="p-6 sm:p-7 bg-gradient-to-b from-red-50/50 to-white border-b border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                    Pareshani #03 &bull; Events &amp; Timings
                  </span>
                  <span className="text-xs font-semibold text-red-500 font-mono">Purana Tareeka ✕</span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  &ldquo;Haldi kab hai aur Sangeet kab? Chat mein PDF kho gaya!&rdquo;
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  WhatsApp par alag-alag photos ya heavy PDF bhejne par log download karna bhool jate hain aur chat me link kho jane se function ke time par late aate hain.
                </p>
              </div>

              {/* Bottom: The ShaadiConnect Solution */}
              <div className="p-6 sm:p-7 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>VivahVaani Solution</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    All-in-One Timeline
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  Ek single digital link par Haldi, Mehendi, Sangeet aur Vivah ka sundar timeline hota hai jisme dress code, shubh muhurat aur phone numbers structured rehte hain.
                </p>

                <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Subah se shaam tak har function ka clear time</span>
                </div>
              </div>
            </div>

            {/* Card 4: Expensive Printing Press */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400/80 hover:shadow-md transition-all duration-300 group">
              {/* Top: The Real Problem */}
              <div className="p-6 sm:p-7 bg-gradient-to-b from-red-50/50 to-white border-b border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                    Pareshani #04 &bull; Heavy Printing Cost
                  </span>
                  <span className="text-xs font-semibold text-red-500 font-mono">Purana Tareeka ✕</span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  &ldquo;Kagaz ke card chapwaane mein ₹25,000+ aur 3 hafte nikal gaye&rdquo;
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Printing press ke chakkar, delivery ka kharcha, aur fir bhi shaadi ke agle din 90% mehnge kagaz ke cards dustbin mein chale jate hain.
                </p>
              </div>

              {/* Bottom: The ShaadiConnect Solution */}
              <div className="p-6 sm:p-7 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>VivahVaani Solution</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    15-Min Live Delivery
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  Sirf ₹299 se shuru hone wale package mein <strong>15 minute ke andar live royal patrika</strong> tayar hoti hai jise WhatsApp par unlimited rishtedaaron ko instant bhej sakte hain.
                </p>

                <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>90% budget ki bachat &bull; Eco-friendly &amp; instant</span>
                </div>
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
                    <p className="font-rozha text-xl text-amber-100">जयपुर राजसी मण्डप</p>
                    <p className="text-[10px] text-amber-200/80 font-sans">Jaipur Royal Heritage &bull; Maroon &amp; Gold</p>
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
                    <p className="font-rozha text-xl text-rose-100">गुलाब पुष्प वाटिका</p>
                    <p className="text-[10px] text-rose-200/80 font-sans">Blush Botanical Lawn &bull; Pastel Romance</p>
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
                    <p className="font-rozha text-xl text-amber-100">काशी शुभ मण्डप</p>
                    <p className="text-[10px] text-amber-200/80 font-sans">Kashi Vedic Mandap &bull; Sindoor &amp; Marigold</p>
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

        {/* SECTION 4: REAL LOCAL TESTIMONIALS SLIDER (Fully Dynamic from Super Admin) */}
        <section className="py-20 px-6 sm:px-8 max-w-6xl mx-auto space-y-10">
          {/* Section Header with Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-stone-200 pb-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 font-sans uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-700" />
                Asli Anubhav &bull; Madhya Pradesh
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                Parivaar aur Wedding Planners Kya Kehte Hain
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-sans">
                VivahVaani ke zariye 500+ parivaar apne mehmaanon ko de chuke hain royal digital invitation ka anubhav.
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3 shrink-0 font-sans">
              <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
                0{sliderIndex + 1} / 0{displayList.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="w-10 h-10 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-500 text-stone-700 hover:text-amber-600 flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
                  aria-label="Pichla review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="w-10 h-10 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-500 text-stone-700 hover:text-amber-600 flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
                  aria-label="Agla review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Slider Card */}
          {displayList.length > 0 && (
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm overflow-hidden transition-all duration-300"
            >
              {/* Background Watermark Quote */}
              <Quote className="absolute right-6 -bottom-6 w-44 h-44 text-amber-500/10 pointer-events-none select-none rotate-12" />

              <div className="relative z-10 space-y-6">
                {/* Rating & Verified Tag */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: displayList[sliderIndex]?.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-900 font-sans ml-1">
                      {displayList[sliderIndex]?.rating || 5}.0
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs text-stone-600 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Wedding Experience
                  </span>
                </div>

                {/* Main Quote */}
                <blockquote className="text-lg sm:text-2xl font-serif text-stone-900 leading-relaxed italic">
                  &ldquo;{displayList[sliderIndex]?.content}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-stone-100 font-sans">
                  <div className="w-12 h-12 rounded-full bg-rose-900 text-amber-200 flex items-center justify-center font-bold text-sm border-2 border-amber-300/40 shrink-0">
                    {displayList[sliderIndex]?.name
                      ?.split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "SC"}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-stone-900">
                      {displayList[sliderIndex]?.name}
                    </h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-medium text-rose-800">
                        {displayList[sliderIndex]?.role}
                      </span>
                      <span>&bull;</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {displayList[sliderIndex]?.city}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {displayList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSliderIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === sliderIndex ? "w-8 bg-amber-500" : "w-2 bg-stone-200 hover:bg-stone-300"
                }`}
              />
            ))}
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
