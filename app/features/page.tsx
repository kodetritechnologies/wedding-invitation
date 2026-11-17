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
  Sliders,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function FeaturesPage() {
  const comparisonRows = [
    {
      feature: "Cost per recipient",
      printed: "₹80 – ₹250 / card",
      pdf: "One-off graphic cost",
      shaadi: "Single fixed package (₹299–₹799)",
    },
    {
      feature: "Multi-event schedule details",
      printed: "Static / clutter inserts",
      pdf: "Zoomable static page",
      shaadi: "Structured itinerary cards with timings",
    },
    {
      feature: "Venue Google Maps navigation",
      printed: "Manual address typing",
      pdf: "Sometimes hyperlinked",
      shaadi: "1-Click direct Google Maps GPS",
    },
    {
      feature: "Live RSVP & Headcount capture",
      printed: "Manual phone calls",
      pdf: "WhatsApp chat confusion",
      shaadi: "Automated real-time headcount dashboard",
    },
    {
      feature: "Guest login requirement",
      printed: "None",
      pdf: "None",
      shaadi: "Accountless frictionless visitor flow",
    },
    {
      feature: "Multi-client business workspace",
      printed: "Spreadsheets / paper",
      pdf: "Folders on laptop",
      shaadi: "Unified client & project administration",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Comprehensive Platform Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
            Engineered for the Grandeur of Indian Weddings
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            ShaadiConnect is not a simple card graphic generator. It is a full-stack digital invitation & multi-client wedding management system.
          </p>
        </div>

        {/* 6 Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
          {/* 1. Multi-Event Timelines */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <CalendarHeart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Multi-Day Ceremony Itinerary
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Organize Haldi, Mehendi, Sangeet Night, Shubh Vivah, and Reception. Each function features start and end times, venue hall details, dress codes, and custom cultural shlokas.
            </p>
          </div>

          {/* 2. Direct WhatsApp Sharing */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Personalized WhatsApp Invite Links
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Generate unique invitation links for each guest family (`/w/[slug]?guest=CODE`). When they click, they see their family name honored on the invitation screen.
            </p>
          </div>

          {/* 3. Real-time RSVP */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Live RSVP Headcount Tracker
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Track exactly how many guests are attending. Eliminate the guesswork in catering plates and seating charts with real-time tallying of accepted, pending, and declined RSVPs.
            </p>
          </div>

          {/* 4. Google Maps GPS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              1-Click Venue Navigation
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Out-of-town guests no longer get lost. Every function features a verified Google Maps location button that opens turn-by-turn directions directly on the guest&apos;s phone.
            </p>
          </div>

          {/* 5. Multi-Client Agency Hub */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Multi-Client B2B Administration
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Built for invitation designers, event planners, and photographers in Indore and across India. Manage multiple clients, multiple weddings, and separate guest lists from one Admin dashboard.
            </p>
          </div>

          {/* 6. Privacy & Security */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Strict Tenant Data Privacy
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your guest list and phone numbers are strictly protected within your private tenant scope. Unlike social forums, other guests never see who else is invited.
            </p>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              How ShaadiConnect Compares
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Comparing traditional cards, static WhatsApp PDFs, and ShaadiConnect
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Feature Dimension</th>
                  <th className="py-3 px-4 text-stone-500">Printed Cards</th>
                  <th className="py-3 px-4 text-stone-500">Static PDF / Image</th>
                  <th className="py-3 px-4 text-rose-700 bg-rose-50/60 font-bold">
                    ShaadiConnect SaaS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{row.printed}</td>
                    <td className="py-3.5 px-4 text-stone-600">{row.pdf}</td>
                    <td className="py-3.5 px-4 font-semibold text-rose-800 bg-rose-50/40">
                      {row.shaadi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Start Delivering Modern Digital Invitations Today
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs text-xs"
            >
              Create Free Workspace
            </Link>
            <Link
              href="/templates"
              className="px-6 py-3 bg-white border border-stone-300 text-stone-800 font-semibold rounded-xl text-xs hover:bg-stone-100"
            >
              Explore Template Designs
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
