"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Eye,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  Quote,
  HeartHandshake,
  Cake,
  Flame,
  Wine,
  PartyPopper,
  CheckCircle2,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { BRAND } from "@/lib/brand";
import { CATALOG, PRICES } from "@/lib/catalog";
import { FEATURES } from "@/lib/features";

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
      "Beti ki shaadi me sabse badi tension thi ki outstation rishtedaar BCC convention centre kaise pahuchenge. Google Maps button se sab log bina kisi call ke seedha gate par pahunch gaye!",
  },
  {
    _id: "2",
    name: "Mayank Soni",
    role: "Wedding Planner",
    city: "Shubh Lagan Events, Indore",
    rating: 5,
    content:
      "RSVP dashboard se hume catering ka exact headcount mil gaya. Client ke lagbhag ₹45,000 khane ki wastage me bach gaye. Shaandaar experience!",
  },
  {
    _id: "3",
    name: "Kunal & Team",
    role: "Studio Director",
    city: "Kunal Studios, Bhopal",
    rating: 5,
    content:
      "Hum apne studio ke har wedding package ke sath ek digital patrika gift karte hain. Clients itne khush hote hain ki physical cards print karane ki zaroorat hi nahi lagti.",
  },
];

const initialFaqs = [
  {
    q: "What is a digital wedding invitation?",
    a: "An online invitation shared as a video, PDF or web link on WhatsApp, so you do not need to print or deliver physical cards door-to-door.",
  },
  {
    q: "What is the difference between Video, PDF and Website invitations?",
    a: "Video is an animated clip with music, ideal for WhatsApp Status and Reels. PDF is a clean printable card. Website is an interactive single link with all events, Google Maps navigation and live RSVP headcount.",
  },
  {
    q: "Do I get a PDF if I choose the Website invitation?",
    a: "Yes. The Website invitation includes a free downloadable PDF and a shareable web link. Video is a separate animated product.",
  },
  {
    q: "Do guests need to install an app?",
    a: "No. The invitation link opens instantly in any smartphone browser (Chrome, Safari, WhatsApp in-app browser).",
  },
  {
    q: "Can I add Haldi, Mehndi, Sangeet, Wedding and Reception in one invitation?",
    a: "Yes. On the Website invitation you can add every ceremony with its own shubh muhurat time, venue address, and 1-click Google Maps GPS link.",
  },
  {
    q: "Can guests see the venue location?",
    a: "Yes. Every ceremony card features a direct Google Maps button for turn-by-turn driving navigation.",
  },
  {
    q: "Can I track who is coming?",
    a: "Yes. Website invitations include built-in RSVP tracking with real-time guest headcount submission.",
  },
  {
    q: "Can I make invitations for birthdays and other occasions?",
    a: "Yes. In addition to weddings, we offer dedicated designs for Engagement, Birthday, Anniversary, Griha Pravesh (House Warming), and Reception.",
  },
];

