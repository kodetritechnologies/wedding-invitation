"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [whatsappNumber, setWhatsappNumber] = useState<string>(BRAND.whatsapp);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/public/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings?.contact?.whatsapp) {
            setWhatsappNumber(data.settings.contact.whatsapp);
          }
        }
      } catch {
        // Fallback to BRAND.whatsapp
      }
    }
    fetchSettings();
  }, []);

  // Do not show on admin panel, user dashboard, or live wedding card previews
  if (
    !pathname ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/w/")
  ) {
    return null;
  }

  // Format phone number to international digits only
  const cleanDigits = (whatsappNumber || BRAND.whatsapp).replace(/[^0-9]/g, "");
  const formattedNumber =
    cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

  const defaultMessage = encodeURIComponent(
    "Namaste! I would like to know more about digital wedding invitations."
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group select-none">
      {/* Tooltip / Prompt Label (desktop only on hover) */}
      <div className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-1.5 rounded-full bg-stone-900/95 text-amber-50 text-xs font-medium shadow-xl backdrop-blur-md border border-stone-800 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap -translate-x-2 group-hover:translate-x-0">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>Chat on WhatsApp</span>
      </div>

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${formattedNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with our team on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/90"
      >
        {/* Soft pulse animation wave */}
        <span
          className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none group-hover:opacity-0"
          aria-hidden="true"
        />

        {/* WhatsApp Icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/whatsapp.png"
          alt="WhatsApp"
          className="w-7 h-7 object-contain drop-shadow-sm pointer-events-none"
        />

        {/* Online Status Green Badge */}
        <span
          className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"
          title="Online"
        />
      </a>
    </div>
  );
}
