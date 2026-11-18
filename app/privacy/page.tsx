// [LEGAL REVIEW NEEDED - Standard Indian SaaS & Privacy Policy Compliance]
"use client";

import { useEffect, useState } from "react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { BRAND } from "@/lib/brand";

interface SiteSettings {
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export default function PrivacyPage() {
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1 py-14 px-6 sm:px-8 max-w-4xl mx-auto">
        <div className="mb-10 text-center sm:text-left border-b border-stone-200 pb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-800">
            Niji Data Ki Suraksha
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-2 mb-3">
            Privacy Policy (Gopniyata Niti)
          </h1>
          <p className="text-xs text-stone-500">
            Last updated: November 2026 | {brandName} Data Protection Statement
          </p>
        </div>

        <div className="space-y-8 text-sm text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">1. Hamara Vachan: Zero Ads, Zero Data Selling</h2>
            <p>
              <strong>{brandName}</strong> par hum samajhte hain ki shaadi aur parivarik utsav me shamil mehmaano ke naam, phone number aur personal photos behad niji hote hain. Hum spasht vachan dete hain: <strong>Hum aapke ya aapke mehmaano ke data ko kisi bhi third-party ad networks ya telemarketers ko na to bechte hain aur na share karte hain.</strong>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">2. Hum Kaunsa Data Collect Karte Hain?</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Aapki Account Jankari:</strong> Naam, phone number, email address (login verification aur invoice ke liye).
              </li>
              <li>
                <strong>Invitation Data:</strong> Dulha-Dulhan ka naam, parivar ke sadasya, event dates, mahurat, venue address aur photos.
              </li>
              <li>
                <strong>Guest / RSVP Data (Yadi upyog kiya gaya ho):</strong> Mehmaano ke dwara RSVP form me bhari gayi attendance ki jankari taaki host food catering plan kar sake.
              </li>
              <li>
                <strong>Technical Logs:</strong> IP address, browser type aur access logs taaki platform surakshit aur spam-free rahe.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">3. Data Ka Upyog Kisliye Hota Hai?</h2>
            <p>
              Aapke data ka upyog kewal aapka personalized invitation website, PDF ya video render karne, WhatsApp sharing link enable karne, aur customer service pradan karne ke liye kiya jata hai.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">4. Card Privacy Controls & Search Engine Indexing</h2>
            <p>
              Aapke personal invitation cards (`/w/[slug]`) par search engine crawlers (Google, Bing) ke liye <code>noindex, nofollow</code> tags set kiye jate hain taaki aapke parivar ke niji photos aur address public web search results me bina permission index na hon.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">5. Payment Security</h2>
            <p>
              Hum kabhi bhi aapke credit/debit card details, CVV ya net banking credentials apne servers par store nahi karte. Sabhi payments RBI-regulated aur PCI-DSS compliant secure payment gateways dwara process hoti hain.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">6. Aapka Adhikar (Your Rights & Data Deletion)</h2>
            <p>
              Event samapt hone ke baad yadi aap chahein to apne invitation card ya uploaded photos ko permanent delete karne ke liye dashboard se request kar sakte hain ya hamein email likh sakte hain.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">7. Privacy Grievance Officer</h2>
            <p>
              Kisi bhi gopniyata ya data protection sawal ke liye aap hamari security team se sampark kar sakte hain:{" "}
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

