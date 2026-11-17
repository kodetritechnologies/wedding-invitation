import Link from "next/link";
import {
  Palette,
  CalendarHeart,
  Share2,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Sparkles,
  MapPin,
  Users,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Select an Elegant Design",
      desc: "Browse our curated collection of Indian wedding themes — from regal Rajasthani palace motifs to soft blush florals. Pick the aesthetic that matches your celebration.",
      icon: Palette,
      color: "from-rose-500 to-rose-700",
    },
    {
      num: "02",
      title: "Add Functions & Maps Navigation",
      desc: "Fill in the bride and groom details, family messages, and the full multi-day itinerary (Haldi, Mehendi, Sangeet, Vivah, Reception) with accurate Google Maps venue links.",
      icon: CalendarHeart,
      color: "from-amber-500 to-amber-700",
    },
    {
      num: "03",
      title: "Share on WhatsApp with 1-Click",
      desc: "Generate your unique public invitation link (`/w/couple-names`). Share it directly across WhatsApp groups or send personalized links with guest family names honored.",
      icon: Share2,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      num: "04",
      title: "Track Live RSVPs & Headcounts",
      desc: "Guests RSVP directly without downloading an app or logging in. Watch your live dashboard update in real-time with total attendees for precise catering planning.",
      icon: CheckCircle,
      color: "from-blue-500 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frictionless 4-Step Process</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
            How ShaadiConnect Works
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            Say goodbye to coordinating paper card printing, courier delays, and confusing WhatsApp chat RSVPs. Here is how simple modern wedding invites can be.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-serif font-bold text-stone-300">
                      {st.num}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center shadow-xs`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">
                    {st.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guest Experience Callout */}
        <div className="bg-gradient-to-r from-stone-900 to-rose-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 font-sans">
          <div className="space-y-4 max-w-lg">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
              The Guest Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Zero Friction for Your Guests
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Older relatives and busy friends don&apos;t want to download another app or remember another password. With ShaadiConnect, an invite link opens smoothly in any phone browser, shows full ceremony timings with 1-click Google Maps, and accepts their RSVP instantly.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/w/aarav-diya"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition"
              >
                <span>Try Sample Guest Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-sm w-full space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              What Guests Can Do:
            </h4>
            <ul className="space-y-2 text-xs text-stone-200">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Haldi, Mehendi & Vivah timings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Navigate to venue via Google Maps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Submit headcount & warm blessings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add wedding to phone calendar</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-6 font-sans">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Experience the Future of Indian Wedding Planning
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-xs"
            >
              Create Free Workspace
            </Link>
            <Link
              href="/templates"
              className="px-6 py-3 bg-white border border-stone-300 text-stone-800 font-semibold rounded-xl text-xs hover:bg-stone-100"
            >
              Browse Template Catalog
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
