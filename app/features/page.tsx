"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarHeart,
  Share2,
  Users,
  MapPin,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Eye,
  Utensils,
  Smartphone,
  PhoneCall,
  BellRing,
  HelpCircle,
  Heart,
  IndianRupee,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function FeaturesPage() {
  const [guestCount, setGuestCount] = useState(300);
  const [plateCost, setPlateCost] = useState(1200);

  // Typical unconfirmed no-show rate in Indian weddings without RSVP is ~25%
  const unconfirmedWastePlates = Math.round(guestCount * 0.22);
  const potentialSavings = unconfirmedWastePlates * plateCost;

  const comparisonRows = [
    {
      feature: "Total Cost for 300 Families",
      printed: "₹35,000 – ₹70,000 (Card + Box + Courier)",
      pdf: "₹3,000 – ₹8,000 (Graphic Designer)",
      shaadi: "₹299 – ₹599 (Poori Shaadi Ka Unlimited Access)",
      highlight: true,
    },
    {
      feature: "Catering Headcount Tracking",
      printed: "Zero tracking (Approximate guess)",
      pdf: "WhatsApp chat confusion & manual diaries",
      shaadi: "Live real-time RSVP dashboard with plate counts",
      highlight: true,
    },
    {
      feature: "Venue Directions (Google Maps)",
      printed: "Address printed, guests get lost on highway",
      pdf: "Static text, manual typing in maps",
      shaadi: "1-Click direct GPS location open karta hai",
      highlight: true,
    },
    {
      feature: "Multi-Day Timings & Dress Code",
      printed: "Separate inserts that guests misplace",
      pdf: "Zoomable image with small illegible text",
      shaadi: "Separate interactive cards for Haldi, Sangeet & Vivah",
      highlight: false,
    },
    {
      feature: "Last-Minute Muhurat/Venue Updates",
      printed: "Impossible to change once printed",
      pdf: "Purana PDF forward hota rehta hai",
      shaadi: "Dashboard se instant update — sabhi mehmaano ko live",
      highlight: false,
    },
    {
      feature: "Mehmaan Ka Aadar-Satkar (Personalization)",
      printed: "Pen se lifafe par naam likhna padta hai",
      pdf: "Sabko generic video/image bhejte hain",
      shaadi: "Phone screen par 'Honoured Guest: Sharma Ji & Parivar'",
      highlight: true,
    },
    {
      feature: "App Download / Login Requirement",
      printed: "None",
      pdf: "None",
      shaadi: "Zero App Download — Browser me 1-second me khulta hai",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-14 pb-16 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-4 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-2xs font-cinzel">
              <span>✦</span>
              <span>Khandani Shaan &bull; Modern Technology</span>
              <span>✦</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Har Function Ka Pukhta Schedule,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-1">
                Zero Confusion Aur Zero Khana Barbaad.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto font-sans">
              VivahVaani sirf ek digital card nahi hai — yeh aapke parivar ka personal wedding assistant hai jo Papa ji ke 50 phone calls bachata hai aur catering ka laakho rupaye ka nuksan rokta hai.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/w/aarav-diya"
                target="_blank"
                className="px-6 py-3 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 font-bold rounded-xl shadow-xs transition flex items-center gap-2 text-xs sm:text-sm"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Live Sample Invitation Dekho</span>
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-2xs transition text-xs sm:text-sm"
              >
                <span>Free Me Shuru Karein</span>
              </Link>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CATERING SAVINGS CALCULATOR */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-br from-amber-950 via-rose-950 to-stone-950 text-amber-50 rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-400/30 relative overflow-hidden">
            <div className="max-w-2xl space-y-2 mb-8">
              <span className="text-xs uppercase font-cinzel tracking-widest text-amber-300 font-bold">
                💰 Real Wedding Savings Calculator
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                Dekhiye Live RSVP Se Aapka Kitna Kharcha Bachega
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                Aamtaur par Indian weddings me bina RSVP ke 20% se 25% catering plates waste hoti hain kyunki exact headcount pata nahi hota.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10">
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-2">
                    <span className="text-stone-200">Total Mehmaan (Guest Families):</span>
                    <span className="text-amber-300 font-bold font-serif text-lg">{guestCount} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                    <span>100</span>
                    <span>500</span>
                    <span>1000</span>
                    <span>1500+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-2">
                    <span className="text-stone-200">Per Plate Catering Cost:</span>
                    <span className="text-amber-300 font-bold font-serif text-lg">₹{plateCost} / plate</span>
                  </div>
                  <input
                    type="range"
                    min="600"
                    max="3500"
                    step="100"
                    value={plateCost}
                    onChange={(e) => setPlateCost(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                    <span>₹600</span>
                    <span>₹1500</span>
                    <span>₹2500</span>
                    <span>₹3500</span>
                  </div>
                </div>
              </div>

              {/* Result Box */}
              <div className="bg-gradient-to-b from-emerald-950/80 to-emerald-900/60 p-6 rounded-2xl border border-emerald-400/40 text-center space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                  Aapki Estimated Direct Saving
                </span>
                <div className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                  ₹{potentialSavings.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-emerald-200/90 leading-snug">
                  Lagbhag <strong className="text-white">{unconfirmedWastePlates} extra plates</strong> ka kharcha bachega! VivahVaani ka cost sirf ₹599 hai — yaani 100x return on investment.
                </p>
                <div className="pt-2">
                  <Link
                    href="/pricing"
                    className="inline-block px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-md transition"
                  >
                    View All Plans &amp; Start
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 CORE PILLARS WITH INDIAN CONTEXT */}
        <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-cinzel tracking-widest text-rose-800 font-bold">
              ✦ Built For Real Indian Weddings ✦
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              6 Badi Musibatein, Ek Smart Solution
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Live RSVP */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200/60 shadow-2xs">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Live Catering Headcount Tracker
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Haldi me kitne log aayenge aur Reception me kitne? Mehmaan direct phone se Confirm ya Decline karte hain. Halwai aur caterer ko exact plate count dijiye bina kisi andaze ke.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-rose-700 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vegetarian &amp; Jain headcount option</span>
              </div>
            </div>

            {/* 2. Google Maps Direct Navigation */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60 shadow-2xs">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  1-Click Direct Google Maps GPS
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  &ldquo;Bhaiya resort ka gate kaha se hai?&rdquo; — Wedding day par Papa ji ko 50 calls attend nahi karne padenge. Card par tap karte hi phone me seedha Google Maps navigation shuru ho jata hai.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-blue-700 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exact gate &amp; parking location pin</span>
              </div>
            </div>

            {/* 3. Multi-Day Timeline & Dress Codes */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60 shadow-2xs">
                  <CalendarHeart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Haldi se Reception Ka Saaf Schedule
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Har function ki alag date, shubh muhurat, dress code (e.g. Haldi Peela, Shimmer Sangeet) aur venue ka alag card. Mehmaano ko koi confusion nahi rehta ki kab kya pehanna hai.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-amber-800 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Phera timings &amp; Barat departure alerts</span>
              </div>
            </div>

            {/* 4. WhatsApp Personalized Distribution */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Personalized Mehmaan Aadar-Satkar
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Sharma ji jab link kholenge to screen par likha aayega: <strong className="text-stone-800">Honoured Guest: Mr. Rajesh Sharma &amp; Family</strong>. Physical lifafe jaisa samman, bina pen se naam likhe.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unique invite links for VIP relatives</span>
              </div>
            </div>

            {/* 5. Zero App Download (Grandfather Friendly) */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/60 shadow-2xs">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Dada Ji &amp; Nani Ji Ke Liye Super-Easy
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Koi app install nahi karni, koi password nahi banana, koi OTP ka chakkar nahi. WhatsApp par aayi link par bas 1 tap karna hai aur patrika instant khul jaati hai.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-purple-800 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Runs smoothly on any Android or iPhone</span>
              </div>
            </div>

            {/* 6. Instant Update Control */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200/60 shadow-2xs">
                  <BellRing className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Instant Timing / Venue Updates
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Mausam kharab hua ya Barat ka time aadha ghanta aage hua? Admin dashboard me 1 minute me time update karein — link open karte hi sabko naya time dikhega.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-rose-800 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero re-printing or re-courier costs</span>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON MATRIX */}
        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs uppercase font-cinzel tracking-widest text-amber-800 font-bold">
              ✦ Honest Comparison ✦
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Printed Card vs WhatsApp PDF vs VivahVaani
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-900 text-amber-100 font-cinzel text-[11px] sm:text-xs tracking-wider">
                    <th className="py-4 px-6 font-bold">Feature / Suvidha</th>
                    <th className="py-4 px-4 font-normal text-stone-300">Printed Physical Card</th>
                    <th className="py-4 px-4 font-normal text-stone-300">Generic WhatsApp PDF</th>
                    <th className="py-4 px-6 font-bold text-amber-300 bg-rose-950">VivahVaani Royal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={i}
                      className={row.highlight ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-stone-50"}
                    >
                      <td className="py-4 px-6 font-bold text-stone-900">{row.feature}</td>
                      <td className="py-4 px-4 text-stone-600">{row.printed}</td>
                      <td className="py-4 px-4 text-stone-600">{row.pdf}</td>
                      <td className="py-4 px-6 font-bold text-rose-900 bg-rose-50/60 border-l border-rose-100">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{row.shaadi}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-amber-950 text-amber-50 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl border border-amber-400/20">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
              Apni Shaadi Ko Ek Royal Touch Dijiye
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed font-sans">
              Sirf 5 minute me aapka digital wedding card ready ho jayega. Live sample dekhiye ya direct free account banakar start karein.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 font-sans">
              <Link
                href="/register"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-md transition text-xs sm:text-sm"
              >
                Create Wedding Patrika Now
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition text-xs sm:text-sm"
              >
                Check Affordable Pricing (₹299)
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
