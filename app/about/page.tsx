"use client";

import Link from "next/link";
import {
  Heart,
  Sparkles,
  MapPin,
  Leaf,
  ShieldCheck,
  Building,
  ArrowRight,
  Check,
  Users,
  Compass,
  Award,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function AboutPage() {
  const pillars = [
    {
      title: "Parampara & Sanskriti Ka Aadar",
      desc: "Shaadi koi aam event nahi, do parivaron ka pavitra sangam hai. Hamare har card me Ganesha Vandana, Vedic shlokas aur mangal aashirvaad ko sarvopari sthan milta hai.",
      icon: Heart,
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      title: "Paryavaran & Bachat (Zero Paper Waste)",
      desc: "Lakhon mehnge paper cards shaadi ke agle din kudedan me chale jate hain. ShaadiConnect se hazaaron ped bachte hain aur parivar ke ₹30,000 se ₹50,000 direct bachte hain.",
      icon: Leaf,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "100% Private & Pavitra Guest Data",
      desc: "Aapke rishtedaron ke phone number aur guest list hamare liye amanat hain. Zero advertisements, zero spam, aur zero third-party data sharing.",
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Local Wedding Planners Ka Saath",
      desc: "Indore, Bhopal, Jaipur se leke har shahar ke photographers, card printers aur wedding event planners ke liye ek modern multi-client SaaS workspace.",
      icon: Building,
      color: "bg-amber-50 text-amber-800 border-amber-200",
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
              <span>Malwa Ki Mitti &bull; Indore Se Pan-India</span>
              <span>✦</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Bhartiya Shaadiyon Ki Shaan,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-1">
                Digital Yug Ki Aasani Ke Sath.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto font-sans">
              Humne ShaadiConnect isliye banaya taaki Papa ji ko shaadi ke din address samjhane ke liye 50 phone calls na lene padein, aur har rishtedaar ko poore samman ke sath shubh nimantran mile.
            </p>
          </div>
        </section>

        {/* STORY OF ORIGIN */}
        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-stone-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs uppercase font-cinzel tracking-widest text-rose-800 font-bold">
                Hamari Kahani &bull; Our Story
              </span>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
                Indore Ke Mandapon Se Shuru Hua Ek Asli Sawaal
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Indore aur Malwa apni laajawab mehman-nawazi aur shaadiyon ke dhoom-dhadake ke liye poore desh me mashhoor hain. Lekin har wedding season me hum ek aam baat dekhte the:
              </p>

              <blockquote className="p-4 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-2xl italic text-xs sm:text-sm text-stone-800 font-serif leading-relaxed">
                &ldquo;Shaadi se 15 din pehle Papa ji aur Chacha ji dhoop me gadi chala kar 300 gharon me lifafe baantne nikalte hain. Phir bhi shaadi wale din highway par mehmaan bhatak jaate hain, aur halwai ko pata hi nahi hota ki 250 log aayenge ya 400!&rdquo;
              </blockquote>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Humne socha: <strong className="text-stone-900">Agar train ki ticket, flight aur banking sab phone par ho sakti hai, to shaadi ka nimantran ek static paper ya boring PDF me kyun bandhe?</strong>
              </p>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Isi soch se janma <strong className="text-rose-800">ShaadiConnect</strong> — ek aisi Digital Royal Patrika jisme Rajwada ki shaan bhi hai, Google Maps ka rasta bhi, aur live RSVP headcount bhi.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 text-amber-50 rounded-3xl p-8 shadow-xl border border-amber-400/20 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-cinzel uppercase tracking-widest text-amber-300 font-bold block">
                    Headquartered In
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-amber-100">
                    Indore, Madhya Pradesh
                  </h3>
                  <p className="text-xs text-stone-300 font-sans">
                    Vijay Nagar, Commercial Hub &bull; 452010
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-left text-xs font-sans">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-amber-300 font-serif font-bold text-lg block">500+</span>
                    <span className="text-stone-300 text-[11px]">Weddings Hosted</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-amber-300 font-serif font-bold text-lg block">₹45 Lakhs+</span>
                    <span className="text-stone-300 text-[11px]">Catering Saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CORE PRINCIPLES */}
        <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-cinzel tracking-widest text-amber-800 font-bold">
              ✦ Hamare Siddhant ✦
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Jo ShaadiConnect Ko Khaas Banata Hai
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-xs hover:shadow-lg transition space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${pil.color} flex items-center justify-center border shadow-2xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      {pil.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans pl-1">
                    {pil.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM INVITATION BANNER */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-amber-950 text-amber-50 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl border border-amber-400/20">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
              Aaiye, Apne Parivar Ki Shaadi Ko Digital Banayein
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed font-sans">
              Hamari Indore desk kisi bhi sahayata ke liye hamesha taiyar hai.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 font-sans">
              <Link
                href="/templates"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-md transition text-xs sm:text-sm"
              >
                Browse Royal Templates
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition text-xs sm:text-sm"
              >
                Connect With Indore Office
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
