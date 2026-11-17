import Link from "next/link";
import { Heart, MapPin, Mail, Phone, MessageCircle } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-[#1A1110] text-amber-100/80 font-sans text-xs border-t border-amber-900/30">
      {/* Decorative Traditional Divider */}
      <div className="py-3 text-center text-amber-400/40 text-xs tracking-[0.5em] font-serif border-b border-amber-950">
        ✦ ━━━━━━ ❖ ━━━━━━ ✦
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Col */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-700 to-amber-800 flex items-center justify-center text-amber-300 shadow-sm border border-amber-500/30">
              <Heart className="w-4 h-4 fill-amber-300 text-amber-300" />
            </div>
            <span className="font-bold text-white tracking-tight text-xl font-serif">
              Shaadi<span className="text-rose-400">Connect</span>
            </span>
          </Link>
          <p className="text-amber-100/60 leading-relaxed text-xs font-serif italic">
            &ldquo;Kalyanam, Mangalyam, Shubham.&rdquo; Reimagining Indian wedding invitations into timeless, interactive digital patrika experiences.
          </p>
          <p className="flex items-start gap-2 text-amber-200/70 text-[11px] pt-1">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>Vijay Nagar, Indore, Madhya Pradesh &bull; 452010</span>
          </p>
        </div>

        {/* Product Links */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-amber-200 uppercase text-xs tracking-wider">
            Wedding Patrika & Invites
          </h4>
          <ul className="space-y-2 text-amber-100/60">
            <li>
              <Link href="/templates" className="hover:text-amber-200 transition">
                Royal Rajasthani Designs
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-amber-200 transition">
                Floral Pastel Collections
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-amber-200 transition">
                Vedic Gold & Shloka Themes
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-amber-200 transition">
                Google Maps & RSVP Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-amber-200 transition">
                Affordable Packages (from ₹299)
              </Link>
            </li>
          </ul>
        </div>

        {/* For Wedding Businesses */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-amber-200 uppercase text-xs tracking-wider">
            For Wedding Studios & Planners
          </h4>
          <ul className="space-y-2 text-amber-100/60">
            <li>
              <Link href="/register" className="hover:text-amber-200 transition">
                Invitation Designers Portal
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-amber-200 transition">
                Wedding Planners Multi-Client Suite
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-amber-200 transition">
                Photographers & Event Studios
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-amber-200 transition">
                How It Works for Agencies
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-amber-400/40 hover:text-amber-300 transition font-mono text-[10px]">
                Super Admin Master Console (/admin)
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Local Concierge */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-amber-200 uppercase text-xs tracking-wider">
            Indore Support & Concierge
          </h4>
          <ul className="space-y-2 text-amber-100/60">
            <li>
              <Link href="/about" className="hover:text-amber-200 transition">
                Our Story in Madhya Pradesh
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-amber-200 transition">
                Customer Support & Help
              </Link>
            </li>
            <li className="flex items-center gap-2 pt-1 text-amber-200">
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span>namaste@shaadiconnect.com</span>
            </li>
            <li className="flex items-center gap-2 text-amber-200">
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span>+91 98260 12345 (10 AM - 7 PM)</span>
            </li>
            <li className="pt-2">
              <a
                href="https://wa.me/919826012345?text=Hello%20ShaadiConnect,%20I%20want%20to%20know%20more%20about%20digital%20wedding%20invitations"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-semibold hover:bg-emerald-900 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-amber-950 py-6 px-6 text-center text-[11px] text-amber-200/40 font-serif">
        <p>
          &copy; 2026 ShaadiConnect. Crafted with shradha & modern technology in Indore, Madhya Pradesh.
        </p>
      </div>
    </footer>
  );
}
