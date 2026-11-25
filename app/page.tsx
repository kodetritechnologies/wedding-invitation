"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  Quote,
  Flame,
  PartyPopper,
  CheckCircle2,
  Check,
  X,
  ShoppingBag,
  Zap,
  Gift,
  Music,
  Baby,
  MapPin,
} from "lucide-react";
import { GiRing, GiLotus } from "react-icons/gi";
import { MdBolt, MdDescription, MdLink } from "react-icons/md";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import WishlistButton from "@/components/templates/WishlistButton";
import { BRAND } from "@/lib/brand";
import { PRICES } from "@/lib/catalog";
import { FEATURES } from "@/lib/features";

interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  content: string;
}

interface DynamicTemplateItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  format?: "website" | "video" | "pdf";
  price?: number;
  likesCount?: number;
  isDefault?: boolean;
}

interface CategoryItem {
  _id?: string;
  name: string;
  slug?: string;
  subtitle?: string;
  line?: string;
  href: string;
  icon?: string;
  imageUrl?: string;
}

function renderCategoryIcon(iconKey?: string, imageUrl?: string) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="Category icon"
        className="w-7 h-7 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
      />
    );
  }

  switch (iconKey) {
    case "rings":
      return (
        <svg className="w-8 h-8 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" viewBox="0 0 48 48" fill="none">
          {/* Left Wedding Ring */}
          <circle cx="20" cy="27" r="10.5" stroke="currentColor" strokeWidth="3.5" />
          <circle cx="20" cy="27" r="7.5" stroke="#FFE9A8" strokeWidth="1" opacity="0.7" />
          {/* Right Wedding Ring */}
          <circle cx="28" cy="24" r="10.5" stroke="currentColor" strokeWidth="3.5" />
          <circle cx="28" cy="24" r="7.5" stroke="#FFE9A8" strokeWidth="1" opacity="0.7" />
          {/* Diamond on top */}
          <path d="M28 9 L34 13 L28 17 L22 13 Z" fill="currentColor" stroke="#FFF7DE" strokeWidth="0.8" />
          <circle cx="28" cy="13" r="1.5" fill="#FFFFFF" />
        </svg>
      );
    case "diamond":
      return (
        <svg className="w-8 h-8 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" viewBox="0 0 48 48" fill="none">
          {/* Solitaire Ring */}
          <circle cx="24" cy="28" r="12.5" stroke="currentColor" strokeWidth="3.5" />
          <circle cx="24" cy="28" r="9" stroke="#FFE9A8" strokeWidth="1" opacity="0.7" />
          {/* Big Sparkling Solitaire Diamond */}
          <path d="M24 6 L32 12 L24 18 L16 12 Z" fill="currentColor" stroke="#FFF7DE" strokeWidth="1" />
          <path d="M20 12 L24 6 L28 12 L24 18 Z" fill="#FFE9A8" opacity="0.85" />
          <circle cx="24" cy="12" r="1.8" fill="#FFFFFF" />
          <path d="M13 7 L16 10 M35 7 L32 10" stroke="#FFF7DE" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "cake":
      return (
        <svg className="w-7 h-7 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" viewBox="0 0 48 48" fill="none">
          <path d="M12 36 h24 v4 a2 2 0 0 1 -2 2 h-20 a2 2 0 0 1 -2 -2 Z" fill="currentColor" opacity="0.9" />
          <path d="M14 26 h20 v8 h-20 Z" stroke="currentColor" strokeWidth="2.5" />
          <path d="M18 18 h12 v7 h-12 Z" stroke="currentColor" strokeWidth="2.5" />
          <line x1="24" y1="18" x2="24" y2="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 8 C23 10 21 11 24 13 C27 11 25 10 24 8 Z" fill="#FFF7DE" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="12" cy="15" r="1.5" fill="currentColor" />
          <circle cx="36" cy="16" r="1.5" fill="currentColor" />
        </svg>
      );
    case "heart":
      return (
        <svg className="w-7 h-7 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" viewBox="0 0 48 48" fill="none">
          <path d="M17 14 L21 24 C21 27 19 28 17 28 L17 38 M13 38 L21 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M31 14 L27 24 C27 27 29 28 31 28 L31 38 M27 38 L35 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 13 C22 10 18 11 18 14 C18 18 24 21 24 21 C24 21 30 18 30 14 C30 11 26 10 24 13 Z" fill="currentColor" stroke="#FFF7DE" strokeWidth="0.8" />
        </svg>
      );
    case "home":
      return (
        <svg className="w-7 h-7 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" viewBox="0 0 48 48" fill="none">
          <path d="M24 10 L11 21 L14 21 L14 36 A2 2 0 0 0 16 38 L32 38 A2 2 0 0 0 34 36 L34 21 L37 21 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M21 38 V26 H27 V38" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="24" cy="14" r="2.5" fill="currentColor" />
          <path d="M24 7 L26 10 H22 Z" fill="#FFF7DE" />
        </svg>
      );
    case "glass":
      return (
        <svg className="w-7 h-7 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" viewBox="0 0 48 48" fill="none">
          <path d="M14 34 L22 18 L28 24 L20 40 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M17 28 L25 34" stroke="currentColor" strokeWidth="2" />
          <path d="M30 12 L34 8 M36 18 L41 18 M26 8 L27 4 M33 26 L38 29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="34" cy="14" r="1.5" fill="#FFF7DE" />
          <circle cx="28" cy="14" r="1.2" fill="#FFF7DE" />
        </svg>
      );
    case "baby":
      return <Baby className="w-6 h-6 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" />;
    case "flame":
      return <Flame className="w-6 h-6 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" />;
    case "party":
      return <PartyPopper className="w-6 h-6 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" />;
    case "gift":
      return <Gift className="w-6 h-6 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" />;
    case "music":
      return <Music className="w-6 h-6 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" />;
    case "sparkles":
    default:
      return <Sparkles className="w-6 h-6 text-[#F5C86C] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" />;
  }
}

