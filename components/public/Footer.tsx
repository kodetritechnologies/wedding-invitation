"use client";

import Link from "next/link";
import { MessageCircle, Mail, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

interface FooterSettings {
  siteName: string;
  logoUrl?: string;
  address?: {
    formattedAddress?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    workingHours?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  footer?: {
    copyrightText?: string;
    tagline?: string;
  };
}

export default function PublicFooter() {
  const [settings, setSettings] = useState<FooterSettings>({
    siteName: BRAND.name,
    logoUrl: "",
    address: {
      formattedAddress: BRAND.address,
    },
    contact: {
      email: BRAND.email,
      whatsapp: BRAND.whatsapp,
      workingHours: BRAND.workingHours,
    },
    footer: {
      copyrightText: `© 2026 ${BRAND.name}. Crafted with love and modern technology in Indore, Madhya Pradesh.`,
      tagline: BRAND.tagline,
    },
  });

  useEffect(() => {
    async function fetchFooterSettings() {
      try {
        const res = await fetch("/api/public/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            const currentYear = new Date().getFullYear();
            setSettings({
              siteName: data.settings.siteName || BRAND.name,
              logoUrl: data.settings.logoUrl || "",
              address: {
                formattedAddress:
                  data.settings.address?.formattedAddress || BRAND.address,
              },
              contact: {
                email: data.settings.contact?.email || BRAND.email,
                phone: data.settings.contact?.phone || "",
                whatsapp: data.settings.contact?.whatsapp || BRAND.whatsapp,
                workingHours: data.settings.contact?.workingHours || BRAND.workingHours,
              },
              socialLinks: data.settings.socialLinks || {},
              footer: {
                copyrightText:
                  data.settings.footer?.copyrightText?.replace(/ShaadiConnect|VivahVaani/g, data.settings.siteName || BRAND.name) ||
                  `© ${currentYear} ${data.settings.siteName || BRAND.name}. Crafted with love and modern technology in Indore, Madhya Pradesh.`,
                tagline: data.settings.footer?.tagline || BRAND.tagline,
              },
            });
          }
        }
      } catch {
        // Fallback to default state
      }
    }

    fetchFooterSettings();
  }, []);

  const whatsappNumber = settings.contact?.whatsapp || "919826012345";
  const emailAddress = settings.contact?.email || "namaste@shaadiconnect.com";
  const workingHours = settings.contact?.workingHours || "Mon - Sun: 10:00 AM - 7:00 PM IST";
  const formattedAddress = settings.address?.formattedAddress || "Vijay Nagar, Indore, Madhya Pradesh - 452010";

  return (
    <footer
      className="relative text-[#FDFBF7] font-['Poppins',sans-serif] overflow-hidden"
      style={{
        backgroundColor: "#720E16",
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%, #8A2630 0%, transparent 60%),
          radial-gradient(circle at 100% 100%, #50080E 0%, transparent 50%),
          radial-gradient(circle at 0% 100%, #50080E 0%, transparent 50%)
        `,
      }}
    >
      {/* Subtle traditional damask / floral texture overlay (5-7% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] bg-repeat mix-blend-overlay"
        style={{
          backgroundImage: "url('/assets/steps/bg-textured.png')",
          backgroundSize: "320px 320px",
        }}
        aria-hidden="true"
      />

      {/* Decorative top gold hairline with subtle central accent */}
      <div className="relative w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#D6A64B] to-transparent opacity-80" />

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP CONTACT BAR */}
        <div className="py-5 border-b border-[#D6A64B]/25 flex flex-wrap items-center justify-between gap-4 text-sm tracking-wide">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Namaste!%20I%20would%20like%20to%20know%20more%20about%20ShaadiConnect%20digital%20invitations.`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="group flex items-center gap-3 text-[#FDFBF7]/90 hover:text-[#D6A64B] transition duration-200"
            >
              <span className="p-2 rounded-full border border-[#D6A64B]/40 group-hover:border-[#D6A64B] group-hover:bg-[#D6A64B]/10 transition">
                <MessageCircle className="w-4 h-4 text-[#D6A64B]" />
              </span>
              <span>
                <strong className="text-[#D6A64B] font-medium mr-1.5">WhatsApp:</strong>
                +{whatsappNumber.startsWith("91") ? whatsappNumber : `91 ${whatsappNumber}`}
              </span>
            </a>

            <a
              href={`mailto:${emailAddress}`}
              aria-label="Send us an email"
              className="group flex items-center gap-3 text-[#FDFBF7]/90 hover:text-[#D6A64B] transition duration-200"
            >
              <span className="p-2 rounded-full border border-[#D6A64B]/40 group-hover:border-[#D6A64B] group-hover:bg-[#D6A64B]/10 transition">
                <Mail className="w-4 h-4 text-[#D6A64B]" />
              </span>
              <span>
                <strong className="text-[#D6A64B] font-medium mr-1.5">Email:</strong>
                {emailAddress}
              </span>
            </a>

            <div className="flex items-center gap-3 text-[#FDFBF7]/85">
              <span className="p-2 rounded-full border border-[#D6A64B]/40">
                <Clock className="w-4 h-4 text-[#D6A64B]" />
              </span>
              <span>
                <strong className="text-[#D6A64B] font-medium mr-1.5">Working Hours:</strong>
                {workingHours}
              </span>
            </div>
          </div>

          {/* Social Icons / Links (if available) */}
          {settings.socialLinks && (settings.socialLinks.instagram || settings.socialLinks.facebook || settings.socialLinks.youtube) && (
            <div className="flex items-center gap-4 text-sm text-[#FDFBF7]/75">
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-[#D6A64B] transition"
                >
                  Instagram
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-[#D6A64B] transition"
                >
                  YouTube
                </a>
              )}
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-[#D6A64B] transition"
                >
                  Facebook
                </a>
              )}
            </div>
          )}
        </div>

        {/* 4 COLUMNS CONTENT */}
        <div className="pt-14  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 relative z-10">
          {/* COLUMN 1 — BRAND */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group focus:outline-none">
              {settings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  className="h-12 w-auto max-w-[220px] object-contain"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D6A64B] via-[#E9BC5A] to-[#B07818] p-[1.5px] flex items-center justify-center shadow-md">
                    <span className="w-full h-full rounded-full bg-[#50080E] flex items-center justify-center text-[#D6A64B] font-bold text-lg">
                      🕉
                    </span>
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FDFBF7] font-['Cinzel',serif] group-hover:text-[#D6A64B] transition">
                    {settings.siteName}
                  </span>
                </div>
              )}
            </Link>

            <p className="text-sm sm:text-[15px] leading-relaxed text-[#FDFBF7]/90 pr-2">
              Digital invitations for every celebration. Made with love in India.
            </p>

            <div className="pt-2 text-sm text-[#FDFBF7]/80 flex items-start gap-2.5">
              <span className="text-[#D6A64B] text-base mt-0.5 font-bold">📍</span>
              <p className="leading-snug">{formattedAddress}</p>
            </div>
          </div>

          {/* COLUMN 2 — OCCASIONS */}
          <nav aria-label="Occasions" className="space-y-4">
            <h3 className="text-base font-semibold text-[#FDFBF7] tracking-wider uppercase flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D6A64B]" />
              Occasions
            </h3>
            <ul className="space-y-3 text-sm text-[#FDFBF7]/85">
              <li>
                <Link href="/wedding" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Wedding
                </Link>
              </li>
              <li>
                <Link href="/engagement" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Engagement
                </Link>
              </li>
              <li>
                <Link href="/anniversary" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Anniversary
                </Link>
              </li>
              <li>
                <Link href="/birthday" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Birthday
                </Link>
              </li>
              <li>
                <Link href="/housewarming" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  House Warming
                </Link>
              </li>
              <li>
                <Link href="/reception" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Reception
                </Link>
              </li>
            </ul>
          </nav>

          {/* COLUMN 3 — INVITATION TYPES */}
          <nav aria-label="Invitation Types" className="space-y-4">
            <h3 className="text-base font-semibold text-[#FDFBF7] tracking-wider uppercase flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D6A64B]" />
              Invitation Types
            </h3>
            <ul className="space-y-3 text-sm text-[#FDFBF7]/85">
              <li>
                <Link href="/wedding/video" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Video Invitation
                </Link>
              </li>
              <li>
                <Link href="/wedding/invitation-website" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Website Invitation (with RSVP)
                </Link>
              </li>
              <li>
                <Link href="/wedding/pdf" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  PDF Invitation
                </Link>
              </li>
            </ul>
          </nav>

          {/* COLUMN 4 — HELP & COMPANY */}
          <nav aria-label="Help & Company" className="space-y-4">
            <h3 className="text-base font-semibold text-[#FDFBF7] tracking-wider uppercase flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D6A64B]" />
              Help &amp; Company
            </h3>
            <ul className="space-y-3 text-sm text-[#FDFBF7]/85">
              <li>
                <Link href="/about" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/my-account" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[#D6A64B] hover:translate-x-1.5 inline-block transition-transform duration-150">
                  Sitemap
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* BOTTOM DECORATIVE PANORAMIC INDIAN HERITAGE PALACE ARCHITECTURE */}
      {/* Uses /assets/bg/footer-bg.png blending seamlessly into the maroon footer */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none -mb-1 flex justify-center items-end">
        {/* Soft gradient fade so the image top transitions smoothly */}
        <div
          className="w-full h-32 sm:h-44 md:h-56 lg:h-64 bg-repeat-x bg-bottom opacity-25"
          style={{
            backgroundImage: "url('/assets/bg/footer-bg.png')",
            backgroundSize: "contain",
          }}
          aria-label="Indian Heritage Palace Architecture"
          role="img"
        />
      </div>

      {/* COPYRIGHT BAR */}
      <div className="relative border-t border-[#D6A64B]/30 bg-[#50080E]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#FDFBF7]/80">
          <p className="text-center md:text-left">
            © 2026 {settings.siteName}. Crafted with love and modern technology in Indore, Madhya Pradesh.
          </p>
          <p className="text-center md:text-right text-[#FDFBF7]/90">
            <span className="text-[#D6A64B] font-medium">&ldquo;Kalyaanam, Mangalyam, Shubham.&rdquo;</span> Reimagining Indian wedding invitations into timeless, interactive digital patrika experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}
