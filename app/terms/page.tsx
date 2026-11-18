// [LEGAL REVIEW NEEDED - Standard Indian Digital SaaS & Invitation Platform Terms]
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { BRAND } from "@/lib/brand";

interface SiteSettings {
  businessName?: string;
  contactEmail?: string;
  contactAddress?: string;
}

export default function TermsPage() {
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
  const contactAddress = settings?.contactAddress || BRAND.address;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1 py-14 px-6 sm:px-8 max-w-4xl mx-auto">
        <div className="mb-10 text-center sm:text-left border-b border-stone-200 pb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-800">
            Kanooni Niyam & Shartein
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-2 mb-3">
            Terms of Service (Niyam Aur Shartein)
          </h1>
          <p className="text-xs text-stone-500">
            Last updated: November 2026 | Effective for all users of {brandName}
          </p>
        </div>

        <div className="space-y-8 text-sm text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">1. Prastavna (Introduction)</h2>
            <p>
              Welcome to <strong>{brandName}</strong>. Yeh Terms of Service niyamit karte hain aapka hamari website, digital invitation creation tools, video rendering, PDF generation, aur anya sambaddh services ka upyog. Hamari services ka upyog karke, aap in sabhi sharton se bandhne ke liye sahmat hote hain.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">2. Account Registration Aur Suraksha</h2>
            <p>
              Digital invitation tayyar karne aur manage karne ke liye aapko account create karne ki aavashyakta ho sakti hai. Aap apne account credentials (jaise password, OTP) ko confidential rakhne ke liye poori tarah utardayi hain. Yadi aapko kisi anadhikrit access ki aashanka ho, to turant hamari support team ko suchit karein.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">3. User Content & Intellectual Property Rights</h2>
            <p>
              Aap apne event invitations me upload kiye gaye photos, text, Sanskrit shlok, parivar ke naam aur content ke poore malik bane rahenge. Aap {brandName} ko kewal aapka invitation render karne, generate karne aur host karne ke liye avashyak technical access pradan karte hain.
            </p>
            <p>
              Aap kisi bhi copyrighted, anaitik ya kanoon-virodhi samagri ko upload na karne ke liye prathmik roop se utardayi hain.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">4. Service Availability & Hosting Duration</h2>
            <p>
              Website invitations ko standard roop se event date ke uprant nirdharit samay (aamtaur par 6 mahine se 1 saal) tak host kiya jata hai. {brandName} 99.9% uptime pradan karne ka har sambhav prayas karta hai, kintu schedule ki gayi maintenance ya third-party cloud infrastructure down hone par asuvidha ke liye limited liability rakhta hai.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">5. Shulk Aur Bhugtan (Payments & Pricing)</h2>
            <p>
              Sabhi digital invitations ke dam Indian Rupees (INR) me darshaye gaye hain. Taxes (yadi lagu ho) checkout par spasht roop se dikhaye jayenge. Payment gateway transactions secure third-party payment providers dwara process kiye jate hain.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">6. Refund Policy Reference</h2>
            <p>
              Aap hamari{" "}
              <Link href="/refund-policy" className="text-rose-700 underline font-medium">
                Refund & Cancellation Policy
              </Link>{" "}
              ko dekh sakte hain jisme spasht roop se vivaran diya gaya hai ki digital customized products par refund kab aur kaise lagu hota hai.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">7. Kanooni Nyayakshetra (Jurisdiction)</h2>
            <p>
              In sabhi sharton ka arth aur nivaaran Bhartiya Kanoon (Indian Laws) ke tehat hoga, aur kisi bhi vivad ki sthiti me nyayakshetra company ke registered address ke tahat sthit courts me hoga ({contactAddress}).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">8. Sampark</h2>
            <p>
              Kanooni sawalon ya Terms ke vishay me sahayata ke liye sampark karein:{" "}
              <a href={`mailto:${contactEmail}`} className="text-rose-700 underline font-medium">
                {contactEmail}
              </a>
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