export default function HomePage() {
  const [themeFormat, setThemeFormat] = useState<"all" | "video" | "website" | "pdf">("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const isDraggingCategory = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  // 3-second auto-slide interval for categories (seamless continuous cycle)
  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (isCategoryHovered || isDraggingCategory.current) return;
      const card = el.firstElementChild as HTMLElement | null;
      const cardWidth = card ? card.offsetWidth : 220;
      const gap = 16;
      const step = cardWidth + gap;

      // If reached near the end of duplicated list, loop smoothly back to start
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      el.scrollBy({ left: step, behavior: "smooth" });
    }, 3000);

    return () => clearInterval(interval);
  }, [isCategoryHovered]);

  const [dynamicTemplates, setDynamicTemplates] = useState<DynamicTemplateItem[]>([]);
  const [defaultTemplate, setDefaultTemplate] = useState<DynamicTemplateItem | null>(null);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [buyModalTemplate, setBuyModalTemplate] = useState<{ name: string; slug: string; price: number; format?: string } | null>(null);
  const [buySuccess, setBuySuccess] = useState(false);

  // Fetch templates dynamically from public API (strictly MongoDB, no mock fallback)
  useEffect(() => {
    async function loadTemplates() {
      try {
        setTemplatesLoading(true);
        const res = await fetch("/api/templates");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.templates)) {
            setDynamicTemplates(data.templates);
            if (data.defaultTemplate) {
              setDefaultTemplate(data.defaultTemplate);
            } else {
              const def =
                data.templates.find((t: DynamicTemplateItem) => t.isDefault) ||
                data.templates[0] ||
                null;
              setDefaultTemplate(def);
            }
          } else {
            setDynamicTemplates([]);
            setDefaultTemplate(null);
          }
        } else {
          setDynamicTemplates([]);
          setDefaultTemplate(null);
        }
      } catch (err) {
        console.error("Failed to load templates:", err);
        setDynamicTemplates([]);
        setDefaultTemplate(null);
      } finally {
        setTemplatesLoading(false);
      }
    }
    loadTemplates();
  }, []);

  const filteredTemplates = dynamicTemplates.filter((t) => {
    if (themeFormat === "all") return true;
    const fmt = (t.format || "website").toLowerCase();
    return fmt === themeFormat;
  });

  // Fetch categories dynamically from public API
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/public/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.categories)) {
            setCategories(data.categories);
          } else {
            setCategories([]);
          }
        }
      } catch {
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  // Fetch testimonials dynamically from existing API
  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/public/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.testimonials)) {
            setTestimonials(data.testimonials);
          } else {
            setTestimonials([]);
          }
        }
      } catch {
        setTestimonials([]);
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
          if (data.success && Array.isArray(data.faqs)) {
            setFaqs(
              data.faqs.map((f: { question: string; answer: string }) => ({
                q: f.question,
                a: f.answer,
              }))
            );
          } else {
            setFaqs([]);
          }
        }
      } catch {
        setFaqs([]);
      }
    }
    loadFaqs();
  }, []);

  // Testimonials Auto-advance every 3.5 seconds (pauses on hover or focus)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevSlide = () => {
    setSliderIndex((prev) => (prev === 0 ? 3 : prev - 1));
  };

  const handleNextSlide = () => {
    setSliderIndex((prev) => (prev + 1) % 4);
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
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem]  font-bold text-amber-100 leading-[1.15] tracking-tight drop-shadow-md">
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
                  href="/templates"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#DFB76C] via-[#EDD08D] to-[#D5A958] hover:from-[#EDD08D] hover:to-[#DFB76C] text-[#42050D] font-bold rounded-full shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base border border-amber-300 min-h-[46px] group"
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <GiRing className="w-4 h-4 text-amber-900" />
                    <span>Create Your Invitation</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#42050D] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={
                    defaultTemplate
                      ? `/api/public/templates/${defaultTemplate.slug}/preview`
                      : "/w/aarav-diya"
                  }
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
                  <MdBolt className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="block font-semibold text-white">Instant</span>
                    <span className="text-amber-200/80 text-[11px]">Shareable Link</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MdDescription className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="block font-semibold text-white">Download</span>
                    <span className="text-amber-200/80 text-[11px]">PDF</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MdLink className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="block font-semibold text-white">Easy to Share</span>
                    <span className="text-amber-200/80 text-[11px]">Via WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Ornamental script line */}
              <div className="pt-1 text-amber-300/85 italic  text-sm tracking-wide">
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
                <h2 className="text-3xl sm:text-5xl  font-bold tracking-tight text-[#720E16]">
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

              {/* Realistic Arch Categories Auto-Slider */}
              {(() => {
                const displayCategories = (
                  categories.length > 0
                    ? categories
                    : [
                        { name: "Wedding", subtitle: "For your big day", slug: "wedding", icon: "rings", href: "/templates?category=wedding" },
                        { name: "Engagement", subtitle: "Mark the beginning", slug: "engagement", icon: "diamond", href: "/templates?category=engagement" },
                        { name: "Birthday", subtitle: "Celebrate life", slug: "birthday", icon: "cake", href: "/templates?category=birthday" },
                        { name: "Anniversary", subtitle: "Cherish together", slug: "anniversary", icon: "heart", href: "/templates?category=anniversary" },
                        { name: "House Warming", subtitle: "Welcome home", slug: "housewarming", icon: "home", href: "/templates?category=housewarming" },
                        { name: "Reception", subtitle: "Share the joy", slug: "reception", icon: "glass", href: "/templates?category=reception" },
                      ] as CategoryItem[]
                );

                return (
                  <div className="relative w-full overflow-hidden">
                    {/* Scrollable Container with Mouse Drag + 3s Auto-Slide + No Scrollbar */}
                    <div
                      ref={categoryScrollRef}
                      tabIndex={0}
                      role="region"
                      aria-label="Celebration Categories Carousel"
                      onMouseEnter={() => setIsCategoryHovered(true)}
                      onMouseLeave={() => {
                        setIsCategoryHovered(false);
                        isDraggingCategory.current = false;
                        if (categoryScrollRef.current) {
                          categoryScrollRef.current.style.cursor = "grab";
                        }
                      }}
                      onMouseDown={(e) => {
                        const el = categoryScrollRef.current;
                        if (!el) return;
                        isDraggingCategory.current = true;
                        dragStartX.current = e.pageX;
                        dragScrollLeft.current = el.scrollLeft;
                        el.style.cursor = "grabbing";
                      }}
                      onMouseMove={(e) => {
                        const el = categoryScrollRef.current;
                        if (!el || !isDraggingCategory.current) return;
                        e.preventDefault();
                        const walk = (e.pageX - dragStartX.current) * 1.5;
                        el.scrollLeft = dragScrollLeft.current - walk;
                      }}
                      onMouseUp={() => {
                        isDraggingCategory.current = false;
                        if (categoryScrollRef.current) {
                          categoryScrollRef.current.style.cursor = "grab";
                        }
                      }}
                      className="flex items-center gap-4 sm:gap-5 overflow-x-auto py-2 px-1 sm:px-2 scroll-smooth focus:outline-none select-none no-scrollbar cursor-grab"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {[...displayCategories, ...displayCategories].map((cat, idx) => (
                        <Link
                          key={cat._id || idx}
                          href={
                            cat.href && cat.href.startsWith("/templates")
                              ? cat.href
                              : `/templates?category=${cat.slug || ""}`
                          }
                          draggable={false}
                          className="group relative flex-shrink-0 flex flex-col items-center justify-between transition-transform duration-300 hover:-translate-y-1 select-none"
                          style={{
                            width: "clamp(205px, 18.2vw, 235px)",
                            aspectRatio: "408 / 612",
                          }}
                        >
                          {/* Background Arch Image provided by user - Clean without box shadows */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/bg/category bg.png"
                            alt={`${cat.name} Card Background`}
                            draggable={false}
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                          />

                          {/* Content Container: high top/bottom padding so icon and button breathe; tight center content */}
                          <div className="relative z-10 w-full h-full flex flex-col items-center justify-between px-3 pt-[27%] pb-[25%]">
                            {/* Top: Gold Circular Medallion */}
                            <div className="relative flex items-center justify-center">
                              {/* Golden Frame of the medallion without artificial glow */}
                              <div className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-full p-[2px] bg-gradient-to-b from-[#FDE8A5] via-[#C8923B] to-[#7A4B13]">
                                {/* Inner bevel ring */}
                                <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-t from-[#F8D57E] via-[#854E18] to-[#FCE39E]">
                                  {/* Dark Maroon Velvet Texture Inside */}
                                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#4A0007] via-[#350004] to-[#200002] flex items-center justify-center">
                                    {renderCategoryIcon(cat.icon, cat.imageUrl)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Middle: Title, Divider & Subtitle grouped tightly together */}
                            <div className="flex flex-col items-center text-center w-full px-1">
                              {/* Category Name */}
                              <h3 className=" text-lg sm:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5DA] via-[#FCE3A1] to-[#E5BE72] leading-tight">
                                {cat.name}
                              </h3>

                              {/* Traditional Golden Floral Divider */}
                              <div className="flex items-center justify-center gap-1.5 w-full my-0.5 opacity-90">
                                <div className="h-[1px] w-5 sm:w-8 bg-gradient-to-r from-transparent via-[#E8B860] to-[#E8B860]" />
                                <svg className="w-3 h-3 text-[#F6CC75]" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2 C13 7 17 11 22 12 C17 13 13 17 12 22 C11 17 7 13 2 12 C7 11 11 7 12 2 Z" />
                                  <circle cx="12" cy="12" r="2" fill="#FFF8E7" />
                                </svg>
                                <div className="h-[1px] w-5 sm:w-8 bg-gradient-to-l from-transparent via-[#E8B860] to-[#E8B860]" />
                              </div>

                              {/* Subtitle / Tagline */}
                              <p className=" text-[11px] sm:text-xs text-[#F3DEC3] tracking-wide italic font-medium line-clamp-1 leading-tight">
                                {cat.subtitle || cat.line || "For your special day"}
                              </p>
                            </div>

                            {/* Bottom: Royal Cream-Gold Pill Button */}
                            <div className="w-[82%] max-w-[145px]">
                              <div className="relative p-[1px] rounded-full bg-gradient-to-b from-[#FFF2CC] via-[#DDA850] to-[#8C5815]">
                                <div className="w-full py-1.5 px-3 rounded-full bg-gradient-to-b from-[#FFFDF7] via-[#F8E8C8] to-[#EBD09F] flex items-center justify-center gap-1.5 group-hover:from-[#FFF9EA] group-hover:to-[#F7DEB0] transition-colors">
                                  <span className=" font-bold text-[11px] sm:text-xs text-[#4A0007] tracking-tight">
                                    View Designs
                                  </span>
                                  <span className="text-[#4A0007] text-[11px] font-bold transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })()}

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

            {/* Dynamic Cards Grid from MongoDB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {templatesLoading ? (
                Array.from({ length: 4 }).map((_, n) => (
                  <div
                    key={n}
                    className="bg-[#FFFDF9] rounded-[24px] border-2 border-[#D6A64B]/30 p-3.5 animate-pulse space-y-4"
                  >
                    <div className="w-full h-[230px] rounded-[18px] bg-stone-200/70" />
                    <div className="space-y-2 pt-2">
                      <div className="h-4 bg-stone-200/80 rounded-md w-3/4 mx-auto" />
                      <div className="h-3 bg-stone-200/60 rounded-md w-1/2 mx-auto" />
                      <div className="h-6 bg-stone-200/80 rounded-md w-1/3 mx-auto mt-2" />
                      <div className="h-9 bg-stone-200/80 rounded-xl w-full mt-3" />
                    </div>
                  </div>
                ))
              ) : filteredTemplates.length === 0 ? (
                <div className="col-span-full py-14 px-6 text-center bg-[#FFFDF9] rounded-[24px] border border-[#D6A64B]/40 max-w-xl mx-auto space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#6E0C14]/10 text-[#6E0C14] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#C98F32]" />
                  </div>
                  <h3 className=" text-lg font-bold text-[#6E0C14]">No Designs Found</h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    {themeFormat === "all"
                      ? "Currently no designs are published in the database."
                      : `No published designs found in ${themeFormat.toUpperCase()} format.`}
                  </p>
                  {themeFormat !== "all" && (
                    <button
                      onClick={() => setThemeFormat("all")}
                      className="mt-2 inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-[#6E0C14] text-[#FFF3DA] hover:bg-[#52090F] transition cursor-pointer"
                    >
                      <span>View All Designs</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredTemplates.map((template, idx) => {
                  const format = (template.format || "website").toLowerCase();
                  const formatLabel = format === "video" ? "VIDEO" : format === "pdf" ? "PDF" : "WEBSITE";
                  const actionHref = `/customize/${encodeURIComponent(template.slug)}`;
                  const price = template.price || (format === "website" ? 999 : 449);
                  const gradients = [
                    "from-[#8B1A24] via-[#52090F] to-[#2B0407]",
                    "from-[#9E202B] via-[#660C14] to-[#360408]",
                    "from-[#7A151D] via-[#4F090E] to-[#2B0407]",
                    "from-[#6E0C14] via-[#48080C] to-[#240306]",
                  ];
                  const cardGradient = gradients[idx % gradients.length];

                  return (
                    <div
                      key={template._id || template.slug}
                      className="group relative bg-[#FFFDF9] rounded-[24px] border-2 border-[#D6A64B]/80 hover:border-[#D6A64B] p-3.5 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between"
                    >
                      {/* Visual Preview Box (Click leads to template detail page) */}
                      <div className="relative">
                        <Link
                          href={`/templates/${encodeURIComponent(template.slug)}`}
                          className="relative w-full h-[230px] rounded-[18px] overflow-hidden border border-[#D6A64B]/50 flex items-center justify-center bg-stone-900 block"
                        >
                          {template.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={template.thumbnail}
                              alt={template.name}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <>
                              {/* Background Visual Art */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${cardGradient}`} />

                              {/* Rich Architectural & Floral Overlay */}
                              <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                  backgroundImage: `radial-gradient(#D6A64B 0.75px, transparent 1px)`,
                                  backgroundSize: "16px 16px",
                                }}
                              />

                              {/* Simulated Heritage Motif */}
                              <div className="relative z-10 flex flex-col items-center justify-center text-center p-3">
                                <span className="text-3xl text-amber-300 drop-shadow-md">ॐ</span>
                                <span className="text-[11px] font-bold text-amber-200 mt-1">॥ श्री गणेशाय नमः ॥</span>
                                <div className="w-14 h-14 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mt-2 text-2xl text-amber-200">
                                  <GiLotus className="w-8 h-8 text-amber-300" />
                                </div>
                                <span className="text-xs  font-bold text-[#FFF3DA] mt-2 line-clamp-1 px-2 drop-shadow-xs">
                                  {template.name}
                                </span>
                              </div>
                            </>
                          )}
                        </Link>

                        {/* Wishlist Like Button in Thumbnail Corner */}
                        <div
                          className="absolute top-2.5 right-2.5 z-20"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <WishlistButton
                            slug={template.slug}
                            initialCount={template.likesCount || 0}
                            size="sm"
                            className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-2.5 py-1 border border-white/20 shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="pt-3.5 pb-2 text-center space-y-2">
                        {/* Title (Links to template detail page) */}
                        <Link href={`/templates/${encodeURIComponent(template.slug)}`}>
                          <h3 className="font-bold text-base sm:text-[17px] text-[#52090F] tracking-tight group-hover:text-[#6E0C14] transition-colors line-clamp-1">
                            {template.name}
                          </h3>
                        </Link>

                        {/* Description / Language & Thin Divider */}
                        <div className="space-y-1.5">
                          <p className="text-[11px] text-stone-600 font-medium truncate px-1">
                            {template.description || "Hindi • English • Traditional"}
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <span className="h-px w-10 bg-[#D6A64B]/60" />
                            <span className="h-px w-10 bg-[#D6A64B]/60" />
                          </div>
                        </div>

                        {/* Single Price with Flourish */}
                        <div className="flex items-center justify-center gap-2 text-[#C49234] pt-0.5">
                          <span className="text-xs">☙</span>
                          <span className="font-bold text-2xl text-[#C49234]">₹{price}</span>
                          <span className="text-xs">❧</span>
                        </div>

                        {/* Action Buttons: Buy Now & Customize */}
                        <div className="pt-2 space-y-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setBuyModalTemplate({ name: template.name, slug: template.slug, price, format: formatLabel });
                              setBuySuccess(false);
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-amber-50 font-bold text-xs sm:text-[13px] transition shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
                            <span>Buy Now</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/templates/${encodeURIComponent(template.slug)}`}
                              className="flex-1 py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition flex items-center justify-center gap-1 border border-stone-200 cursor-pointer"
                            >
                              <span>View Details</span>
                            </Link>

                            <Link
                              href={actionHref}
                              className="flex-1 py-2 px-2 rounded-xl bg-[#720E16] hover:bg-[#5A0910] text-[#FFF3DA] font-semibold text-xs transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                            >
                              <span>Customize</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
        {/* SECTION 4.6: TESTIMONIALS (Exact Royal Wedding Design from Screenshot)   */}
        {/* ========================================================================= */}
        <section
          className="relative py-24 px-4 sm:px-8 overflow-hidden bg-[#FAF6EE] text-[#4A0007]"
          style={{
            backgroundImage: "url('/assets/bg/testionial-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Subtle Ambient Overlay if needed */}
          <div className="max-w-6xl mx-auto space-y-12 relative z-10">
            {/* Header: Lotus motif, subtitle, headline & description */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              {/* Top Golden Lotus Motif with Thin Flanking Rules */}
              <div className="flex items-center justify-center gap-3 text-[#D6A64B]">
                <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#D6A64B]" />
                <svg className="w-6 h-6 text-[#D6A64B]" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 4 C16 4 10 14 16 24 C22 14 16 4 16 4 Z" />
                  <path d="M16 10 C11 14 7 19 9 24 C13 24 16 20 16 20 C16 20 19 24 23 24 C25 19 21 14 16 10 Z" opacity="0.75" />
                  <path d="M6 22 C4 22 3 20 5 18 C7 18 9 20 9 22 Z" opacity="0.6" />
                  <path d="M26 22 C28 22 29 20 27 18 C25 18 23 20 23 22 Z" opacity="0.6" />
                </svg>
                <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#D6A64B]" />
              </div>

              {/* Sub-label: TESTIMONIALS */}
              <span className="block text-[11px] sm:text-xs uppercase font-bold tracking-[0.25em] text-[#720E16]">
                TESTIMONIALS
              </span>

              {/* Heading: What Our Clients Say */}
              <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#720E16]">
                What Our <span className="text-[#C8923B] font-serif">Clients</span> Say
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#6C534E] max-w-xl mx-auto leading-relaxed font-normal">
                Real stories from real couples who made their special day even more memorable with our wedding invitation designs.
              </p>
            </div>

            {/* Testimonials Carousel Container with Left/Right Circular Arrow Controls */}
            <div className="relative">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#720E16] border border-[#E8DCCF] shadow-[0_4px_12px_rgba(114,14,22,0.12)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
                aria-label="Previous Testimonials"
              >
                <ChevronLeft className="w-5 h-5 text-[#720E16]" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#720E16] border border-[#E8DCCF] shadow-[0_4px_12px_rgba(114,14,22,0.12)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
                aria-label="Next Testimonials"
              >
                <ChevronRight className="w-5 h-5 text-[#720E16]" />
              </button>

              {/* 3 Testimonial Cards Carousel with Smooth Sliding Animation */}
              {(() => {
                const sampleTestimonials = [
                  {
                    name: "Riya & Aman",
                    city: "Indore, MP",
                    avatar: "/assets/testimonials/avatar1.png",
                    rating: 5,
                    content:
                      "The invitation design was absolutely stunning! It perfectly captured the tradition and elegance we wanted.",
                  },
                  {
                    name: "Neha & Kunal",
                    city: "Bhopal, MP",
                    avatar: "/assets/testimonials/avatar2.png",
                    rating: 5,
                    content:
                      "Amazing designs and very professional service. Our guests loved the invitation and we received so many compliments!",
                  },
                  {
                    name: "Pooja & Rahul",
                    city: "Ujjain, MP",
                    avatar: "/assets/testimonials/avatar3.png",
                    rating: 5,
                    content:
                      "The entire experience was smooth and the designs are simply beautiful. Highly recommended!",
                  },
                  {
                    name: "Sneha & Varun",
                    city: "Gwalior, MP",
                    avatar: "/assets/testimonials/avatar1.png",
                    rating: 5,
                    content:
                      "Exceptional service! The digital wedding card made it so easy for all our guests to find the venue and RSVP instantly.",
                  },
                  {
                    name: "Ananya & Rohit",
                    city: "Jabalpur, MP",
                    avatar: "/assets/testimonials/avatar2.png",
                    rating: 5,
                    content:
                      "Super elegant and royal look! Everyone in our family was impressed with the traditional design and music integration.",
                  },
                  {
                    name: "Kavita & Aditya",
                    city: "Ratlam, MP",
                    avatar: "/assets/testimonials/avatar3.png",
                    rating: 5,
                    content:
                      "Best decision for our wedding invites. Seamless WhatsApp sharing and stunning graphics. 10/10 recommended!",
                  },
                ];

                const allCards = testimonials.length > 0
                  ? [
                      ...testimonials.map((t, i) => ({
                        name: t.name,
                        city: t.city || "Indore, MP",
                        avatar: sampleTestimonials[i % sampleTestimonials.length].avatar,
                        rating: t.rating || 5,
                        content: t.content,
                      })),
                      ...sampleTestimonials,
                    ]
                  : sampleTestimonials;

                const maxSlides = Math.max(1, allCards.length - 2);

                return (
                  <div
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="overflow-hidden px-2 sm:px-6 py-2 select-none"
                  >
                    <div
                      className="flex transition-transform duration-700 ease-in-out"
                      style={{
                        transform: `translateX(-${(sliderIndex % maxSlides) * (100 / 3)}%)`,
                      }}
                    >
                      {allCards.map((card, idx) => (
                        <div
                          key={idx}
                          className="w-full md:w-1/3 flex-shrink-0 px-3 sm:px-3.5"
                        >
                          <div className="relative bg-[#FFFDF9]/95 backdrop-blur-xs rounded-[28px] border border-[#F3E8DB] p-6 sm:p-7 shadow-[0_10px_28px_rgba(114,14,22,0.06)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(114,14,22,0.12)] min-h-[310px] h-full">
                            {/* Top Section: Absolute peach quotes on left, Centered Avatar with Stars directly underneath */}
                            <div className="relative flex flex-col items-center justify-center mb-3">
                              {/* Large Peach Quote Marks on top-left of card */}
                              <span className="absolute left-0 top-0 font-serif text-3xl sm:text-4xl text-[#F2D7C8] font-bold leading-none select-none">
                                “
                              </span>

                              {/* Center: Golden Ring Perfect 80x80 Circular Couple Avatar */}
                              <div className="relative w-20 h-20 shrink-0 rounded-full p-[3px] bg-gradient-to-b from-[#FAD980] via-[#D6A64B] to-[#996D29] shadow-[0_3px_10px_rgba(114,14,22,0.18)]">
                                <div className="w-full h-full rounded-full overflow-hidden bg-[#FFFDF9]">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={card.avatar}
                                    alt={card.name}
                                    className="w-full h-full object-cover object-center rounded-full"
                                  />
                                </div>
                              </div>

                              {/* 5 Filled Golden Stars directly beneath the avatar */}
                              <div className="flex items-center justify-center gap-1 text-[#D6A64B] mt-2.5">
                                {Array.from({ length: 5 }).map((_, sIdx) => (
                                  <svg key={sIdx} className="w-3.5 h-3.5 fill-[#D6A64B]" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                            </div>

                            {/* Middle: Review Quote Text */}
                            <p className="text-center text-xs sm:text-[13px] text-[#4A322C] font-normal leading-relaxed px-2 my-auto">
                              &ldquo;{card.content}&rdquo;
                            </p>

                            {/* Bottom: Couple Names & City with Location Pin */}
                            <div className="text-center pt-4 border-t border-[#F5EBE1] mt-3">
                              <h4 className="font-serif font-bold text-sm sm:text-base text-[#720E16]">
                                {card.name}
                              </h4>
                              <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs text-[#8A716A] mt-0.5">
                                <MapPin className="w-3 h-3 text-[#C8923B]" />
                                <span>{card.city}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Dots Pagination from Screenshot */}
              <div className="flex justify-center items-center gap-2 pt-8" role="tablist" aria-label="Testimonial slider pagination">
                {[0, 1, 2].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setSliderIndex(dotIdx)}
                    aria-label={`Go to slide group ${dotIdx + 1}`}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      sliderIndex % 3 === dotIdx
                        ? "w-2.5 h-2.5 bg-[#720E16]"
                        : "w-2 h-2 bg-[#E5D7CA] hover:bg-[#C8923B]"
                    }`}
                  />
                ))}
              </div>
            </div>
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
                href="/templates"
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
        {/* DUMMY BUY NOW CHECKOUT MODAL */}
        {buyModalTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-stone-200 relative text-left">
              {/* Close button */}
              <button
                onClick={() => {
                  setBuyModalTemplate(null);
                  setBuySuccess(false);
                }}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {buySuccess ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl  font-bold text-stone-900">
                      Demo Purchase Successful! 🎉
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Aapka <strong>{buyModalTemplate.name}</strong> template order confirm ho gaya hai (Test Mode). Ab aap ise customize karke live card link generate kar sakte hain.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href={`/customize/${encodeURIComponent(buyModalTemplate.slug)}`}
                      className="w-full py-3 rounded-xl bg-[#720E16] hover:bg-[#5A0910] text-[#FFF3DA] font-bold text-xs sm:text-sm text-center shadow-md transition"
                    >
                      Abhi Customize Karein &gt;
                    </Link>
                    <button
                      onClick={() => {
                        setBuyModalTemplate(null);
                        setBuySuccess(false);
                      }}
                      className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Direct Purchase
                      </span>
                      <h3 className="text-lg  font-bold text-stone-900 mt-0.5">
                        {buyModalTemplate.name}
                      </h3>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-[#FAF4EB] border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-600">Total Payable Amount</p>
                      <p className="text-[11px] text-stone-400">Zero subscription • 1 Year Live Validity</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl  font-bold text-[#720E16]">
                        ₹{buyModalTemplate.price}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">Fixed Price</span>
                    </div>
                  </div>

                  {/* What you get */}
                  <div className="space-y-1.5 text-xs text-stone-700">
                    <p className="font-bold text-[11px] text-stone-500 uppercase tracking-wider">Includes:</p>
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Full Access to this Invitation Website Design</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>1-Click WhatsApp Sharing &amp; Google Maps GPS</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Unlimited Live Edits (Muhurat, Dates &amp; Venues)</span>
                    </p>
                  </div>

                  {/* Dummy Payment Button */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setBuySuccess(true)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-emerald-200" />
                      <span>Proceed to Buy &bull; ₹{buyModalTemplate.price} (Demo Mode)</span>
                    </button>

                    <p className="text-[10px] text-center text-stone-400">
                      ⚡ Safe UPI, PhonePe, Google Pay, QR Code &amp; Cards (Demo Simulation)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
