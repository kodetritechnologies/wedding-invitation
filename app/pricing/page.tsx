"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Sparkles, ShieldCheck, Zap, Globe, Music, FileText, CheckCircle2 } from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function PricingPage() {
  const templateTiers = [
    {
      id: "classic",
      name: "Classic Patrika",
      tier: "Minimal & Clean",
      price: "₹299",
      period: "Single Event • Zero Subscription",
      desc: "Chhoti shaadi, Sagai ya Griha Pravesh ke liye simple, fast-loading digital card.",
      badge: "Best for Intimate Events",
      badgeColor: "bg-stone-100 text-stone-700 border-stone-200",
      features: [
        "Single Page Clean Responsive Design",
        "Up to 3 Ceremonies (Sangeet, Vivah, Reception)",
        "1-Click Direct Google Maps GPS Navigation",
        "WhatsApp Direct 1-Click Sharing Link",
        "Family Contacts & Shlok Display",
        "6 Months Active Hosting Validity",
      ],
      cta: "Classic Templates Dekhein",
      ctaHref: "/templates?category=wedding",
      ctaClass: "bg-stone-900 hover:bg-stone-800 text-white",
      highlight: false,
    },
    {
      id: "royal",
      name: "Rajwada Royal Slider",
      tier: "Most Popular",
      price: "₹599",
      period: "Complete Event • 1 Year Hosting",
      desc: "Sabse lokpriya royal card slider — multi-screen ceremonies, background music aur live RSVP tracker.",
      badge: "⭐ 92% Parivar Isko Chunte Hain",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      features: [
        "Royal Card Slider (Multi-screen interactive swipes)",
        "Unlimited Ceremonies (Haldi, Mehendi, Sangeet, Vivah, Reception)",
        "Live RSVP Guest Headcount Tracker (Plate count bachegi)",
        "Background Shehnai / Traditional Music Player",
        "Couple Pre-Wedding Photo Gallery",
        "VIP Personalized Guest Names ('Honoured: Sharma Ji')",
        "1 Full Year Active Hosting Validity",
      ],
      cta: "Royal Slider Templates Dekhein",
      ctaHref: "/templates?category=wedding",
      ctaClass: "bg-gradient-to-r from-rose-700 via-rose-800 to-amber-900 hover:from-rose-800 hover:to-amber-950 text-amber-100 shadow-md border border-amber-400/40",
      highlight: true,
    },
    {
      id: "bespoke",
      name: "Maharaja Bespoke VIP",
      tier: "Luxury Experience",
      price: "₹999",
      period: "VIP Concierge • 2 Years Hosting",
      desc: "Aapke physical printed card ka exact digital replica + hamare designer ka dedicated support.",
      badge: "Includes Dedicated Designer",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      features: [
        "Sabhi Rajwada Royal features included",
        "Dedicated Designer Assistance (Same-day setup)",
        "Physical Printed Card ka Exact Digital Clone",
        "Custom Audio/Video Integration & Story Timeline",
        "Turn-by-turn Navigation & Custom WhatsApp Invite Messages",
        "2 Full Years Active Hosting Validity",
      ],
      cta: "Bespoke Templates Dekhein",
      ctaHref: "/templates?category=wedding",
      ctaClass: "bg-stone-900 hover:bg-stone-800 text-white",
      highlight: false,
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
      name: "Remove VivahVaani Branding",
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

  const b2bPacks = [
    {
      name: "Planner Starter Pack",
      cards: "5 Templates Pack",
      price: "₹1,499",
      perCard: "₹299 / card",
      desc: "Freelance designers aur wedding planners ke liye. Koi monthly subscription nahi.",
      features: ["5 Live Wedding Websites", "Credits Kabhi Expire Nahi Hote", "White-Label Client Delivery"],
    },
    {
      name: "Agency Pro Pack",
      cards: "15 Templates Pack",
      price: "₹3,999",
      perCard: "₹266 / card",
      desc: "High volume photo studios aur event management teams ke liye sabse kifayati pack.",
      features: ["15 Live Wedding Websites", "Priority WhatsApp Support", "Custom Branding Enabled"],
    },
  ];

  const initialFaqs = [
    {
      q: "Kya isme koi monthly ya yearly subscription charge hai?",
      a: "Bilkul NAHI! VivahVaani har template ka ek direct fixed price leta hai. Aapko sirf card customize karke pay karna hai. Na koi recurring auto-debit hai, na koi hidden charges.",
    },
    {
      q: "Card ka link kitne samay tak live rahega?",
      a: "Aapka card kam se kam 1 saal tak live rehta hai taaki shaadi ke baad bhi rishtedaar photos aur yaadein dekh sakein. Iske baad bhi renew karne ka koi force nahi hota.",
    },
    {
      q: "Payment kaise karna hota hai?",
      a: "Aap UPI, Google Pay, PhonePe, Paytm, QR Code ya Net Banking ke zariye payment kar sakte hain. Payment hote hi card turant active ho jaata hai.",
    },
    {
      q: "Agar shaadi ka muhurat ya venue aage peeche hua to kya dobara khareedna padega?",
      a: "Nahi! Aap apne dashboard me login karke kabhi bhi date, muhurat, ya venue ka Google Map link bina kisi extra shulk ke live edit kar sakte hain.",
    },
    {
      q: "Kya hamara guest list aur phone numbers surakshit rahenge?",
      a: "Haan, aapka pura data 100% surakshit aur encrypted hai. Hum kisi bhi third-party ad network ko data share ya sell nahi karte.",
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
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-14 pb-16 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-4 relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Fixed Pricing &bull; Zero Subscription &bull; Lifetime Event Hosting</span>
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.18]">
              Har Template Ka Ek Fix Price,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-2">
                Na Subscription Ka Jhanjhat, Na Hidden Charges
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto font-sans">
              Apni pasand ka template chunein, customize karein aur sirf ek baar pay karke apne saare rishtedaaron ko WhatsApp par royal nimantran bhejein.
            </p>

            {/* TRUST PILLS */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-medium text-stone-600">
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Live Activation
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-600" /> 1-Click WhatsApp Ready
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-rose-600" /> Safe UPI & Cards Payment
              </span>
            </div>
          </div>
        </section>

        {/* TEMPLATE TIERS GRID */}
        <section className="max-w-7xl mx-auto px-6 py-14">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs uppercase font-cinzel tracking-widest text-amber-800 font-bold">
              ✦ Parivar Ke Budget Me Shreshth Nirmaan ✦
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Pick Your Template Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templateTiers.map((plan) => (
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
                    {plan.highlight && (
                      <span className="text-[10px] font-cinzel font-bold text-rose-800 tracking-wider uppercase">
                        Top Choice
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-900">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
                        {plan.price}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                      {plan.period}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs text-stone-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      What&apos;s Included:
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
        </section>

        {/* OPTIONAL ADD-ONS SECTION */}
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 border border-stone-200">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs uppercase font-cinzel tracking-widest text-rose-800 font-bold">
                ✦ Optional Power-Ups ✦
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Aapke Card Ko Aur Khaas Banane Ke Liye Add-Ons
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Inhe aap template customize karte waqt apni marzi se add kar sakte hain:
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

        {/* B2B / WEDDING PLANNERS BULK PACKS */}
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-3xl p-8 sm:p-10 border border-amber-500/20 shadow-lg">
            <div className="max-w-2xl mx-auto text-center space-y-2 mb-8">
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-amber-400 font-bold">
                ✦ For Wedding Planners & Photographers ✦
              </span>
              <h3 className="text-2xl font-serif font-bold text-amber-100">
                Prepaid Bulk Packs (No Monthly Fee)
              </h3>
              <p className="text-xs text-stone-300">
                Agar aap event agency ya photographer hain, to prepaid bundle packs lein. Credits kabhi expire nahi hote!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {b2bPacks.map((pack, idx) => (
                <div
                  key={idx}
                  className="bg-stone-800/80 rounded-2xl p-6 border border-amber-400/20 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-white">{pack.name}</h4>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300">
                        {pack.cards}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-amber-200">{pack.price}</span>
                      <span className="text-xs text-stone-400">({pack.perCard})</span>
                    </div>
                    <p className="text-xs text-stone-300">{pack.desc}</p>
                    <ul className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-700">
                      {pack.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/contact?type=b2b"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs text-center transition block"
                  >
                    B2B Pack Inquiry Karein
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION / LIST */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs uppercase font-cinzel tracking-widest text-amber-800 font-bold">
              ✦ Aapke Sawaal, Hamare Jawaab ✦
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs space-y-2"
              >
                <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900 flex items-start gap-2">
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
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-amber-300 font-bold">
                Indore Design Desk Support
              </span>
              <h3 className="text-2xl font-serif font-bold text-amber-100">
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
