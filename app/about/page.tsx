"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  Leaf,
  ShieldCheck,
  Building,
  Check,
  ArrowRight,
  Send,
  Users,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { BRAND } from "@/lib/brand";

interface SiteSettings {
  businessName?: string;
}

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch("/api/public/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  const brandName = settings?.businessName || BRAND.name;

  const pillars = [
    {
      title: "Parampara & Sanskriti Ka Aadar",
      desc: "Shaadi koi sadharan karyakram nahi, do parivaron ka pavitra sangam hai. Hamare har invitation me Ganesha Vandana, Vedic shlokas aur mangal aashirvaad ko sarvopari sthan milta hai.",
      icon: Heart,
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      title: "Paryavaran & Bachat (Zero Paper Waste)",
      desc: "Lakhon mehnge paper cards event ke agle din kudedan me chale jate hain. Digital patrika se ped bachte hain aur parivar ke ₹25,000 se ₹60,000 sidhe bachte hain.",
      icon: Leaf,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "100% Private & Pavitra Guest Data",
      desc: "Aapke rishtedaron ke phone number aur guest list hamare liye amanat hain. Zero advertisements, zero spam, aur zero third-party data monetization.",
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Wedding Planners & Studios Ka Saath",
      desc: "Local photographers, card printers aur event planners ke liye ek samarpit digital platform jahan wo apne clients ko instant digital invitations deliver kar sakein.",
      icon: Building,
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  const highlights = [
    "WhatsApp par 1 click me shareable high-speed invitations",
    "Ganesh Vandana, Vedic Shlok aur Shubh Muhurat sections",
    "Google Maps navigation button har mehmaan ke liye",
    "Bina kisi technical gyan ke 2 minute me live website tayyar",
    "Mobile-first responsive design jo har smartphone par khulta hai",
    "PDF Patrika aur Video formats bhi uplabdh",
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-14 pb-16 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Hamari Kahani & Uddeshya
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-6">
              Bhartiya Sanskar, Modern Takneek: {brandName}
            </h1>
            <p className="text-base sm:text-xl text-stone-700 max-w-2xl mx-auto leading-relaxed">
              Humne shuru kiya ek seedhe vichar se: Bhartiya shadiyon aur mangal karyakramon ki sanskriti ko bina kisi samjhote ke digital daur me le aana.
            </p>
          </div>
        </section>

        {/* MISSION & STORY */}
        <section className="py-16 px-6 sm:px-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                Paper Se Digital Ka Yeh Badlav Kyun Zaroori Hai?
              </h2>
              <p>
                Bhartiya parivaron me shaadi ya mangal karyakram ki patrika banna sabse pehla aur pavitra charan hota hai. Par har saal karodon paper cards print hote hain jinme se 90% vivah ke kuch hi ghanton baad dustbin me phenk diye jate hain.
              </p>
              <p>
                Paper cards na to venue ka direct Google Map batate hain, na aane wale samay me muhurat badalne par update ho sakte hain, aur door daraz ke rishtedaron tak pahuchane me hazaron rupaye courier aur samay barbad hota hai.
              </p>
              <p className="font-medium text-stone-900">
                {brandName} is samasya ka sanskritik aur aadhunik hal hai. Yeh aapke WhatsApp dwara sabhi doston aur parivar tak turant pahuchta hai, mehmaano ko Google Maps navigation deta hai, aur shreshth Vedic prathnaon ke sath mangal sandesh deliver karta hai.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#FFF9EE] to-[#FAF1DF] p-8 rounded-3xl border border-amber-200/80 shadow-sm relative">
              <h3 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700" /> Parivaron Ko Kya Labh Milta Hai?
              </h3>
              <ul className="space-y-3">
                {highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 uppercase tracking-wider block">Shuruat</span>
                  <span className="text-sm font-bold text-stone-900">₹499 Se Shuruat</span>
                </div>
                <Link
                  href="/wedding"
                  className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition shadow-sm"
                >
                  Designs Dekhein
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4 PILLARS */}
        <section className="py-16 px-6 sm:px-8 bg-stone-100/50 border-y border-stone-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-widest">Moolya & Vishwas</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                Hamare 4 Mukhya Siddhant
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${pillar.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-stone-900 mb-2 leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 sm:px-8 max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Apne Shubh Karyakram Ko Banayein Khaas
            </h2>
            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Pesh hai sunder digital patrika, jo har kisi ke dil ko chhoo le aur paryavaran ki raksha kare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/wedding"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm transition shadow-md inline-flex items-center justify-center gap-2"
              >
                Catalog Explore Karein <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition border border-white/20 inline-flex items-center justify-center gap-2"
              >
                Hamein Sampark Karein <Send className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
