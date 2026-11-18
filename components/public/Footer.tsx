"use client";

import Link from "next/link";
import { Heart, MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface FooterSettings {
  siteName: string;
  logoUrl?: string;
  address: {
    formattedAddress: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    workingHours: string;
  };
  footer: {
    copyrightText: string;
    tagline: string;
  };
}

export default function PublicFooter() {
  const [settings, setSettings] = useState<FooterSettings>({
    siteName: "VivahVaani",
    logoUrl: "/logo.png",
    address: {
      formattedAddress: "Vijay Nagar, Indore, Madhya Pradesh • 452010",
    },
    contact: {
      email: "namaste@vivahvaani.com",
      phone: "+91 98260 12345",
      whatsapp: "919826012345",
      workingHours: "10 AM - 7 PM",
    },
    footer: {
      copyrightText: "© 2026 VivahVaani. All rights reserved.",
      tagline: "हर शादी की शुरुआत, एक खूबसूरत निमंत्रण",
    },
  });

  useEffect(() => {
    async function fetchFooterSettings() {
      try {
        const res = await fetch("/api/public/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setSettings({
              siteName: data.settings.siteName || "ShaadiConnect",
              logoUrl: data.settings.logoUrl || "",
              address: {
                formattedAddress:
                  data.settings.address?.formattedAddress ||
                  "Vijay Nagar, Indore, Madhya Pradesh • 452010",
              },
              contact: {
                email: data.settings.contact?.email || "namaste@shaadiconnect.com",
                phone: data.settings.contact?.phone || "+91 98260 12345",
                whatsapp: data.settings.contact?.whatsapp || "919826012345",
                workingHours: data.settings.contact?.workingHours || "10 AM - 7 PM",
              },
              footer: {
                copyrightText:
                  data.settings.footer?.copyrightText ||
                  "© 2026 ShaadiConnect. Crafted with shradha & modern technology in Indore, Madhya Pradesh.",
                tagline:
                  data.settings.footer?.tagline ||
                  "“Kalyanam, Mangalyam, Shubham.” Reimagining Indian wedding invitations into timeless, interactive digital patrika experiences.",
              },
            });
          }
        }
      } catch {
        // Fallback to initial values
      }
    }

    fetchFooterSettings();
  }, []);

  return (
    <footer className="bg-stone-950 text-stone-400 font-sans text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Col */}
        <div className="space-y-3">
          <Link href="/" className="inline-block group">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo-dark.png"
                alt={settings.siteName}
                className="h-16 sm:h-18 w-auto max-w-[250px] object-contain drop-shadow-[0_2px_12px_rgba(245,158,11,0.25)] group-hover:brightness-110 transition"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-950 text-amber-300 flex items-center justify-center border border-amber-500/30">
                  <Heart className="w-4 h-4 fill-amber-300 text-amber-300" />
                </div>
                <span className="font-bold text-white tracking-tight text-lg font-serif">
                  {settings.siteName}
                </span>
              </div>
            )}
          </Link>
          <p className="text-stone-400 leading-relaxed text-xs">
            {settings.footer.tagline}
          </p>
          <div className="flex items-start gap-2 text-stone-400 text-xs pt-1">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{settings.address.formattedAddress}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 md:pl-8">
          <h4 className="font-semibold text-white uppercase text-xs tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <Link href="/templates" className="hover:text-amber-400 transition">
                Wedding Templates
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-amber-400 transition">
                Pricing &amp; Plans
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-amber-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-amber-400 transition">
                Contact &amp; Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white uppercase text-xs tracking-wider">
            Contact
          </h4>
          <ul className="space-y-2.5 text-stone-400">
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <a href={`mailto:${settings.contact.email}`} className="hover:text-white transition">
                {settings.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {settings.contact.phone} {settings.contact.workingHours ? `(${settings.contact.workingHours})` : ""}
              </span>
            </li>
            <li className="pt-1">
              <a
                href={`https://wa.me/${settings.contact.whatsapp}?text=Hello%20${encodeURIComponent(
                  settings.siteName
                )},%20I%20want%20to%20know%20more%20about%20digital%20wedding%20invitations`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                <span>Chat on WhatsApp</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800/80 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-xs">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{settings.footer.copyrightText || "© 2026 VivahVaani. All rights reserved."}</span>
            <span className="hidden sm:inline text-stone-700">&bull;</span>
            <span>
              Developed by{" "}
              <a
                href="https://www.kodetri.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition"
              >
                Kodetri Technologies
              </a>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-stone-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-300 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
