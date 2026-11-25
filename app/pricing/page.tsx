"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Music,
  FileText,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  MapPin,
  Clock,
  Edit3,
  Users,
  Eye,
  HelpCircle,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function PricingPage() {
  // Pay-Per-Template format categories (Not package bundles!)
  const templateFormats = [
    {
      id: "pdf",
      name: "Digital PDF Patrika",
      formatBadge: "WhatsApp PDF Card",
      price: "₹199",
      priceSubtitle: "Starting from ₹199 • One-Time Pay",
      desc: "Chhoti sagai, griha pravesh ya WhatsApp forward ke liye simple, fast, lightweight printable digital patrika.",
      badge: "Quick & Simple",
      badgeColor: "bg-stone-100 text-stone-700 border-stone-200",
      features: [
        "High-Resolution Print-Ready PDF File",
        "Up to 3 Ceremonies (Sangeet, Vivah, Reception)",
        "Traditional Shlok, Ganesh Vandana & Family Names",
        "Lightweight (<2MB) — WhatsApp Forward Friendly",
        "Download & Share Instantly with All Contacts",
        "Zero Renewal • Lifetime Usable File",
      ],
      cta: "PDF Templates Dekhein",
      ctaHref: "/templates?format=pdf",
      ctaClass: "bg-stone-900 hover:bg-stone-800 text-white shadow-xs",
      highlight: false,
    },
    {
      id: "royal-website",
      name: "Royal Interactive Website",
      formatBadge: "Mobile-First Web Invite",
      price: "₹399 - ₹599",
      priceSubtitle: "One-Time Payment • 1 Year Live Hosting",
      desc: "Sabse lokpriya interactive wedding website — multi-screen ceremonies, background shehnai player aur live RSVP headcount tracker.",
      badge: "⭐ 92% Parivar Isko Chunte Hain",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
      features: [
        "Royal Card Slider (Multi-screen interactive swipe ceremonies)",
        "1-Click Direct Google Maps GPS Navigation for Guests",
        "Background Shehnai / Traditional Music Player Included",
        "Live RSVP Guest Headcount Tracker (Plate count bachegi)",
        "Couple Pre-Wedding Photo Gallery & Love Story Timeline",
        "VIP Personalized Guest Names ('Honoured: Sharma Ji')",
        "Unlimited Free Live Edits (Date, Muhurat ya Venue)",
        "1 Full Year Active Cloud Hosting (No Recurring Bills)",
      ],
      cta: "Interactive Templates Dekhein",
      ctaHref: "/templates?format=website",
      ctaClass:
        "bg-gradient-to-r from-rose-700 via-rose-800 to-amber-900 hover:from-rose-800 hover:to-amber-950 text-amber-100 shadow-md border border-amber-400/40",
      highlight: true,
    },
    {
      id: "bespoke-vip",
      name: "Maharaja Bespoke / Assisted Setup",
      formatBadge: "VIP Done-For-You",
      price: "₹999",
      priceSubtitle: "VIP Concierge • 2 Years Live Hosting",
      desc: "Aapke physical printed card ka exact digital clone + hamare dedicated designer ka same-day VIP setup support.",
      badge: "Includes Dedicated Designer",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      features: [
        "Sabhi Royal Interactive Website Features Included",
        "Dedicated Designer Assistance (Same-day setup)",
        "Physical Printed Card ka Exact Digital Clone / Replica",
        "Custom Audio/Video Integration & Family Tree",
        "Customized WhatsApp Invite Text & Direct Link Formatting",
        "Priority WhatsApp VIP Concierge Support",
        "2 Full Years Active Cloud Hosting Validity",
      ],
      cta: "Bespoke Themes Dekhein",
      ctaHref: "/templates?category=wedding",
      ctaClass: "bg-stone-900 hover:bg-stone-800 text-white shadow-xs",
      highlight: false,
    },
  ];

  // How Pay-Per-Template Works
  const steps = [
    {
      step: "01",
      title: "Template Pasand Karein",
      desc: "Catalog me se apni pasand ka design chunein. Har template ka price saaf-saaf likha hai — koi hidden cost nahi.",
      icon: Eye,
    },
    {
      step: "02",
      title: "Live Preview & Details Bharein",
      desc: "Var-vadhu ka naam, shubh muhurat, venue Google Map aur photos dalein. Apne phone par live preview check karein.",
      icon: Edit3,
    },
    {
      step: "03",
      title: "One-Time Pay & WhatsApp Par Bhejein",
      desc: "Sirf usi template ka ek-baar payment karein. Instant link generate hoga jise aap sabhi rishtedaaron ko share kar sakte hain.",
      icon: Zap,
    },
  ];

  // Universal features included in every template
  const universalFeatures = [
    {
      icon: ShieldCheck,
      title: "One-Time Fixed Payment",
      desc: "Zero subscription, koi monthly auto-debit nahi. Sirf chune hue template ka ek baar payment.",
    },
    {
      icon: Smartphone,
      title: "1-Click WhatsApp Ready",
      desc: "Khandan aur doston ko WhatsApp par direct interactive link bhejein, rich preview ke sath.",
    },
    {
      icon: MapPin,
      title: "Live Google Maps GPS",
      desc: "Mehmaan venue ka rasta bhatke bina 1-click turn-by-turn navigation se aasaani se pahunchenge.",
    },
    {
      icon: Edit3,
      title: "Unlimited Free Live Edits",
      desc: "Shaadi ki date, muhurat ya venue aage-peeche hua? Kabhi bhi dashboard me bina extra charge ke update karein.",
    },
    {
      icon: Users,
      title: "Live RSVP Guest Headcount",
      desc: "Kaun aa raha hai aur kaun nahi, real-time plate count se catering ka hazaron rupaye bachega.",
    },
    {
      icon: Clock,
      title: "1 Full Year Active Hosting",
      desc: "Shaadi ke baad bhi aapka digital link active rahega taaki rishtedaar photos aur yaadein dekh sakein.",
    },
  ];

  const addOns = [
    {
      icon: Globe,
      name: "Custom Couple Domain",
      price: "₹499",
      desc: "Aapka apna personal link jaise rahulwedsneha.in seedha browser me khulega.",
    },
    {
      icon: Music,
      name: "Custom Song / Audio Track",
      price: "₹99",
      desc: "Aapka manpasand Bollywood ya Vedic Shehnai song background me bajega.",
    },
    {
      icon: Sparkles,
      name: "Remove VivahVaani Watermark",
      price: "₹199",
      desc: "Footer se 'Powered by VivahVaani' watermark completely gayab ho jayega.",
    },
    {
      icon: FileText,
      name: "Printable High-Res PDF Patrika",
      price: "₹149",
      desc: "Usi website design ka printable PDF format WhatsApp forward aur print ke liye.",
    },
  ];

  const initialFaqs = [
    {
      q: "Kya mujhe koi monthly ya yearly subscription lena hoga?",
      a: "Bilkul NAHI! VivahVaani 100% Pay-Per-Template model par kaam karta hai. Na koi recurring subscription hai, na koi hidden charges. Jo template aap choose karenge, sirf usi ka ek-baar payment karna hota hai.",
    },
    {
      q: "Kya main sirf ek (single) template khareed sakta hoon?",
      a: "Haan, bilkul! Hamara system single-event / single-template ke liye hi banaya gaya hai. Koi package ya multiple template khareedne ki bilkul zaroorat nahi hai. Aap ek template lijiye aur maze se use kijiye.",
    },
    {
      q: "Template ka daam (price) kitna hota hai?",
      a: "Har template ka price uske format ke anusaar transparent hai — Digital PDF cards ₹199 se shuru hote hain, aur Interactive Royal Websites ₹399 se ₹599 ke beech aate hain. Jo template pasand aaye, wahi daam lagega.",
    },
    {
      q: "Agar shaadi ki date, muhurat ya venue badal jaye to kya dobara khareedna padega?",
      a: "Nahi! Ek baar template lene ke baad aap apne dashboard me login karke kabhi bhi date, muhurat ya Google Maps link bilkul FREE me jitni baar chahein edit kar sakte hain.",
    },
    {
      q: "Payment ke kya sadhan (options) uplabdh hain?",
      a: "Aap UPI (Google Pay, PhonePe, Paytm, BHIM), QR Code, Sabhi Debit/Credit Cards ya Net Banking ke zariye payment kar sakte hain. Payment hote hi aapka card turant active ho jata hai.",
    },
    {
      q: "Card ka link kitne samay tak live rahega?",
      a: "Aapka card kam se kam 1 saal tak live rehta hai taaki shaadi ke baad bhi rishtedaar photos, yaadein aur shubhkaamnayein dekh sakein. Iske baad bhi renew karne ka koi dabav nahi hota.",
    },
  ];

  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(initialFaqs);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/public/faqs?category=pricing");
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
        // Keep initialFaqs
      }
    }
    loadFaqs();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION - 100% PAY PER TEMPLATE MODEL */}
        <section className="relative overflow-hidden pt-14 pb-16 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-4 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>100% Pay-Per-Template Model &bull; Zero Subscription &bull; No Packages</span>
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl  font-bold text-stone-900 tracking-tight leading-[1.18]">
              Koi Package Nahi, Koi Monthly Fee Nahi —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-2">
                Jo Template Pasand Aaye, Sirf Uska Pay Karein!
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto font-sans">
              VivahVaani par koi package lene ki majboori nahi hai. Har invitation template ka ek transparent one-time rate hai. Pasand karein, customize karein aur direct WhatsApp par bhejein.
            </p>

            {/* TRUST PILLS */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-medium text-stone-600">
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pay Only For 1 Template
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-600" /> 1-Click WhatsApp Ready
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                <Edit3 className="w-4 h-4 text-rose-600" /> Lifetime Free Live Edits
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-purple-600" /> 100% Secure UPI &amp; Cards
              </span>
            </div>
          </div>
        </section>

        {/* HOW PAY-PER-TEMPLATE WORKS (3 SIMPLE STEPS) */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs uppercase  tracking-widest text-amber-800 font-bold">
              ✦ Aasaan &amp; Transparent Niyam ✦
            </span>
            <h2 className="text-2xl sm:text-3xl  font-bold text-stone-900">
              Kaise Kaam Karta Hai Hamara Pay-Per-Template Model?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              Bina kisi subscription ya bundle pack ke, sirf 3 aasaan steps me apna card live karein:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, i) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs hover:shadow-md transition relative flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200 flex items-center justify-center text-rose-800  font-bold text-lg">
                        <StepIcon className="w-6 h-6 text-amber-700" />
                      </div>
                      <span className="text-2xl  font-bold text-stone-200">
                        {st.step}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg  font-bold text-stone-900">
                        {st.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center gap-1 text-xs font-semibold text-rose-800">
                    <span>Zero commitment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TEMPLATE FORMATS & PRICE BREAKDOWN */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs uppercase  tracking-widest text-amber-800 font-bold">
              ✦ Format Ke Hisaab Se Transparent Pricing ✦
            </span>
            <h2 className="text-2xl sm:text-3xl  font-bold text-stone-900">
              Pick Your Template Format
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              Aapko jo design pasand aaye sirf usi ka one-time rate dena hai. Koi package ya credit system nahi hai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templateFormats.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                  plan.highlight
                    ? "border-amber-400 ring-2 ring-amber-400/30 shadow-xl relative scale-102"
                    : "border-stone-200/90 shadow-xs hover:shadow-md"
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${plan.badgeColor}`}
                    >
                      {plan.badge}
                    </span>
                    <span className="text-[10px]  font-bold text-stone-500 uppercase tracking-wider">
                      {plan.formatBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl  font-bold text-stone-900">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl  font-bold text-stone-900 tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-stone-500">/ per template</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                      {plan.priceSubtitle}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs text-stone-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Is Template Me Shamil:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-center block transition ${plan.ctaClass}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CATALOG EXPLORER STRIP */}
          <div className="mt-8 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100/80 px-6 py-3 rounded-full border border-amber-200 transition"
            >
              <span>Sabhi 50+ Live Templates &amp; Unke Rates Gallery Me Dekhein</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* UNIVERSAL INCLUSIONS: HAR TEMPLATE KE SATH FREE ME KYA MILTA HAI */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-stone-200">
            <div className="text-center space-y-2 mb-10">
              <span className="text-xs uppercase  tracking-widest text-rose-800 font-bold">
                ✦ Sabhi Templates Par Lagu ✦
              </span>
              <h2 className="text-2xl sm:text-3xl  font-bold text-stone-900">
                Har Ek Template Ke Sath Yeh Sabkuch Included Hai
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                Chahe aap ₹199 ka card lein ya ₹599 ka interactive slider — hamari taraf se yeh standard suvidhayein har customer ko milti hain:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {universalFeatures.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
                      <ItemIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm  font-bold text-stone-900">{item.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TRANSPARENT COMPARISON: PAY-PER-TEMPLATE VS TRADITIONAL CARDS */}
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs uppercase  tracking-widest text-amber-800 font-bold">
                ✦ Asli Bachat &bull; Asli Suvidha ✦
              </span>
              <h3 className="text-xl sm:text-2xl  font-bold text-stone-900">
                Pay-Per-Template Model Kyun Hai Sabse Kifayati?
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 ">
                    <th className="py-3 px-4 font-semibold">Suvidha (Features)</th>
                    <th className="py-3 px-4 font-semibold text-rose-800 bg-rose-50/60 rounded-t-lg">
                      VivahVaani (Pay-Per-Template)
                    </th>
                    <th className="py-3 px-4 font-semibold text-stone-600">
                      Physical Paper Printing
                    </th>
                    <th className="py-3 px-4 font-semibold text-stone-600">
                      SaaS / Subscription Apps
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Payment Model</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold bg-rose-50/60">
                      One-Time Single Template Pay
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">Bulk Cards Printing Cost</td>
                    <td className="py-3.5 px-4 text-rose-600">Monthly Auto-Debit / Recurring</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Estimated Kharcha</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold bg-rose-50/60">
                      Sirf ₹199 - ₹599
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">₹15,000 - ₹50,000+</td>
                    <td className="py-3.5 px-4 text-stone-500">₹1,500 - ₹4,000/saal</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Date / Venue Badalne Par</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold bg-rose-50/60">
                      Free Live Edit (Turant update)
                    </td>
                    <td className="py-3.5 px-4 text-rose-600">Reprinting ka poora kharcha</td>
                    <td className="py-3.5 px-4 text-stone-500">Limited edits</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Google Maps Navigation</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold bg-rose-50/60">
                      Built-in 1-Click GPS Link
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">Nahi hota (bhatakte hain)</td>
                    <td className="py-3.5 px-4 text-stone-500">Extra charge</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Live RSVP Food Wastage Tracker</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold bg-rose-50/60">
                      Haan, Real-time counting
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">Nahi hota</td>
                    <td className="py-3.5 px-4 text-stone-500">Kewal premium packs me</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* OPTIONAL ADD-ONS SECTION */}
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 border border-stone-200">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs uppercase  tracking-widest text-rose-800 font-bold">
                ✦ Optional Power-Ups ✦
              </span>
              <h3 className="text-xl sm:text-2xl  font-bold text-stone-900">
                Aapke Card Ko Aur Khaas Banane Ke Liye Add-Ons
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Inhe aap template customize karte waqt apni marzi se add kar sakte hain (Koi compulson nahi hai):
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOns.map((addon, idx) => {
                const Icon = addon.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-stone-900">{addon.name}</h4>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          +{addon.price}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{addon.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs uppercase  tracking-widest text-amber-800 font-bold">
              ✦ Aapke Sawaal, Hamare Jawaab ✦
            </span>
            <h2 className="text-2xl sm:text-3xl  font-bold text-stone-900 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-700" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Pay-per-template model aur card validity se jude mukhya sawaal
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs space-y-2"
              >
                <h4 className="text-sm sm:text-base  font-bold text-stone-900 flex items-start gap-2">
                  <span className="text-rose-700 font-sans font-bold">Q.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM TATKAL BANNER */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-amber-50 rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-400/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[11px]  uppercase tracking-widest text-amber-300 font-bold">
                Indore Design Desk Support
              </span>
              <h3 className="text-2xl  font-bold text-amber-100">
                Shaadi Me Bas 2-3 Din Bache Hain?
              </h3>
              <p className="text-xs text-stone-300 max-w-lg">
                Hamari Tatkal Urgent Desk 2 ghante ke andar aapka digital card link bana kar active kar sakti hai.
              </p>
            </div>

            <a
              href="https://wa.me/919826012345?text=Namaste!%20Mujhe%20urgent%20wedding%20invitation%20setup%20chahiye"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 text-xs sm:text-sm shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
              <span>WhatsApp Tatkal Helpline</span>
            </a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
