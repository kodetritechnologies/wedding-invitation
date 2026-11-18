// [LEGAL REVIEW NEEDED - Standard Digital Product Cancellation & Refund Policy]
"use client";

import { useEffect, useState } from "react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { BRAND } from "@/lib/brand";

interface SiteSettings {
  businessName?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
}

export default function RefundPolicyPage() {
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
  const contactEmail = settings?.contactEmail || BRAND.email;
  const contactWhatsapp = settings?.contactWhatsapp || BRAND.whatsapp;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1 py-14 px-6 sm:px-8 max-w-4xl mx-auto">
        <div className="mb-10 text-center sm:text-left border-b border-stone-200 pb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-800">
            Pardarsheeta & Santushti Vachan
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-2 mb-3">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-stone-500">
            Last updated: November 2026 | Guidelines for {brandName} Customers
          </p>
        </div>

        <div className="space-y-8 text-sm text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">1. Digital Products Ka Swaroop (Digital Nature)</h2>
            <p>
              <strong>{brandName}</strong> digital invitation services (Website invitation cards, PDF patrika downloads, and customized video invitations) pradan karta hai. Kyunki yeh digital roop se customize hote hain aur turant deliver/render ho jate hain, ispar standard e-commerce physical return policy lagu nahi hoti.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">2. Refund Kab Sambhav Hai? (Eligible Scenarios)</h2>
            <p>Nimnalikhit sthitiyon me hum 100% full refund ya replacement pradan karte hain:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Double Payment / Duplicate Charge:</strong> Yadi server timeout ya payment gateway error ke karan aapke account se ek hi order ke liye do baar paise cut gaye hon.
              </li>
              <li>
                <strong>Technical Rendering Failure:</strong> Yadi payment ke baad hamari system ki kisi takneeki truti ke karan aapka card render ya access na ho sake aur hamari support team use 24 ghante me theek na kar sake.
              </li>
              <li>
                <strong>Design Mismatch:</strong> Custom design package order karne ke baad yadi team dwara finalize hone se pehle order cancel kiya jata hai.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">3. Non-Refundable Scenarios</h2>
            <p>Nimn sthitiyon me refund sambhav nahi hoga:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Card publish hone ke baad ya mehmaano ko link/PDF bhejne ke baad.</li>
              <li>User dwara daali gayi galat jankari (jaise dulha-dulhan ke naam ki spelling ya venue address me galti). Yadi koi typing mistake ho gayi ho, to aap humein WhatsApp par sampark kar sakte hain - hum bina kisi extra charge ke text sudhar dete hain.</li>
              <li>Event cancel hone ya sthagit (postponed) hone par. Aisi sthiti me hum date reschedule karne me poori madad karte hain.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">4. Free Corrections & Edits Policy</h2>
            <p>
              Hum chahte hain ki aapka card bilkul perfect ho! Yadi aapko date, time, venue address, ya Sanskrit shlok me koi bhi badlav karna ho, to aap hamari WhatsApp support par message karke card update karwa sakte hain.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">5. Refund Request Kaise Karein?</h2>
            <p>
              Kisi bhi legitimate refund request ke liye apne Payment ID aur Order Details ke sath WhatsApp{" "}
              <strong>{contactWhatsapp}</strong> par sandesh bhejein ya email karein:{" "}
              <a href={`mailto:${contactEmail}`} className="text-rose-700 underline font-medium">
                {contactEmail}
              </a>
              . Approved refunds 5 se 7 working days me aapke mool source payment method (UPI / Bank Account) me credit kar diye jate hain.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