export default function HomePage() {
  const [themeFormat, setThemeFormat] = useState<"all" | "video" | "website" | "pdf">("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(initialFaqs);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [phoneActiveTab, setPhoneActiveTab] = useState<"haldi" | "sangeet" | "vivah" | "reception">("vivah");

  // Fetch testimonials dynamically from existing API
  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/public/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
        }
      } catch {
        // Fallback to initial testimonials
      }
    }
    loadTestimonials();
  }, []);

  // Fetch FAQs dynamically from public API
  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/public/faqs?category=general");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.faqs) && data.faqs.length > 0) {
            setFaqs(
              data.faqs.map((f: { question: string; answer: string }) => ({
                q: f.question,
                a: f.answer,
              }))
            );
          }
        }
      } catch {
        // Fallback to initial static FAQs
      }
    }
    loadFaqs();
  }, []);

  // Testimonials Auto-advance every 5 seconds (pauses on hover or focus)
  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const handlePrevSlide = () => {
    setSliderIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setSliderIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Filter Wedding Catalog by Format (ALL, VIDEO, INVITATION WEBSITE, PDF)
  const filteredWeddingCatalog = CATALOG.filter((item) => {
    if (item.occasion !== "wedding") return false;
    if (themeFormat === "all") return true;
    return item.format === themeFormat;
  });

  const phonePreviewEvents = {
    haldi: {
      title: "हल्दी एवं मेहंदी उत्सव",
      time: "10:30 AM onwards",
      date: "14 Dec 2026",
      venue: "Poolside Lawn, Hotel Sayaji, Indore",
      badge: "हल्दी • Haldi",
      color: "bg-amber-100 text-amber-900 border-amber-300",
    },
    sangeet: {
      title: "संगीत संध्या एवं डीजे नाइट",
      time: "07:00 PM onwards",
      date: "14 Dec 2026",
      venue: "Grand Ballroom, Hotel Sayaji, Indore",
      badge: "संगीत • Sangeet",
      color: "bg-purple-100 text-purple-900 border-purple-300",
    },
    vivah: {
      title: "शुभ विवाह एवं पाणिग्रहण संस्कार",
      time: "06:30 PM (शुभ लग्न 08:15 PM)",
      date: "15 Dec 2026",
      venue: "Brilliant Convention Centre, Vijay Nagar, Indore",
      badge: "शुभ लग्न • Main Vivah",
      color: "bg-rose-100 text-rose-950 border-rose-300",
    },
    reception: {
      title: "मंगल प्रीतिभोज एवं आशीर्वाद",
      time: "07:30 PM onwards",
      date: "16 Dec 2026",
      venue: "The Grand Banquet, Bypass Road, Indore",
      badge: "प्रीतिभोज • Reception",
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BRAND.siteUrl}#organization`,
        name: BRAND.name,
        url: BRAND.siteUrl,
        logo: `${BRAND.siteUrl}/logo.png`,
        description: BRAND.tagline,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: `+${BRAND.whatsapp}`,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["Hindi", "English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BRAND.siteUrl}#website`,
        url: BRAND.siteUrl,
        name: BRAND.name,
        publisher: {
          "@id": `${BRAND.siteUrl}#organization`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${BRAND.siteUrl}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicHeader />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* SECTION 4.1: HERO SECTION                                                */}
        {/* ========================================================================= */}
        <section
          className="relative min-h-screen flex items-center overflow-hidden py-16 sm:py-20 px-4 sm:px-8 border-b border-amber-900/20 text-white"
          style={{
            backgroundImage: "url('/assets/bg/royal-maroon-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Subtle Dark Gradient Overlay for optimal legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/50 bg-black/25 backdrop-blur-xs text-amber-200 text-xs tracking-wider">
                <span className="text-amber-400 font-bold">✦</span>
                <span className="font-medium">Create • Share • Celebrate</span>
              </div>

              {/* Royal Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-bold text-amber-100 leading-[1.15] tracking-tight drop-shadow-md">
                Your Special Moments,<br />
                <span className="text-[#FDF2D0]">Now Digital</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-amber-100/90 leading-relaxed max-w-xl font-normal drop-shadow-xs">
                Create stunning wedding, engagement and birthday invitation cards online. Get a shareable URL and PDF instantly.
              </p>

              {/* Main CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/wedding"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#DFB76C] via-[#EDD08D] to-[#D5A958] hover:from-[#EDD08D] hover:to-[#DFB76C] text-[#42050D] font-bold rounded-full shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base border border-amber-300 min-h-[46px] group"
                >
                  <span className="font-semibold">💍 Create Your Invitation</span>
                  <ArrowRight className="w-4 h-4 text-[#42050D] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/w/aarav-diya"
                  target="_blank"
                  className="px-6 py-3.5 bg-black/35 hover:bg-black/50 text-amber-100 font-semibold rounded-full border border-amber-400/40 backdrop-blur-xs transition text-sm sm:text-base flex items-center justify-center gap-2.5 min-h-[46px]"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-200/20 flex items-center justify-center text-amber-300 text-xs">▶</span>
                  <span>Watch Demo</span>
                </Link>
              </div>

              {/* 3 Value Props Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm text-amber-100/95 font-medium border-t border-amber-400/20">
                <div className="flex items-center gap-2.5">
                  <span className="text-amber-400 text-base">⚡</span>
                  <div>
                    <span className="block font-semibold text-white">Instant</span>
                    <span className="text-amber-200/80 text-[11px]">Shareable Link</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-amber-400 text-base">📄</span>
                  <div>
                    <span className="block font-semibold text-white">Download</span>
                    <span className="text-amber-200/80 text-[11px]">PDF</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-amber-400 text-base">🔗</span>
                  <div>
                    <span className="block font-semibold text-white">Easy to Share</span>
                    <span className="text-amber-200/80 text-[11px]">Via WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Ornamental script line */}
              <div className="pt-1 text-amber-300/85 italic font-serif text-sm tracking-wide">
                ✦ Make your celebrations more memorable ✦
              </div>
            </div>

            {/* Empty right column so the background image artwork and Diya/Aarav phone in the banner are clearly visible */}
            <div className="hidden lg:block lg:col-span-5" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4.2: CATEGORIES (Royal Maroon Indian Arch Cards)                  */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-8 bg-[#FDFBF7] relative">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Header with Traditional Lotus divider */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              {/* Top Ornamental Lotus Motif with thin gold rules */}
              <div className="flex items-center justify-center gap-3 text-[#D6A64B]">
                <div className="h-[1.5px] w-20 sm:w-36 bg-gradient-to-r from-transparent to-[#D6A64B]" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#D6A64B]">◇</span>
                  <svg className="w-8 h-8 text-[#D6A64B]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M32 8 C32 8 20 28 32 48 C44 28 32 8 32 8 Z" fill="currentColor" fillOpacity="0.15" />
                    <path d="M32 20 C22 28 14 38 18 48 C26 48 32 40 32 40 C32 40 38 48 46 48 C50 38 42 28 32 20 Z" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="32" cy="48" r="2" fill="currentColor" />
                    <path d="M12 44 C8 44 6 40 10 36 C14 36 18 40 18 44 Z" fill="currentColor" />
                    <path d="M52 44 C56 44 58 40 54 36 C50 36 46 40 46 44 Z" fill="currentColor" />
                  </svg>
                  <span className="text-[10px] text-[#D6A64B]">◇</span>
                </div>
                <div className="h-[1.5px] w-20 sm:w-36 bg-gradient-to-l from-transparent to-[#D6A64B]" />
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#720E16]">
                Invitations for Every <span className="text-[#D6A64B]">Celebration</span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-normal">
                Explore a wide range of beautifully designed invitation cards for all your special moments.
              </p>

              {/* Bottom Lotus Divider */}
              <div className="flex items-center justify-center gap-3 pt-1 text-[#D6A64B]">
                <div className="h-[1.5px] w-14 sm:w-24 bg-gradient-to-r from-transparent to-[#D6A64B]" />
                <div className="flex items-center gap-1">
                  <span className="text-xs">✦</span>
                  <svg className="w-5 h-5 text-[#D6A64B]" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 4 C16 4 10 14 16 24 C22 14 16 4 16 4 Z" />
                    <path d="M16 10 C11 14 7 19 9 24 C13 24 16 20 16 20 C16 20 19 24 23 24 C25 19 21 14 16 10 Z" opacity="0.7" />
                  </svg>
                  <span className="text-xs">✦</span>
                </div>
                <div className="h-[1.5px] w-14 sm:w-24 bg-gradient-to-l from-transparent to-[#D6A64B]" />
              </div>
            </div>

            {/* Arch Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
              {[
                {
                  name: "Wedding",
                  line: "For your big day",
                  href: "/wedding",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="14" r="5" />
                      <circle cx="15" cy="11" r="5" />
                      <path d="M15 6 L16 4 L14 4 Z" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  name: "Engagement",
                  line: "Mark the beginning",
                  href: "/engagement",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 21 L8 14 L5 8 L11 8 L8 14" />
                      <path d="M16 21 L16 14 L13 8 L19 8 L16 14" />
                      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  name: "Birthday",
                  line: "Celebrate life",
                  href: "/birthday",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <line x1="4" y1="15" x2="20" y2="15" />
                      <line x1="8" y1="10" x2="8" y2="6" />
                      <line x1="12" y1="10" x2="12" y2="6" />
                      <line x1="16" y1="10" x2="16" y2="6" />
                    </svg>
                  ),
                },
                {
                  name: "Anniversary",
                  line: "Cherish together",
                  href: "/anniversary",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 14 C5 18 19 18 19 14 C19 12 12 11 12 11 C12 11 5 12 5 14 Z" />
                      <path d="M12 4 C12 4 10 7 10 9 C10 10.1 10.9 11 12 11 C13.1 11 14 10.1 14 9 C14 7 12 4 12 4 Z" fill="currentColor" />
                      <line x1="12" y1="18" x2="12" y2="21" />
                      <line x1="9" y1="21" x2="15" y2="21" />
                    </svg>
                  ),
                },
                {
                  name: "House Warming",
                  line: "Welcome home",
                  href: "/housewarming",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 10.5 L12 3 L21 10.5" />
                      <path d="M6 9.5 V20 H18 V9.5" />
                      <rect x="10" y="14" width="4" height="6" />
                    </svg>
                  ),
                },
                {
                  name: "Reception",
                  line: "Share the joy",
                  href: "/reception",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="8" width="18" height="4" rx="1" />
                      <rect x="4" y="12" width="16" height="9" rx="1" />
                      <path d="M12 8 V21" />
                      <path d="M8 8 C8 5 12 5 12 8 C12 5 16 5 16 8" />
                    </svg>
                  ),
                },
              ].map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  className="group relative bg-[#720E16] text-center flex flex-col items-center justify-between p-5 pt-8 pb-6 transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1.5 border-2 border-[#D6A64B] hover:border-[#F2C76E]"
                  style={{
                    borderRadius: "48px 48px 20px 20px",
                  }}
                >
                  {/* Subtle Inner Golden Hairline Arch (Double Border Effect) */}
                  <div
                    className="absolute inset-1.5 pointer-events-none border border-[#D6A64B]/60 group-hover:border-[#F2C76E] transition-colors"
                    style={{ borderRadius: "42px 42px 16px 16px" }}
                  />

                  {/* Top Traditional Arch Crown Motif */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[#D6A64B] group-hover:text-[#F2C76E] transition-colors">
                    <svg className="w-6 h-3.5" viewBox="0 0 32 16" fill="currentColor">
                      <path d="M16 1 C18 5 24 7 28 8 C22 9 18 12 16 16 C14 12 10 9 4 8 C8 7 14 5 16 1 Z" />
                      <circle cx="16" cy="3" r="1.5" />
                    </svg>
                  </div>

                  {/* Circular Icon Container */}
                  <div className="w-14 h-14 rounded-full bg-[#5A0910] text-[#D6A64B] group-hover:text-[#F2C76E] border-2 border-[#D6A64B] group-hover:border-[#F2C76E] flex items-center justify-center shadow-inner group-hover:scale-105 transition-all duration-300 mt-2">
                    {cat.icon}
                  </div>

                  {/* Category Title & Description */}
                  <div className="mt-4 mb-3">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#FFF3DA] tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#FFF3DA]/80 mt-1 font-normal">
                      {cat.line}
                    </p>
                  </div>

                  {/* Button: View Designs -> */}
                  <div className="w-full pt-1">
                    <span className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full border border-[#D6A64B] bg-[#5A0910]/60 text-[#FFF3DA] font-semibold text-[11px] sm:text-xs group-hover:bg-[#D6A64B] group-hover:text-[#720E16] group-hover:border-[#D6A64B] transition-all duration-300 shadow-2xs">
                      <span>View Designs</span>
                      <span className="text-xs transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom Ornamental Ending */}
            <div className="flex items-center justify-center gap-3 text-[#D6A64B] pt-4">
              <div className="h-[1.5px] w-24 sm:w-44 bg-gradient-to-r from-transparent to-[#D6A64B]" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#D6A64B]">◇</span>
                <svg className="w-8 h-8 text-[#D6A64B]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M32 8 C32 8 20 28 32 48 C44 28 32 8 32 8 Z" fill="currentColor" fillOpacity="0.15" />
                  <path d="M32 20 C22 28 14 38 18 48 C26 48 32 40 32 40 C32 40 38 48 46 48 C50 38 42 28 32 20 Z" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="32" cy="48" r="2" fill="currentColor" />
                  <path d="M12 44 C8 44 6 40 10 36 C14 36 18 40 18 44 Z" fill="currentColor" />
                  <path d="M52 44 C56 44 58 40 54 36 C50 36 46 40 46 44 Z" fill="currentColor" />
                </svg>
                <span className="text-[10px] text-[#D6A64B]">◇</span>
              </div>
              <div className="h-[1.5px] w-24 sm:w-44 bg-gradient-to-l from-transparent to-[#D6A64B]" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4.3: EASY STEPS (Royal Indian Wedding Step Cards)                */}
        {/* ========================================================================= */}
       <section
          className="relative overflow-hidden pt-6 pb-0 px-0 bg-[#5A0A10] text-[#FFF3DA] font-sans"
          style={{
            backgroundImage: "url('/assets/steps/bg-textured.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Shared SVG defs: gradients + bottom edge paths (ek hi baar) */}
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <linearGradient id="steps-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F6D88E" />
                <stop offset="0.5" stopColor="#D6A64B" />
                <stop offset="1" stopColor="#B9812B" />
              </linearGradient>
              <linearGradient id="steps-gold-h" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#B9812B" />
                <stop offset="0.2" stopColor="#F2CF84" />
                <stop offset="0.5" stopColor="#D6A64B" />
                <stop offset="0.8" stopColor="#F2CF84" />
                <stop offset="1" stopColor="#B9812B" />
              </linearGradient>
              <linearGradient id="steps-card-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FEFCF8" />
                <stop offset="1" stopColor="#FBF7EE" />
              </linearGradient>
              <path
                id="steps-edge"
                d="M0,8 C40,26 90,40 138,40 C165,40 168,58 188,72 C208,88 250,96 296,96 C420,96 500,140 580,166 C640,185 690,188 720,198"
              />
              <path
                id="steps-cream"
                d="M0,8 C40,26 90,40 138,40 C165,40 168,58 188,72 C208,88 250,96 296,96 C420,96 500,140 580,166 C640,185 690,188 720,198 L720,200 L0,200 Z"
              />
            </defs>
          </svg>

          {/* Smooth subtle dark overlay so bg-textured image is clearly visible */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-b from-[#5F0A11]/60 via-[#590910]/30 to-[#5A0A10]/70"
          />

          <div className="max-w-[1140px] mx-auto relative z-10 px-4 sm:px-8 pb-4">
            {/* Section Heading with Lotus Divider */}
            <div className="text-center max-w-5xl mx-auto">
              {/* Top Golden Lotus Divider */}
              <div className="flex items-center justify-center gap-2 max-w-[680px] w-full mx-auto" aria-hidden="true">
                <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9923A] to-[#EBB95E]" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#EBB95E] shrink-0" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/steps/lotus-divider.png"
                  alt=""
                  className="h-12 w-[84px] object-cover object-center shrink-0 drop-shadow-md"
                />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#EBB95E] shrink-0" />
                <span className="flex-1 h-px bg-gradient-to-l from-transparent via-[#C9923A] to-[#EBB95E]" />
              </div>

              {/* Small Label */}
              <span className="mt-5 text-[11px] sm:text-[13px] uppercase font-semibold tracking-[0.3em] text-[#FFF3DA] block">
                SIMPLE &bull; FAST &bull; ECO-FRIENDLY
              </span>

              {/* Main Heading */}
              <h2 className="mt-3 text-[30px] sm:text-[40px] lg:text-[46px] leading-[1.15] font-bold tracking-tight text-[#FFF8EA] lg:whitespace-nowrap">
                Create Your Invitation in{" "}
                <span className="bg-gradient-to-b from-[#F3C96F] to-[#C98F32] bg-clip-text text-transparent">
                  3 Easy Steps
                </span>
              </h2>

              {/* Subtitle */}
              <p className="mt-3 text-[15px] sm:text-[18px] text-[#FFF3DA]/90 mx-auto font-normal">
                No complex software or waiting weeks for printers. Ready to share in minutes.
              </p>
            </div>

            {/* 3 Step Cards Grid */}
            <div className="relative mt-14">
              {/* Center Mandala Asset Behind Middle Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[46%] w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] lg:w-[620px] lg:h-[620px] pointer-events-none opacity-30 select-none flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/steps/center-mandala.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-y-14 gap-x-10 lg:gap-x-24 items-stretch justify-items-center">
                {[
                  {
                    step: "01",
                    title: "Choose a design",
                    desc: "Browse designs for every tradition and occasion across video, PDF and Website formats.",
                    icon: (
                      <svg className="w-[68px] h-[68px] text-[#6E0C14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="13.5" cy="6.5" r=".6" fill="currentColor" />
                        <circle cx="17.5" cy="10.5" r=".6" fill="currentColor" />
                        <circle cx="8.5" cy="7.5" r=".6" fill="currentColor" />
                        <circle cx="6.5" cy="12.5" r=".6" fill="currentColor" />
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                        {/* slash ab top-right se bottom-left (target jaisa) */}
                        <path d="M21 3 3 21" />
                      </svg>
                    ),
                  },
                  {
                    step: "02",
                    title: "Add your details",
                    desc: "Add your names, date, venue location, photos and music in an easy guided form.",
                    icon: (
                      <svg className="w-[68px] h-[68px] text-[#6E0C14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    ),
                  },
                  {
                    step: "03",
                    title: "Share instantly",
                    desc: "Send the link on WhatsApp or download the PDF to distribute across your entire guest list.",
                    icon: (
                      <svg className="w-[68px] h-[68px] text-[#6E0C14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    ),
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="group relative mt-6 w-full max-w-[360px] lg:max-w-none min-h-[350px] transition-transform duration-300 hover:-translate-y-2"
                  >
                    {/* Card shape: beech me crown bump + gold border (SVG outline) */}
                    <svg
                      className="absolute inset-0 w-full h-full drop-shadow-[0_14px_18px_rgba(0,0,0,0.35)]"
                      viewBox="0 0 370 380"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0,115 C0,80 22,56 58,56 C98,56 108,30 140,12 C160,2 172,0 185,0 C198,0 210,2 230,12 C262,30 272,56 312,56 C348,56 370,80 370,115 L370,352 C370,368 358,380 342,380 L28,380 C12,380 0,368 0,352 Z"
                        fill="url(#steps-card-fill)"
                        stroke="url(#steps-gold)"
                        strokeWidth="3.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>

                    {/* Circular Maroon Number Badge - crown ke beech, aadha bahar */}
                    <div className="absolute left-1/2 -top-[22px] -translate-x-1/2 z-10 w-16 h-16 rounded-full bg-[#6E0C14] text-[#FFF3DA] border-[3px] border-[#D9A441] flex items-center justify-center font-bold text-[28px] shadow-[0_4px_10px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform duration-300">
                      {card.step}
                    </div>

                    {/* Card content */}
                    <div className="relative flex flex-col items-center justify-start text-center pt-[72px] pb-9 px-8">
                      {/* Large Maroon Outline Icon */}
                      <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>

                      {/* Card Title */}
                      <h3 className="mt-5 font-bold text-[24px] sm:text-[26px] leading-tight text-[#6E0C14] tracking-tight">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 max-w-[270px] text-[14px] sm:text-[15px] text-[#4A4543] leading-[1.55] font-normal">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traditional Indian Architectural Scalloped Bottom Edge */}
          <div className="relative w-full leading-none z-20 -mt-1">
            {/* Ornamental edge (SVG) - cream niche + gold line, uploaded divider image ki jagah */}
            <svg
              className="block w-full h-auto pointer-events-none"
              viewBox="0 0 1440 200"
              preserveAspectRatio="xMidYMax meet"
              aria-hidden="true"
            >
              {/* Cream area: iska color agle section ke bg se match rakhna (#FBF7EE) */}
              <use href="#steps-cream" fill="#f1e4c5" />
              <use href="#steps-cream" fill="#f1e4c5" transform="translate(1440,0) scale(-1,1)" />

              {/* Inner thin gold line */}
              <g fill="none" stroke="#E9C474" strokeOpacity="0.55" strokeWidth="1">
                <use href="#steps-edge" transform="translate(0,-7)" />
                <use href="#steps-edge" transform="translate(1440,-7) scale(-1,1)" />
              </g>

              {/* Main gold line */}
              <g fill="none" stroke="url(#steps-gold-h)" strokeWidth="3.5" strokeLinecap="round">
                <use href="#steps-edge" />
                <use href="#steps-edge" transform="translate(1440,0) scale(-1,1)" />
              </g>
            </svg>

            {/* Bottom Lotus Divider (maroon wale hisse me, tip ke upar) */}
            <div
              className="absolute left-1/2 top-[50%] -translate-x-1/2 w-[34%] max-w-[520px] flex items-center justify-center gap-2"
              aria-hidden="true"
            >
              <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9923A] to-[#EBB95E]" />
              <span className="w-1.5 h-1.5 rotate-45 bg-[#EBB95E] shrink-0" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/steps/lotus-divider.png"
                alt=""
                className="h-8 sm:h-10 w-[56px] sm:w-[72px] object-cover object-center shrink-0 drop-shadow-md"
              />
              <span className="w-1.5 h-1.5 rotate-45 bg-[#EBB95E] shrink-0" />
              <span className="flex-1 h-px bg-gradient-to-l from-transparent via-[#C9923A] to-[#EBB95E]" />
            </div>
          </div>
        </section>
        {/* ========================================================================= */}
        {/* SECTION 4.4: EXPLORE WEDDING INVITATION DESIGNS                          */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-8 bg-[#FDFBF7] relative overflow-hidden">
          {/* Golden Half Mandala Corner Accents on Both Sides */}
          <div className="absolute -top-10 -left-10 sm:-top-8 sm:-left-8 w-52 sm:w-64 lg:w-80 h-auto pointer-events-none opacity-85 select-none hidden sm:block rotate-[135deg] origin-center drop-shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/steps/golden-half-mandala.svg"
              alt=""
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="absolute -top-10 -right-10 sm:-top-8 sm:-right-8 w-52 sm:w-64 lg:w-80 h-auto pointer-events-none opacity-85 select-none hidden sm:block -rotate-[135deg] origin-center -scale-x-100 drop-shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/steps/golden-half-mandala.svg"
              alt=""
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="max-w-7xl mx-auto space-y-10 relative z-10">
            {/* Header with Traditional Lotus divider */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              {/* Top Ornamental Lotus Motif */}
              <div className="flex items-center justify-center gap-3 text-[#D6A64B]">
                <div className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#D6A64B]" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#D6A64B]">◇</span>
                  <svg className="w-7 h-7 text-[#D6A64B]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M32 8 C32 8 20 28 32 48 C44 28 32 8 32 8 Z" fill="currentColor" fillOpacity="0.15" />
                    <path d="M32 20 C22 28 14 38 18 48 C26 48 32 40 32 40 C32 40 38 48 46 48 C50 38 42 28 32 20 Z" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="32" cy="48" r="2" fill="currentColor" />
                    <path d="M12 44 C8 44 6 40 10 36 C14 36 18 40 18 44 Z" fill="currentColor" />
                    <path d="M52 44 C56 44 58 40 54 36 C50 36 46 40 46 44 Z" fill="currentColor" />
                  </svg>
                  <span className="text-[10px] text-[#D6A64B]">◇</span>
                </div>
                <div className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#D6A64B]" />
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#6E0C14]">Explore Our
               <span className="bg-gradient-to-b from-[#F3C96F] to-[#C98F32] bg-clip-text text-transparent"> Designs</span>  
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base italic text-stone-600 max-w-2xl mx-auto font-normal">
                Discover beautifully crafted invitations for every tradition and celebration.
              </p>

              {/* Format Filter Tabs Pill Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
                {[
                  { id: "all", label: "ALL" },
                  { id: "video", label: "VIDEO" },
                  { id: "website", label: "INVITATION WEBSITE" },
                  { id: "pdf", label: "PDF" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setThemeFormat(tab.id as "all" | "video" | "website" | "pdf")}
                    className={`px-6 sm:px-8 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer shadow-2xs border ${
                      themeFormat === tab.id
                        ? "bg-[#6E0C14] text-[#FFF3DA] border-[#6E0C14] shadow-sm"
                        : "bg-transparent text-stone-800 border-[#D6A64B] hover:bg-[#F7EED9]/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Cards in Row (Exact Layout from Reference Image) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {[
                {
                  id: "card-1",
                  title: "Royal Palace Wedding",
                  badge: "BEST SELLER",
                  format: "VIDEO",
                  formatIcon: "video",
                  language: "Hindi • English",
                  price: 449,
                  btnText: "Edit This Video >",
                  btnHref: "/wedding/video",
                  previewHref: "/w/aarav-diya",
                  visualType: "palace",
                  gradient: "from-[#8B1A24] via-[#52090F] to-[#2B0407]",
                },
                {
                  id: "card-2",
                  title: "Divine Ganesh Invitation",
                  badge: "POPULAR",
                  format: "VIDEO",
                  formatIcon: "video",
                  language: "Hindi • English",
                  price: 499,
                  btnText: "Edit This Video >",
                  btnHref: "/wedding/video",
                  previewHref: "/w/aarav-diya",
                  visualType: "ganesh",
                  gradient: "from-[#9E202B] via-[#660C14] to-[#360408]",
                },
                {
                  id: "card-3",
                  title: "Traditional Wedding",
                  badge: null,
                  format: "VIDEO",
                  formatIcon: "video",
                  language: "Hindi • English",
                  price: 449,
                  btnText: "Edit This Video >",
                  btnHref: "/wedding/video",
                  previewHref: "/w/aarav-diya",
                  visualType: "mandap",
                  gradient: "from-[#7A151D] via-[#4F090E] to-[#2B0407]",
                },
                {
                  id: "card-4",
                  title: "Royal Wedding Website",
                  badge: null,
                  format: "WEBSITE",
                  formatIcon: "globe",
                  language: "Hindi • English",
                  price: 999,
                  btnText: "Edit This Template >",
                  btnHref: "/wedding/invitation-website",
                  previewHref: "/w/aarav-diya",
                  visualType: "phone",
                  gradient: "from-[#6E0C14] via-[#48080C] to-[#240306]",
                },
              ].map((card) => (
                <div
                  key={card.id}
                  className="group relative bg-[#FFFDF9] rounded-[24px] border-2 border-[#D6A64B]/80 hover:border-[#D6A64B] p-3.5 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  {/* Visual Preview Box */}
                  <div className="relative w-full h-[230px] rounded-[18px] overflow-hidden border border-[#D6A64B]/50 flex items-center justify-center">
                    {/* Background Visual Art */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />

                    {/* Rich Architectural & Floral Overlay */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `radial-gradient(#D6A64B 0.75px, transparent 1px)`,
                        backgroundSize: "16px 16px",
                      }}
                    />

                    {/* Specific Imagery simulation */}
                    {card.visualType === "ganesh" && (
                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-3">
                        <span className="text-3xl text-amber-300 drop-shadow-md">ॐ</span>
                        <span className="text-[11px] font-bold text-amber-200 mt-1">॥ श्री गणेशाय नमः ॥</span>
                        <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mt-2 text-2xl text-amber-200">
                          🪔
                        </div>
                      </div>
                    )}

                    {card.visualType === "palace" && (
                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-3">
                        <span className="text-3xl text-amber-300 drop-shadow-md">🏰</span>
                        <span className="text-xs font-bold text-amber-200 mt-1 uppercase tracking-wider">Royal Palace</span>
                        <span className="text-[10px] text-amber-100/80">Grand Heritage Decor</span>
                      </div>
                    )}

                    {card.visualType === "mandap" && (
                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-3">
                        <span className="text-3xl text-amber-300 drop-shadow-md">🌺</span>
                        <span className="text-xs font-bold text-amber-200 mt-1 uppercase tracking-wider">Traditional Mandap</span>
                        <span className="text-[10px] text-amber-100/80">Marigold &amp; Rose Theme</span>
                      </div>
                    )}

                    {card.visualType === "phone" && (
                      <div className="relative z-10 w-[110px] h-[190px] rounded-[22px] bg-black p-1.5 border-2 border-amber-400/80 shadow-2xl flex flex-col justify-between text-center overflow-hidden">
                        <div className="h-full rounded-[16px] bg-[#600810] p-2 flex flex-col justify-between items-center text-amber-100 border border-amber-300/30">
                          <span className="text-[9px] text-amber-300 font-bold">ॐ</span>
                          <div>
                            <span className="text-[8px] italic block text-amber-200/90">Our Wedding</span>
                            <span className="text-[9px] font-bold block text-white leading-tight">Invitation</span>
                          </div>
                          <span className="text-[7px] text-amber-200 bg-black/40 px-2 py-0.5 rounded-full">Interactive Link</span>
                        </div>
                      </div>
                    )}

                    {/* Top Left Format Tag */}
                    <div className="absolute top-2.5 left-2.5 z-20">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#6E0C14]/90 text-amber-100 border border-[#D6A64B]/60 text-[10px] font-bold shadow-xs">
                        {card.formatIcon === "video" ? "▶ VIDEO" : "🌐 WEBSITE"}
                      </span>
                    </div>

                    {/* Top Right Badge (BEST SELLER / POPULAR) */}
                    {card.badge && (
                      <div className="absolute top-2.5 right-2.5 z-20">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#E8B653] text-[#52090F] font-bold text-[10px] shadow-xs">
                          ★ {card.badge}
                        </span>
                      </div>
                    )}

                    {/* Center Preview Button Pill */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
                      <Link
                        href={card.previewHref}
                        target="_blank"
                        className="px-3.5 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white font-medium text-[11px] backdrop-blur-xs border border-white/25 flex items-center gap-1.5 transition-all shadow-sm group-hover:scale-105"
                      >
                        <span className="text-[10px]">▶</span>
                        <span>Preview</span>
                      </Link>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-3.5 pb-2 text-center space-y-2">
                    {/* Title */}
                    <h3 className="font-bold text-base sm:text-[17px] text-[#52090F] tracking-tight group-hover:text-[#6E0C14] transition-colors">
                      {card.title}
                    </h3>

                    {/* Language & Thin Divider */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-stone-600 font-medium">
                        {card.language}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="h-px w-10 bg-[#D6A64B]/60" />
                        <span className="h-px w-10 bg-[#D6A64B]/60" />
                      </div>
                    </div>

                    {/* Price with Flourish */}
                    <div className="flex items-center justify-center gap-2 text-[#C49234] pt-0.5">
                      <span className="text-xs">☙</span>
                      <span className="font-bold text-2xl text-[#C49234]">₹{card.price}</span>
                      <span className="text-xs">❧</span>
                    </div>

                    {/* Main Action Button */}
                    <div className="pt-1.5">
                      <Link
                        href={card.btnHref}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#6E0C14] hover:bg-[#52090F] text-[#FFF3DA] font-semibold text-xs sm:text-[13px] transition-all duration-200 flex items-center justify-center gap-1 shadow-sm group-hover:shadow-md cursor-pointer"
                      >
                        <span>{card.btnText}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Subtle Ornamental Ending */}
            <div className="flex items-center justify-center gap-3 pt-6 text-[#D6A64B]">
              <div className="h-[1px] w-24 sm:w-44 bg-gradient-to-r from-transparent to-[#D6A64B]" />
              <svg className="w-6 h-6 text-[#D6A64B]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M32 8 C32 8 20 28 32 48 C44 28 32 8 32 8 Z" fill="currentColor" fillOpacity="0.15" />
                <path d="M32 20 C22 28 14 38 18 48 C26 48 32 40 32 40 C32 40 38 48 46 48 C50 38 42 28 32 20 Z" fill="currentColor" fillOpacity="0.2" />
                <circle cx="32" cy="48" r="2" fill="currentColor" />
                <path d="M12 44 C8 44 6 40 10 36 C14 36 18 40 18 44 Z" fill="currentColor" />
                <path d="M52 44 C56 44 58 40 54 36 C50 36 46 40 46 44 Z" fill="currentColor" />
              </svg>
              <div className="h-[1px] w-24 sm:w-44 bg-gradient-to-l from-transparent to-[#D6A64B]" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4.5: PROBLEM SECTION (BELOW TRENDING THEMES)                     */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB] border-y border-amber-900/10">
          <div className=" mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-rose-800">
                Modern Convenience &bull; Zero Confusion
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Wedding Invitation Problems, Solved
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Shaadi ki wo pareshaniyan jo digital invitation se aasaan ho jati hain.
              </p>
            </div>

            {/* 6 Problem & Solution Cards (Exact copy specified in Prompt) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  problem: "Har ghar jaake patrika dena",
                  solution: "Ek link, poori guest list tak, kuch hi second me.",
                },
                {
                  problem: "Time kam hai, itne ghar kaise jayein?",
                  solution: "Card kuch minute me ready, aur WhatsApp par sab tak.",
                },
                {
                  problem: "Patrika par Bhagwan chhape hote hain, use phenk nahi sakte",
                  solution:
                    "Digital invitation me koi kagaz waste nahi, aur aashirwad aapke mobile me safe rehta hai.",
                },
                {
                  problem: "Venue kahan hai?",
                  solution: "Har function ke saath Google Maps ka 1-click link.",
                },
                {
                  problem: "Shaadi ki date bhool jana",
                  solution: FEATURES.reminders
                    ? "'Add to Calendar' se function aapke calendar me. Function ke din reminder bhi milta hai."
                    : "'Add to Calendar' se function aapke calendar me.",
                },
                {
                  problem: "Hard copy chhapna mehnga padta hai",
                  solution: `Printing, courier aur bhaag-daud ka kharcha bachayein. Digital invitation ₹${PRICES.minPrice} se shuru.`,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Problem Header */}
                  <div className="p-6 bg-red-50/50 border-b border-stone-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-100 px-2.5 py-0.5 rounded">
                      Problem #{i + 1}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm leading-snug">
                      &ldquo;{card.problem}&rdquo;
                    </h3>
                  </div>

                  {/* Solution Body */}
                  <div className="p-6 bg-emerald-50/40 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Solution</span>
                      </span>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mt-2">
                        {card.solution}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4.6: TESTIMONIALS (FROM EXISTING API)                             */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-800">
                Real Customer Experiences
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                What Families Say
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Hear from families and planners across India who simplified their celebration invitations.
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
                0{sliderIndex + 1} / 0{testimonials.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="w-11 h-11 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-500 text-stone-700 flex items-center justify-center transition shadow-xs cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="w-11 h-11 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-500 text-stone-700 flex items-center justify-center transition shadow-xs cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          {testimonials.length > 0 && (
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              tabIndex={0}
              role="region"
              aria-label="Testimonial slider card"
              className="relative bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <Quote className="absolute right-6 -bottom-6 w-40 h-40 text-amber-500/10 pointer-events-none select-none rotate-12" />

              <div className="relative z-10 space-y-6">
                {/* Rating & City Tag */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: testimonials[sliderIndex]?.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-900 ml-1">
                      {testimonials[sliderIndex]?.rating || 5}.0
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-rose-900 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                    {testimonials[sliderIndex]?.city}
                  </span>
                </div>

                <blockquote className="text-base sm:text-xl text-stone-900 leading-relaxed italic">
                  &ldquo;{testimonials[sliderIndex]?.content}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
                  <div className="w-12 h-12 rounded-full bg-rose-900 text-amber-200 flex items-center justify-center font-bold text-sm border-2 border-amber-300/40 shrink-0">
                    {testimonials[sliderIndex]?.name
                      ?.split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "TN"}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-stone-900">
                      {testimonials[sliderIndex]?.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {testimonials[sliderIndex]?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dots Navigation with aria-label */}
          <div className="flex justify-center items-center gap-2 pt-2" role="tablist" aria-label="Testimonial slider pagination">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSliderIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-selected={idx === sliderIndex}
                role="tab"
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === sliderIndex ? "w-8 bg-amber-500" : "w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4.7: FAQ ACCORDION                                               */}
        {/* ========================================================================= */}
        <section id="faq" className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FDFBF7] border-y border-amber-900/10">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-800">
                Help &amp; Clarity
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Everything you need to know about digital invitation formats, maps and sharing.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-stone-900 cursor-pointer hover:text-rose-800 min-h-[44px]"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4.8: FINAL CTA BANNER                                            */}
        {/* ========================================================================= */}
       {/*  <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-amber-950 rounded-3xl p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden border border-amber-400/30 space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-amber-300 border border-amber-300/30 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-amber-100 max-w-xl mx-auto leading-tight">
              Create Your Digital Invitation in Minutes
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
              Choose from royal themes, customize your ceremonies, and share seamlessly on WhatsApp with your friends and family.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/wedding"
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold text-xs rounded-xl shadow-lg transition min-h-[44px] flex items-center justify-center"
              >
                Browse All Designs
              </Link>
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=Namaste!%20I%20would%20like%20to%20order%20an%20invitation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition min-h-[44px] flex items-center justify-center gap-2"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-amber-200/60 italic pt-2">
              ✦ Fast Delivery &bull; Indian Traditions &bull; Google Maps Inbuilt ✦
            </p>
          </div>
        </section>*/}
      </main>

      <PublicFooter />
    </div>
  );
}
