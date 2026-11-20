"use client";

import { useState, useEffect } from "react";
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
  MessageCircle,
  HelpCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { BRAND } from "@/lib/brand";

interface SiteSettings {
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  contactWhatsapp?: string;
  workingHours?: string;
  businessName?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("couple");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

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
  const contactPhone = settings?.contactPhone || BRAND.whatsappDisplay;
  const contactEmail = settings?.contactEmail || BRAND.email;
  const contactAddress = settings?.contactAddress || BRAND.address;
  const contactWhatsapp = settings?.contactWhatsapp || BRAND.whatsapp;
  const workingHours = settings?.workingHours || BRAND.workingHours;

  const validate = (): boolean => {
    const errs: FormErrors = {};

    // Name validation
    if (!name.trim()) {
      errs.name = "Kripya apna naam darj karein";
    } else if (name.trim().length < 2) {
      errs.name = "Naam kam se kam 2 aksharon ka hona chahiye";
    }

    // Phone validation
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!phone.trim()) {
      errs.phone = "Kripya apna mobile / WhatsApp number darj karein";
    } else if (!/^\+?[0-9]{10,14}$/.test(cleanPhone)) {
      errs.phone = "Kripya 10 ankon ka valid mobile number darj karein";
    }

    // Email validation (optional field, but if entered, must be valid email format)
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Kripya valid email address darj karein (jaise: amit@example.com)";
    }

    // Message validation
    if (!message.trim()) {
      errs.message = "Kripya apna sandesh ya sawal darj karein";
    } else if (message.trim().length < 5) {
      errs.message = "Sandesh kam se kam 5 aksharon ka hona chahiye";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          role,
          eventDate: eventDate.trim(),
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setErrors({});
      } else {
        setErrorMsg(data.error || "Unable to send message. Please try again or message via WhatsApp.");
      }
    } catch {
      setErrorMsg("Network error occurred. Please reach out to us via WhatsApp directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden pt-12 pb-14 px-6 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.75px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Hum Aapki Sahayata Ke Liye Hain
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-4">
              Sampark Karein & Sahayata Payein
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Kavya card design chunne me sahayata chahiye, custom Sanskrit shlok jodhna hai ya koi takneeki prashn hai?
              Hamari team WhatsApp, phone aur email par sahayata ke liye uplabdh hai.
            </p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-14 px-6 sm:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT CONTACT INFO CARDS */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Direct Sampark Madhyam</h2>
                <p className="text-sm text-stone-600">
                  Aamtaur par WhatsApp par turant ya 15-30 minute ke bheetar uttar mil jata hai.
                </p>
              </div>

              {/* WhatsApp Card */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Sabse Tez Jawab</span>
                    <h3 className="text-lg font-bold text-emerald-950 mt-0.5">WhatsApp Sahayata</h3>
                    <p className="text-xs text-emerald-800 mt-1 mb-3">
                      Design customize karne ya custom quote ke liye direct message karein.
                    </p>
                    <a
                      href={`https://wa.me/${contactWhatsapp.replace(/\D/g, "")}?text=Namaste%20${encodeURIComponent(brandName)},%20mujhe%20invitation%20card%20ke%20bare%20me%20jankari%20chahiye.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp ({contactWhatsapp})
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone, Email, Office Details */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">Direct Call</div>
                    <a href={`tel:${contactPhone}`} className="text-sm font-semibold text-stone-900 hover:text-rose-700 transition-colors">
                      {contactPhone}
                    </a>
                    <p className="text-xs text-stone-500 mt-0.5">Mon - Sat (10:00 AM - 7:00 PM IST)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-stone-100">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">Email Inquiry</div>
                    <a href={`mailto:${contactEmail}`} className="text-sm font-semibold text-stone-900 hover:text-rose-700 transition-colors">
                      {contactEmail}
                    </a>
                    <p className="text-xs text-stone-500 mt-0.5">24 ghanton me email reply</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-stone-100">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">Karyalay Samay</div>
                    <div className="text-sm font-medium text-stone-900">{workingHours}</div>
                    <p className="text-xs text-stone-500 mt-0.5">Sunday: WhatsApp emergency assistance only</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-stone-100">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">Registered Karyalay</div>
                    <p className="text-xs text-stone-700 leading-relaxed mt-0.5">{contactAddress}</p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Link */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-amber-800" />
                  <div>
                    <p className="text-xs font-bold text-amber-950">Aam Sawal (FAQs)?</p>
                    <p className="text-xs text-amber-800">Card share karne aur pricing se jude sawal</p>
                  </div>
                </div>
                <Link href="/#faq" className="text-xs font-semibold text-rose-700 hover:underline inline-flex items-center gap-1">
                  Check FAQs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm relative">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">Sandesh Prapt Hua!</h3>
                    <p className="text-stone-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                      Dhanyawad. Aapka sandesh surakshit tarike se save kar liya gaya hai. Hamari team aapse jald hi sampark karegi.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setName("");
                        setPhone("");
                        setEmail("");
                        setMessage("");
                        setErrors({});
                      }}
                      className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                    >
                      Naya Sandesh Bhejein
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                      <h2 className="text-xl font-bold text-stone-900">Hamein Sandesh Bhejein</h2>
                      <p className="text-xs text-stone-500 mt-1">
                        Form bharein aur hamari wedding coordination team aapse direct sampark karegi.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Honeypot field (hidden from real users) */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="hp_field"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5">
                          Aapka Naam <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          placeholder="Jaise: Amit Sharma"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                            errors.name
                              ? "border-rose-500 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-600"
                              : "border-stone-300 focus:ring-rose-500/20 focus:border-rose-600"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5">
                          Phone / WhatsApp Number <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                          }}
                          placeholder="+91 98765 43210"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                            errors.phone
                              ? "border-rose-500 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-600"
                              : "border-stone-300 focus:ring-rose-500/20 focus:border-rose-600"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                          }}
                          placeholder="amit@example.com (Optional)"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                            errors.email
                              ? "border-rose-500 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-600"
                              : "border-stone-300 focus:ring-rose-500/20 focus:border-rose-600"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5">Aapka Role</label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 bg-white transition"
                        >
                          <option value="couple">Dulha / Dulhan (Bride or Groom)</option>
                          <option value="family">Parivar ke Sadasya (Parents/Family)</option>
                          <option value="planner">Wedding Planner / Event Manager</option>
                          <option value="vendor">Card Printer / Photographer</option>
                          <option value="other">Anya (Other)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Karyakram Ki Sambhavit Taarikh (Event Date)
                      </label>
                      <input
                        type="text"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        placeholder="Jaise: 24 December 2026 ya Shubh Muhurat"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Aapka Sandesh ya Sawal <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                        }}
                        placeholder="Aapko kaisa card design chahiye, Sanskrit shlok jodhna hai ya koi specific requirements hain..."
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                          errors.message
                            ? "border-rose-500 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-600"
                            : "border-stone-300 focus:ring-rose-500/20 focus:border-rose-600"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-sm transition-all shadow-md shadow-rose-900/10 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sandesh Bheja Ja Raha Hai...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Sandesh Bhejein
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-stone-400 text-center">
                      Aapka data 100% surakshit hai. Hum kabhi bhi spam nahi karte.
                    </p>
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
