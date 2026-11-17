"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/templates", label: "Designs & Patrika" },
    { href: "/features", label: "Features" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top Auspicious Gold Strip */}
      <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 text-amber-50 text-[11px] py-1 px-4 text-center font-serif tracking-widest flex items-center justify-center gap-2">
        <span>✦</span>
        <span>शुभ विवाह &bull; Digital Wedding Invitations Crafted for Modern Indian Families</span>
        <span>✦</span>
      </div>

      <header className="bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/10 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Brand Logo with Indian Royal Flourish */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-700 via-rose-800 to-amber-900 flex items-center justify-center text-amber-300 shadow-sm border border-amber-400/30 group-hover:scale-105 transition">
              <Heart className="w-4 h-4 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <span className="font-bold text-stone-900 tracking-tight text-xl font-serif">
                Shaadi<span className="text-rose-700">Connect</span>
              </span>
              <span className="block text-[9px] text-amber-800/80 uppercase font-sans font-semibold tracking-wider -mt-1">
                Digital Patrika &bull; Indore, MP
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition relative py-1 ${
                    isActive
                      ? "text-rose-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-700"
                      : "text-stone-600 hover:text-rose-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-stone-700 hover:text-rose-700 transition px-3 py-2 uppercase tracking-wider"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2.5 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-amber-50 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 border border-amber-400/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Patrika</span>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-rose-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FDFBF7] border-b border-amber-900/10 px-6 py-5 space-y-4 shadow-lg">
            <nav className="space-y-3 font-serif">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-stone-800 hover:text-rose-700"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-amber-900/10 flex flex-col gap-2 font-sans">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 border border-stone-300 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-rose-700 rounded-xl"
              >
                Create Digital Patrika Free
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
