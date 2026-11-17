"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  Loader2,
  Building,
  MessageCircle,
  Calendar,
  Heart,
  HelpCircle,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("couple");
  const [weddingDate, setWeddingDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

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
              <span>Indore Wedding Concierge &bull; 7 Days Open</span>
              <span>✦</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Hamari Team Se Seedhi Baat Karein,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700 block mt-1">
                Kharche Aur Design Ki Har Jaankari Paayein.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto font-sans">
              Chahe aap apni parivarik shaadi plan kar rahe hon ya wedding planner hon — hamare Indore design studio se direct phone ya WhatsApp par sampark karein.
            </p>
          </div>
        </section>

        {/* CONTACT MAIN SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Direct Helpline & Office Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* WhatsApp Quick Card */}
              <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-emerald-50 rounded-3xl p-7 sm:p-8 shadow-xl border border-emerald-400/30 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <MessageCircle className="w-6 h-6 fill-emerald-300" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-cinzel tracking-widest text-emerald-300 font-bold block">
                    Fastest Response &bull; 10 Mins
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Direct WhatsApp Helpdesk
                  </h3>
                  <p className="text-xs text-emerald-200/80 leading-relaxed font-sans">
                    Physical card ki photo bhejne ya urgent Tatkal invite ke liye hamare WhatsApp helpline par message karein.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/919826012345?text=Namaste!%20Mujhe%20ShaadiConnect%20digital%20invitation%20ke%20baare%20me%20jaankari%20chahiye"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <MessageCircle className="w-4 h-4 fill-stone-950" />
                    <span>WhatsApp Par Baat Shuru Karein</span>
                  </a>
                </div>
              </div>

              {/* Physical Office Details */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/90 shadow-xs space-y-5">
                <h4 className="text-lg font-serif font-bold text-stone-900 border-b border-stone-100 pb-3">
                  Studio &amp; Office Coordinates
                </h4>

                <div className="space-y-4 text-xs font-sans text-stone-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 font-semibold">Indore Office Address</strong>
                      <span>Vijay Nagar Commercial Zone, AB Road, Indore, Madhya Pradesh &bull; 452010</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 font-semibold">Direct Phone Helpline</strong>
                      <span>+91 98260 12345 / +91 731 4000000</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 font-semibold">Official Support Email</strong>
                      <span>support@shaadiconnect.in</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 font-semibold">Working Hours</strong>
                      <span>10:00 AM – 9:00 PM (Monday to Sunday &bull; Wedding Season Open)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-cinzel font-bold text-rose-800 uppercase tracking-widest block mb-1">
                    ✦ Send Us A Message ✦
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900">
                    ShaadiConnect Design Desk Ko Sandesh Bhejein
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Aapki inquiry aane ke 30 minute ke andar hamara wedding consultant aapse sampark karega.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-lg font-serif font-bold text-emerald-950">
                      Dhanyawad {name}! Aapka Sandesh Mil Gaya Hai.
                    </h4>
                    <p className="text-xs text-emerald-800 max-w-md mx-auto">
                      Hamari Indore team aapke WhatsApp number <strong>{phone}</strong> par agle 30 minute me sampark karegi.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                    >
                      Naya Sandesh Bhejein
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                    {/* Role Picker */}
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Aap Kaun Hain?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "couple", label: "Dulha / Dulhan" },
                          { id: "family", label: "Parivar / Parents" },
                          { id: "planner", label: "Wedding Planner" },
                        ].map((r) => (
                          <button
                            type="button"
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={`py-2 px-3 rounded-xl border text-center font-semibold cursor-pointer transition ${
                              role === r.id
                                ? "bg-rose-50 border-rose-500 text-rose-900 shadow-2xs font-bold"
                                : "border-stone-200 text-stone-600 hover:bg-stone-50"
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Aapka Shubh Naam *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rajesh Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          WhatsApp / Mobile No. *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98260 00000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Shahar (City)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Indore, Bhopal, Jaipur..."
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Anumanit Wedding Date
                        </label>
                        <input
                          type="date"
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Aapka Sandesh / Requirements
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Batayein aapko custom design chahiye, printed card ka replica banvana hai, ya wedding planning ke liye multi-client access chahiye..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 text-stone-800"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sandesh Bheja Ja Raha Hai...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Inquiry Submit Karein</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
