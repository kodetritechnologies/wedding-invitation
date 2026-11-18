"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, MessageCircle, User } from "lucide-react";
import { useState, useEffect } from "react";
import { BRAND } from "@/lib/brand";

interface HeaderSettings {
  siteName: string;
  logoUrl?: string;
  announcementBar?: {
    enabled: boolean;
    text: string;
  };
  contact?: {
    whatsapp?: string;
  };
}

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [weddingDropdownOpen, setWeddingDropdownOpen] = useState(false);
  const [mobileWeddingOpen, setMobileWeddingOpen] = useState(false);

  const [settings, setSettings] = useState<HeaderSettings>({
    siteName: BRAND.name,
    logoUrl: "",
    announcementBar: {
      enabled: true,
      text: "✦ Digital Invitations for Every Indian Celebration • Video, PDF & Website ✦",
    },
    contact: {
      whatsapp: BRAND.whatsapp,
    },
  });

  useEffect(() => {
    async function fetchHeaderSettings() {
      try {
        const res = await fetch("/api/public/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setSettings({
              siteName: data.settings.siteName || BRAND.name,
              logoUrl: data.settings.logoUrl || "",
              announcementBar: data.settings.announcementBar || {
                enabled: true,
                text: "✦ Digital Invitations for Every Indian Celebration • Video, PDF & Website ✦",
              },
              contact: {
                whatsapp: data.settings.contact?.whatsapp || BRAND.whatsapp,
              },
            });
          }
        }
      } catch {
        // Fallback to default state
      }
    }

    fetchHeaderSettings();
  }, []);

  const weddingSubLinks = [
    { href: "/wedding", label: "All Wedding Invitations" },
    { href: "/wedding/video", label: "Video Invitation" },
    { href: "/wedding/invitation-website", label: "Website Invitation (with RSVP)" },
    { href: "/wedding/pdf", label: "PDF Invitation" },
  ];

  const mainNavLinks = [
    { href: "/engagement", label: "Engagement" },
    { href: "/anniversary", label: "Anniversary" },
    { href: "/birthday", label: "Birthday" },
    { href: "/housewarming", label: "House Warming" },
    { href: "/reception", label: "Reception" },
  ];

  const whatsappNumber = settings.contact?.whatsapp || BRAND.whatsapp;
  const isWeddingActive = pathname.startsWith("/wedding");

  return (
    <>
      {/* Top Auspicious Gold Strip (Dynamic) */}
      {settings.announcementBar?.enabled && (
        <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-amber-50 text-[11px] sm:text-xs py-1 px-4 text-center font-sans flex items-center justify-center gap-2 shadow-inner font-medium">
          <span>{settings.announcementBar.text}</span>
        </div>
      )}

      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-50 transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          {/* Brand Logo / Text */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-amber-600 rounded-lg p-1"
            aria-label={`${settings.siteName} Home`}
          >
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logoUrl}
                alt={settings.siteName}
                className="h-10 sm:h-12 w-auto max-w-[190px] object-contain"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-[#5C0612] text-amber-300 font-serif font-bold flex items-center justify-center text-xl shadow-md border border-amber-500/30">
                  {settings.siteName.slice(0, 1)}
                </span>
                <span className="font-serif font-bold text-stone-900 tracking-tight text-2xl sm:text-[26px]">
                  {settings.siteName}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-stone-800">
            <Link
              href="/"
              className={`transition py-1 border-b-2 hover:text-[#5C0612] ${
                pathname === "/" ? "text-[#5C0612] font-semibold border-[#5C0612]" : "border-transparent text-stone-700"
              }`}
            >
              Home
            </Link>

            {/* Wedding Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setWeddingDropdownOpen(true)}
              onMouseLeave={() => setWeddingDropdownOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 py-1 border-b-2 hover:text-[#5C0612] cursor-pointer transition ${
                  isWeddingActive ? "text-[#5C0612] font-semibold border-[#5C0612]" : "border-transparent text-stone-700"
                }`}
                aria-expanded={weddingDropdownOpen}
                aria-haspopup="true"
                onClick={() => setWeddingDropdownOpen((prev) => !prev)}
              >
                <span>Wedding</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${weddingDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {weddingDropdownOpen && (
                <div
                  className="absolute left-0 top-full pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-2 space-y-1">
                    {weddingSubLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={`block px-3 py-2 text-xs rounded-xl transition ${
                          pathname === item.href
                            ? "bg-rose-50 text-rose-900 font-bold"
                            : "text-stone-700 hover:bg-stone-50 hover:text-rose-800"
                        }`}
                        onClick={() => setWeddingDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {mainNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition py-1 border-b-2 hover:text-[#5C0612] ${
                    isActive ? "text-[#5C0612] font-semibold border-[#5C0612]" : "border-transparent text-stone-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (WhatsApp & Login/Account) */}
          <div className="flex items-center gap-3">
            {/* WhatsApp Link with Accessible Label */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=Namaste!%20I%20would%20like%20to%20know%20more%20about%20digital%20invitations.`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with our invitation team on WhatsApp"
              className="px-3.5 py-2 rounded-xl bg-[#E8F8F0] hover:bg-[#D3F3E3] text-[#127C4B] border border-[#BCE8D2] text-xs font-semibold flex items-center gap-2 transition min-h-[42px] justify-center shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#127C4B]" />
              <span>WhatsApp</span>
            </a>

            {/* Login / My Account Button */}
            <Link
              href="/my-account"
              className="px-4 py-2 rounded-xl bg-[#5C0612] hover:bg-[#48050e] text-white text-xs font-semibold transition flex items-center gap-2 shadow-sm min-h-[42px]"
            >
              <User className="w-4 h-4 text-white/90" />
              <span>My Account</span>
            </Link>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-stone-700 hover:text-rose-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Accordion Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-b border-amber-900/10 px-6 py-5 space-y-4 shadow-xl max-h-[80vh] overflow-y-auto">
            <nav aria-label="Mobile Navigation" className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3 rounded-xl text-sm font-semibold ${
                  pathname === "/" ? "bg-rose-50 text-rose-900 font-bold" : "text-stone-800 hover:bg-stone-50"
                }`}
              >
                Home
              </Link>

              {/* Mobile Wedding Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileWeddingOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold transition ${
                    isWeddingActive ? "text-rose-900 bg-rose-50/70" : "text-stone-800 hover:bg-stone-50"
                  }`}
                  aria-expanded={mobileWeddingOpen}
                >
                  <span>Wedding Invitations</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                      mobileWeddingOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileWeddingOpen && (
                  <div className="pl-4 pr-1 py-1 space-y-1 bg-amber-50/40 rounded-xl mt-1">
                    {weddingSubLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block py-2 px-3 text-xs rounded-lg transition ${
                          pathname === item.href
                            ? "bg-rose-100/70 text-rose-950 font-bold"
                            : "text-stone-700 hover:bg-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2.5 px-3 rounded-xl text-sm font-semibold ${
                    pathname === link.href ? "bg-rose-50 text-rose-900 font-bold" : "text-stone-800 hover:bg-stone-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-amber-900/10 flex flex-col gap-2.5">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Namaste!%20I%20would%20like%20to%20know%20more%20about%20digital%20invitations.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-center gap-2 min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Chat on WhatsApp ({BRAND.whatsappDisplay})</span>
              </a>

              <Link
                href="/my-account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-bold text-amber-50 bg-rose-700 rounded-xl min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <User className="w-4 h-4 text-amber-200" />
                <span>Login / My Account</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
