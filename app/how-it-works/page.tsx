"use client";

import Link from "next/link";
import {
  Palette,
  CalendarHeart,
  Share2,
  ArrowRight,
  Smartphone,
  Check,
  Heart,
  Eye,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      stepNum: "कदम 01",
      number: "01",
      title: "5 Minute Me Shubh Details Bhariye",
      desc: "Dulha-Dulhan ke naam, dono parivaron ka mangal aashirvaad sandesh aur shaadi ki tareekh enter karein.",
      badge: "Easy Form &bull; 5 Minutes",
      icon: Heart,
      color: "bg-rose-50 text-rose-700 border-rose-200",
      accent: "from-rose-700 to-rose-900",
      highlights: ["Hindi ya English me text", "Family elders ke contact numbers", "Bilingual option"],
    },
    {
      stepNum: "कदम 02",
      number: "02",
      title: "Royal Rajwada Ya Floral Theme Chuniye",
      desc: "Aapke wedding venue aur dress code ke anusaar royal palace, pastel lawn, ya traditional Vedic gold template select karein.",
      badge: "100+ Custom Styles",
      icon: Palette,
      color: "bg-amber-50 text-amber-800 border-amber-200",
      accent: "from-amber-600 to-amber-800",
      highlights: ["Mobile par instant live preview", "Custom color swatches", "Auspicious Ganesha / Shloka headers"],
    },
    {
      stepNum: "कदम 03",
      number: "03",
      title: "Haldi, Sangeet & Vivah Ke Function Jodein",
      desc: "Har ceremony ka exact muhurat time, venue address, dress code aur direct Google Maps link add karein.",
      badge: "Multi-Day Itinerary",
      icon: CalendarHeart,
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accent: "from-emerald-700 to-emerald-900",
      highlights: ["1-Click Google Maps GPS pin", "Pheras & Barat muhurat timings", "Dress code suggestions"],
    },
    {
      stepNum: "कदम 04",
      number: "04",
      title: "WhatsApp Par 1-Click Bhejiye & RSVP Dekhiye",
      desc: "Apna branded link (`vivahvaani.kodetri.com/w/aarav-diya`) sabhi groups aur doston ko bhejiye aur live plate headcount track karein.",
      badge: "Instant WhatsApp Sharing",
      icon: Share2,
      color: "bg-purple-50 text-purple-800 border-purple-200",
      accent: "from-purple-700 to-purple-900",
      highlights: ["VIP guest personalized names", "Live RSVP catering dashboard", "Zero app download for guests"],
    },
  ];

  const guestExperienceSteps = [
    {
      title: "1. WhatsApp Par Link Milti Hai",
      desc: "Mehmaan ko sundar preview ke sath message milta hai: 'Pranaam! You are cordially invited to Aarav & Diya's Wedding.'",
    },
    {
      title: "2. 1-Tap Me Royal Patrika Khulti Hai",
      desc: "Bina kisi app ko install kiye ya password dale, phone ke browser me royal digital card shandar animations ke sath load hota hai.",
    },
    {
      title: "3. Direct Google Maps Navigation",
      desc: "Venues par tap karte hi phone me seedha Google Maps khul jata hai jo gate tak ka rasta batata hai.",
    },
    {
      title: "4. 2-Second Me RSVP Headcount Submit",
      desc: "Mehmaan tap karte hain 'Attending - 3 Members' aur aapka catering dashboard real-time me update ho jata hai.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden pt-14 pb-16 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-4 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-2xs font-cinzel">
              <span>✦</span>
              <span>4 Simple Steps &bull; 100% Frictionless</span>
              <span>✦</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Kaise Kaam Karta Hai{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-1">
                VivahVaani Digital Patrika?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto font-sans">
              Print aur courier ke jhanjhat ko alvida kahiye. Sirf 5 minute me aapka interactive wedding portal live ho jata hai — Google Maps, live RSVP aur WhatsApp sharing ke sath.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 font-bold rounded-xl shadow-xs transition flex items-center gap-2 text-xs sm:text-sm"
              >
                <span>Abhi 5 Minute Me Shuru Karein</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/w/aarav-diya"
                target="_blank"
                className="px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-2xs transition text-xs sm:text-sm flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-rose-600" />
                <span>Live Sample Dekhein</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 4 DETAILED PROCESS STEPS */}
        <section className=" mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-cinzel font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        {st.stepNum}
                      </span>
                      <div
                        className={`w-11 h-11 rounded-2xl ${st.color} flex items-center justify-center border shadow-2xs group-hover:scale-105 transition`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-stone-900 leading-snug">
                      {st.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {st.desc}
                    </p>

                    {/* Bullet Inclusions */}
                    <div className="space-y-2 pt-2 border-t border-stone-100 text-[11px] text-stone-700 font-sans">
                      {st.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
                    Step {st.number} of 04
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* GUEST JOURNEY EXPERIENCE HIGHLIGHT */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 text-amber-50 rounded-3xl p-8 sm:p-14 shadow-xl border border-amber-400/30 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Story */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-cinzel font-semibold">
                <span>✦</span>
                <span>The Grandfather Test &bull; Zero Friction</span>
                <span>✦</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 leading-tight">
                Dada Ji, Nani Ji Aur Door Ke Rishtedaar Bhi Aasani Se Khol Lete Hain
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                Aksar apps aur portals par password aur OTP ka jhanjhat hota hai jisse bade-buzurg pareshan hote hain. VivahVaani ko humne specially test kiya hai taaki 70 saal ke Dada ji bhi WhatsApp par link tap karke bina kisi rukawat ke poora card padh sakein aur venue navigation shuru kar sakein.
              </p>

              {/* Step Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans">
                {guestExperienceSteps.map((gs, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                    <h4 className="text-xs font-bold text-amber-300">{gs.title}</h4>
                    <p className="text-[11px] text-stone-300 leading-snug">{gs.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Mini Visual */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Smartphone className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Zero App Installation
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  Any iPhone, Android, Tablet or Laptop. Link opens in Chrome, Safari, ya WhatsApp in-app browser in under 1 second.
                </p>
                <div className="pt-2">
                  <Link
                    href="/w/aarav-diya"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Try Mobile View Right Now</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-6 py-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Aapki Shaadi Ka Card Taiyar Hone Me Sirf 5 Minute Lagenge
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-sans leading-relaxed">
            Abhi free account banayein, apna favourite royal design chuniye aur details fill karke preview dekhein.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 font-bold rounded-xl shadow-md transition text-xs sm:text-sm font-sans"
            >
              <span>Create Free Wedding Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
