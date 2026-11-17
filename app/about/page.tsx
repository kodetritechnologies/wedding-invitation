import Link from "next/link";
import {
  Heart,
  Sparkles,
  MapPin,
  Leaf,
  ShieldCheck,
  Building,
  ArrowRight,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function AboutPage() {
  const values = [
    {
      title: "Cultural Reverence & Modern Design",
      desc: "We understand that Indian weddings are deep cultural milestones. Our designs honor traditional sanskriti with modern digital elegance and interactivity.",
      icon: Heart,
    },
    {
      title: "Sustainable & Paperless Celebrations",
      desc: "Millions of printed wedding cards end up in landfills days after the event. Digital invitations save lakhs of trees and eliminate physical delivery hassle.",
      icon: Leaf,
    },
    {
      title: "Uncompromising Privacy First",
      desc: "Wedding guest lists and family contact numbers must never be publicly exposed. ShaadiConnect isolates every tenant's data with enterprise-grade security.",
      icon: ShieldCheck,
    },
    {
      title: "Empowering Local Wedding Creators",
      desc: "We give wedding planners, invitation designers, and photographers in Indore and beyond the SaaS infrastructure to run multi-client wedding operations.",
      icon: Building,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rooted in Indore, Madhya Pradesh</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight">
            Preserving Indian Wedding Traditions in the Digital Age
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            ShaadiConnect was founded to eliminate the logistical headaches of physical card printing and distribution, replacing them with interactive, structured, and beautiful digital celebrations.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center font-sans">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-rose-600 font-bold">
              Our Origin
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Born from the Celebrations of Malwa
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Indore is known throughout India for its warmth, hospitality, and vibrant multi-day weddings. Yet, every wedding season, we saw families running around delivering heavy paper cards, while event timings and venue directions remained scattered across messy WhatsApp chats.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We asked a simple question: <strong className="text-stone-900">Why can&apos;t a digital wedding invitation be as regal as a gold-embossed card, while being as smart as a live GPS itinerary?</strong>
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              That was the genesis of ShaadiConnect — a centrally governed platform where couples and wedding businesses create elegant, interactive invitation experiences.
            </p>
          </div>

          <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-amber-950 text-amber-50 rounded-2xl p-8 shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-amber-300/40 text-amber-300 mx-auto flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-amber-100">
              Madhya Pradesh to Pan-India
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Starting from pilot weddings in Indore, we are scaling across Bhopal, Ujjain, Gwalior, and major wedding hubs across India, serving families and wedding professionals alike.
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-6 font-sans">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              Our Principles
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              What Guides ShaadiConnect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">{v.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-8 font-sans">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Be Part of the Digital Wedding Revolution
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-xs"
            >
              Join ShaadiConnect
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white border border-stone-300 text-stone-800 font-semibold rounded-xl text-xs hover:bg-stone-100"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
