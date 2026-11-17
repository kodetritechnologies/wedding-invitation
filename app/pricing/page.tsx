"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Heart,
  Building,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function PricingPage() {
  const [billingType, setBillingType] = useState<"onetime" | "subscription">("onetime");

  const faqs = [
    {
      q: "How long does a digital wedding invitation remain live online?",
      a: "Depending on your package, your invitation remains live from 3 months (Basic) up to 2 full years (Royal). It remains active for all post-wedding viewing even after the wedding concludes.",
    },
    {
      q: "Do guests need an account or app to view the invitation or submit RSVP?",
      a: "No! Guests never have to download an app or register an account. They click your shared WhatsApp link, view your invitation immediately, and submit their attendance headcount with zero friction.",
    },
    {
      q: "Can I update event timings or venue details after sharing the link?",
      a: "Yes! Any changes you make in your Admin dashboard update immediately in real-time on the live invitation URL.",
    },
    {
      q: "If a wedding business cancels its monthly subscription, will existing invitations go offline?",
      a: "Never. As per our core architectural rules, one-time wedding packages and subscriptions are strictly separated. Any wedding purchased under a package remains live for its full promised hosting validity.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent & Affordable Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
            Simple Plans for Families & Studios
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            Choose a one-time wedding package for individual celebrations, or subscribe to a recurring plan if you manage multiple clients.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 bg-stone-200/80 rounded-2xl pt-1 font-sans">
            <button
              onClick={() => setBillingType("onetime")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                billingType === "onetime"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>For Couples & Families (One-Time)</span>
            </button>

            <button
              onClick={() => setBillingType("subscription")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                billingType === "subscription"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>For Wedding Agencies (Subscriptions)</span>
            </button>
          </div>
        </div>

        {/* ONE-TIME WEDDING PACKAGES */}
        {billingType === "onetime" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            {/* Basic */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                  Basic Package
                </span>
                <div>
                  <span className="text-4xl font-serif font-bold text-stone-900">₹299</span>
                  <span className="text-xs text-stone-500 font-normal ml-1">one-time</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Ideal for intimate weddings or single ceremonies needing a clean digital invite.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-700 pt-2 border-t border-stone-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic invitation templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 2 event ceremonies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Google Maps location link</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>WhatsApp sharing link</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>3 months active hosting</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-center text-xs transition"
              >
                Get Started with Basic
              </Link>
            </div>

            {/* Premium (Highlighted) */}
            <div className="bg-gradient-to-b from-rose-900 to-rose-950 text-white rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between relative border-2 border-rose-500/40">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-rose-950 text-[10px] font-bold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-sm">
                Most Popular for Indian Weddings
              </div>

              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                  Premium Package
                </span>
                <div>
                  <span className="text-4xl font-serif font-bold text-amber-100">₹799</span>
                  <span className="text-xs text-rose-200 font-normal ml-1">one-time</span>
                </div>
                <p className="text-xs text-rose-200 leading-relaxed">
                  Complete multi-day celebration suite with live RSVP and headcount tracking.
                </p>

                <ul className="space-y-2.5 text-xs text-rose-100 pt-2 border-t border-rose-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>All Premium & Floral templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Up to 6 events (Haldi, Mehendi, Sangeet, etc.)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Live RSVP with attendee headcount tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Personalized guest invite codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>1 Full Year active hosting</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold rounded-xl text-center text-xs transition shadow-md"
              >
                Choose Premium (₹799)
              </Link>
            </div>

            {/* Royal */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                  Royal Package
                </span>
                <div>
                  <span className="text-4xl font-serif font-bold text-stone-900">₹1,999</span>
                  <span className="text-xs text-stone-500 font-normal ml-1">one-time</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The ultimate luxury invitation suite with bespoke typography and extended hosting.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-700 pt-2 border-t border-stone-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Exclusive Royal & Palace designs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited wedding events & functions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full RSVP tracking with dietary & notes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Couple story & contact directory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2 Years active hosting & priority support</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-center text-xs transition"
              >
                Choose Royal Package
              </Link>
            </div>
          </div>
        )}

        {/* BUSINESS SUBSCRIPTION PLANS */}
        {billingType === "subscription" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            {/* Starter */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                  Starter Agency
                </span>
                <div>
                  <span className="text-4xl font-serif font-bold text-stone-900">₹499</span>
                  <span className="text-xs text-stone-500 font-normal ml-1">/ month</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  For freelance designers and independent photographers taking on occasional weddings.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-700 pt-2 border-t border-stone-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 3 active client weddings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Client management directory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic + Premium templates</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-center text-xs transition"
              >
                Subscribe Starter
              </Link>
            </div>

            {/* Professional */}
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between relative border border-stone-700">
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">
                  Professional Agency
                </span>
                <div>
                  <span className="text-4xl font-serif font-bold text-white">₹999</span>
                  <span className="text-xs text-stone-400 font-normal ml-1">/ month</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  For active wedding planners, studios, and invitation shops in Indore and MP.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-200 pt-2 border-t border-stone-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Up to 10 active client weddings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Client directory & archive tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Full Royal template catalog access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Headcount & exportable RSVP analytics</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-center text-xs transition"
              >
                Subscribe Professional
              </Link>
            </div>

            {/* Agency */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                  Full Agency Suite
                </span>
                <div>
                  <span className="text-4xl font-serif font-bold text-stone-900">₹2,499</span>
                  <span className="text-xs text-stone-500 font-normal ml-1">/ month</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  For high-volume wedding production houses and event management firms.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-700 pt-2 border-t border-stone-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 30 active client weddings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom domain / slug priority</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated account manager in Indore</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-center text-xs transition"
              >
                Subscribe Agency
              </Link>
            </div>
          </div>
        )}

        {/* FAQs Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 space-y-6 font-sans">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-stone-500">
              Everything you need to know about plans and digital invitation delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-1.5 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <h3 className="font-bold text-sm text-stone-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
