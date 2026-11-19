"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  Heart,
  Crown,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function PricingPage() {
  const plans = [
    {
      id: "basic",
      name: "Shubh Aarambh",
      tier: "Essential",
      price: "₹299",
      period: "One-Time Payment &bull; Single Wedding",
      desc: "Chhoti shaadi ya intimate ceremonies ke liye simple, clean digital card.",
      badge: "Best for Intimate Weddings",
      badgeColor: "bg-stone-100 text-stone-700 border-stone-200",
      features: [
        "Up to 3 Ceremonies (e.g. Sangeet, Vivah, Reception)",
        "1-Click Direct Google Maps GPS Navigation",
        "WhatsApp Direct 1-Click Sharing",
        "Mobile-Responsive Royal Layout",
        "Family Phone Contacts on Card",
        "3 Months Live Hosting Validity",
      ],
      notIncluded: [
        "Live RSVP Catering Headcount Tracker",
        "Personalized Guest Name Links",
        "Custom URL Slug",
      ],
      cta: "Shubh Aarambh Chunein",
      ctaClass: "bg-stone-900 hover:bg-stone-800 text-white",
      highlight: false,
    },
    {
      id: "royal",
      name: "Rajwada Royal",
      tier: "Most Popular",
      price: "₹599",
      period: "One-Time Payment &bull; Complete Wedding",
      desc: "Sabse pasandeeda package — Live RSVP, unlimited ceremonies aur personalized guest samman.",
      badge: "⭐ 92% Families Choose This",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      features: [
        "Unlimited Ceremonies (Haldi, Mehendi, Sangeet, Vivah, Reception...)",
        "Live RSVP Catering Headcount Dashboard (Track exact plates)",
        "VIP Personalized Guest Names ('Honoured: Sharma Ji & Parivar')",
        "Custom Branded URL Slug (/w/couple-names)",
        "1-Click Google Maps Venue GPS Navigation",
        "Instant Muhurat & Venue Update Control",
        "1 Full Year Active Hosting (Post-wedding memories ke liye)",
      ],
      notIncluded: ["Dedicated Designer VIP Concierge"],
      cta: "Rajwada Royal Chunein",
      ctaClass: "bg-gradient-to-r from-rose-700 via-rose-800 to-amber-900 hover:from-rose-800 hover:to-amber-950 text-amber-100 shadow-md border border-amber-400/40",
      highlight: true,
    },
    {
      id: "bespoke",
      name: "Maharaja Bespoke",
      tier: "Luxury VIP",
      price: "₹999",
      period: "One-Time Payment &bull; VIP Concierge",
      desc: "Aapke printed physical card ka exact digital replica + dedicated designer support.",
      badge: "Includes Dedicated Designer",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      features: [
        "Sabhi Rajwada Royal features included",
        "Dedicated Designer Assistance from our Indore Studio",
        "Printed Physical Card Ka Exact Digital Replica Conversion",
        "Background Shehnai / Music Track Integration",
        "Couple Pre-Wedding Photo Gallery & Video Embed",
        "Priority VIP WhatsApp Support (Same-day setup)",
        "2 Full Years Active Hosting Validity",
      ],
      notIncluded: [],
      cta: "Maharaja Bespoke Chunein",
      ctaClass: "bg-stone-900 hover:bg-stone-800 text-white",
      highlight: false,
    },
  ];

  const initialFaqs = [
    {
      q: "Agar shaadi ka muhurat ya venue aage peeche hua to kya naya card khareedna padega?",
      a: "Bilkul nahi! Printed card me ek baar galti ho gayi to re-printing me hazaron rupaye lagte hain. VivahVaani me aap apne login dashboard se 1 second me naya time ya naya address save kar sakte hain — live link open karte hi sabhi mehmaano ko updated details dikhegi.",
    },
    {
      q: "Bade buzurg aur gaon ke rishtedaar isko aasani se dekh payenge?",
      a: "Ji haan! Hamara 'Grandfather Test' certified hai. Mehmaan ko na to koi app download karni hai, na password dalna hai aur na OTP. WhatsApp par aayi link par bas 1 tap karte hi card bina kisi rukawat ke open ho jata hai.",
    },
    {
      q: "Payment kaise karna hota hai?",
      a: "Hum sabhi standard Indian payment methods support karte hain — UPI (GPay, PhonePe, Paytm), NetBanking, Debit/Credit Cards. One-time packages me koi hidden recurring charges nahi hote.",
    },
    {
      q: "Kya hamara guest list aur phone numbers private rahenge?",
      a: "100% Guaranteed. VivahVaani par privacy hamara pehla niyam hai. Aapke mehmaano ka data ya phone number kisi bhi third party ko share ya advertise nahi kiya jata.",
    },
  ];

  const [faqs, setFaqs] = useState(initialFaqs);

  // Fetch Pricing FAQs dynamically from API
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
        // Fallback to initial static FAQs
      }
    }
    loadFaqs();
  }, []);

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
              <span>Kifayati &bull; Saaf &bull; Zero Hidden Costs</span>
              <span>✦</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Ek Physical Card Ka Kharcha ₹250,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-1">
                Poori Shaadi Ka Unlimited Card Sirf ₹599 Me.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto font-sans">
              Print aur courier par ₹30,000 kharch karne ki zaroorat nahi. Apni shaadi ke hisaab se seedha one-time package chuniye aur bina kisi jhanjhat ke digital card banayein.
            </p>
          </div>
        </section>

        {/* PACKAGES GRID */}
        <section className=" mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                  plan.highlight
                    ? "border-amber-400 ring-2 ring-amber-400/30 shadow-xl relative scale-102"
                    : "border-stone-200/90 shadow-xs hover:shadow-md"
                }`}
              >
                <div className="space-y-5">
                  {/* Badge */}
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
                    <span className="text-[11px] text-stone-500 block mt-1">
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
                    href="/register"
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-center block transition ${plan.ctaClass}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
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
