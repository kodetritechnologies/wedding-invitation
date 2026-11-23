"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BRAND } from "@/lib/brand";
import LoginModal from "@/components/auth/LoginModal";

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

interface SubNavItem {
  label: string;
  href: string;
  order?: number;
}

interface NavItem {
  _id?: string;
  label: string;
  href: string;
  type: "link" | "dropdown";
  dropdownItems?: SubNavItem[];
  openInNewTab?: boolean;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    label: "Wedding",
    href: "/templates?category=wedding",
    type: "link",
  },
  {
    label: "Engagement",
    href: "/templates?category=engagement",
    type: "link",
  },
  {
    label: "Birthday",
    href: "/templates?category=birthday",
    type: "link",
  },
  {
    label: "Anniversary",
    href: "/templates?category=anniversary",
    type: "link",
  },
  {
    label: "House Warming",
    href: "/templates?category=housewarming",
    type: "link",
  },
  {
    label: "Reception",
    href: "/templates?category=reception",
    type: "link",
  },
  {
    label: "Pricing",
    href: "/pricing",
    type: "link",
  },
  {
    label: "Contact",
    href: "/contact",
    type: "link",
  },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  const [mobileActiveDropdownIndex, setMobileActiveDropdownIndex] = useState<number | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if URL triggers login modal
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true" || window.location.hash === "#login") {
        setLoginModalOpen(true);
      }
    }
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const [settings, setSettings] = useState<HeaderSettings>({
    siteName: BRAND.name,
    logoUrl: "/logo.png",
    announcementBar: {
      enabled: true,
      text: "✦ विवाहवाणी • हर शादी की शुरुआत, एक खूबसूरत निमंत्रण ✦",
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
              logoUrl: data.settings.logoUrl || "/logo.png",
              announcementBar: data.settings.announcementBar || {
                enabled: true,
                text: "✦ विवाहवाणी • हर शादी की शुरुआत, एक खूबसूरत निमंत्रण ✦",
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

  // Fetch navigation items dynamically from API
  useEffect(() => {
    async function fetchNav() {
      try {
        const res = await fetch("/api/public/navigation");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.navItems) && data.navItems.length > 0) {
            setNavItems(data.navItems);
          } else {
            setNavItems(DEFAULT_NAV_ITEMS);
          }
        } else {
          setNavItems(DEFAULT_NAV_ITEMS);
        }
      } catch {
        setNavItems(DEFAULT_NAV_ITEMS);
      }
    }
    fetchNav();
  }, []);

  // Check login state dynamically on route change
  useEffect(() => {
    async function checkSession() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("shaadi_auth_token") || localStorage.getItem("token")
            : null;

        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("/api/auth/me", {
          headers,
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser({ name: data.user.name, email: data.user.email });
            return;
          }
        }
        setUser(null);
      } catch {
        setUser(null);
      }
    }

    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    localStorage.removeItem("shaadi_auth_token");
    localStorage.removeItem("token");
    setUser(null);
    setAccountDropdownOpen(false);
    window.location.href = "/?login=true";
  };

  const isLinkActive = (targetHref: string) => {
    if (targetHref === "/") return pathname === "/";
    if (targetHref.startsWith("/templates?category=")) {
      if (pathname !== "/templates") return false;
      if (typeof window !== "undefined") {
        const currentCat = new URLSearchParams(window.location.search).get("category");
        const targetCat = new URL(targetHref, "http://localhost").searchParams.get("category");
        return currentCat?.toLowerCase() === targetCat?.toLowerCase();
      }
      return false;
    }
    return pathname === targetHref;
  };

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

            {navItems.map((item, idx) => {
              if (item.type === "dropdown" && Array.isArray(item.dropdownItems) && item.dropdownItems.length > 0) {
                const isItemActive =
                  pathname === item.href ||
                  item.dropdownItems.some((sub) => pathname === sub.href);
                const isOpen = activeDropdownIndex === idx;

                return (
                  <div
                    key={item._id || idx}
                    className="relative"
                    onMouseEnter={() => setActiveDropdownIndex(idx)}
                    onMouseLeave={() => setActiveDropdownIndex(null)}
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 py-1 border-b-2 hover:text-[#5C0612] cursor-pointer transition ${
                        isItemActive
                          ? "text-[#5C0612] font-semibold border-[#5C0612]"
                          : "border-transparent text-stone-700"
                      }`}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => setActiveDropdownIndex(isOpen ? null : idx)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className="absolute left-0 top-full pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        role="menu"
                      >
                        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-2 space-y-1">
                          {item.dropdownItems.map((sub, sIdx) => (
                            <Link
                              key={sub.href || sIdx}
                              href={sub.href}
                              role="menuitem"
                              className={`block px-3 py-2 text-xs rounded-xl transition ${
                                pathname === sub.href
                                  ? "bg-rose-50 text-rose-900 font-bold"
                                  : "text-stone-700 hover:bg-stone-50 hover:text-rose-800"
                              }`}
                              onClick={() => setActiveDropdownIndex(null)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Simple Link
              const isActive = isLinkActive(item.href);
              return (
                <Link
                  key={item._id || idx}
                  href={item.href}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className={`transition py-1 border-b-2 hover:text-[#5C0612] ${
                    isActive
                      ? "text-[#5C0612] font-semibold border-[#5C0612]"
                      : "border-transparent text-stone-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Login/Account) */}
          <div className="flex items-center gap-3">
            {/* Login / My Account Dynamic Switcher */}
            {user ? (
              <div
                className="relative"
                onMouseLeave={() => setAccountDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setAccountDropdownOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-[#5C0612] hover:bg-[#48050e] text-white border-2 border-amber-400/40 shadow-sm transition-all hover:scale-105 flex items-center justify-center cursor-pointer select-none"
                  aria-expanded={accountDropdownOpen}
                  title={user.name}
                >
                  {user.name ? (
                    <span className="font-serif font-bold text-sm tracking-wide text-amber-100 uppercase">
                      {user.name.trim().charAt(0)}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-amber-200" />
                  )}
                </button>

                {accountDropdownOpen && (
                  <div className="absolute right-0 top-full pt-1.5 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-2 space-y-1">
                      <div className="px-3 py-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#5C0612] rounded-xl transition"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-stone-400" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/weddings"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#5C0612] rounded-xl transition"
                      >
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>My Wedding Cards</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-[#5C0612] hover:bg-stone-100 rounded-xl transition min-h-[42px] flex items-center justify-center cursor-pointer"
                >
                  Login
                </button>

                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-[#5C0612] hover:bg-[#48050e] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm min-h-[42px]"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 text-stone-700 hover:text-[#5C0612] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px] min-w-[44px] flex items-center justify-center transition cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side Drawer rendered via Portal to document.body */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="lg:hidden">
            {/* Backdrop */}
            <div
              className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[999] transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in Drawer */}
            <aside
              className={`fixed top-0 right-0 h-screen h-dvh w-[85%] max-w-sm bg-[#FDFBF7] shadow-2xl z-[1000] flex flex-col justify-between transition-transform duration-300 ease-in-out border-l border-amber-900/15 ${
                mobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
              }`}
              aria-label="Mobile Navigation Drawer"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-amber-900/10 flex items-center justify-between bg-white/80 backdrop-blur-xs">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 group"
                >
                  {settings.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.logoUrl}
                      alt={settings.siteName}
                      className="h-9 w-auto max-w-[150px] object-contain"
                    />
                  ) : (
                    <span className="font-serif font-bold text-stone-900 text-lg">
                      {settings.siteName}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-600 hover:text-[#5C0612] hover:bg-stone-100 rounded-xl transition cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                <nav aria-label="Mobile Navigation" className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition ${
                      pathname === "/" ? "bg-rose-50 text-rose-900 font-bold" : "text-stone-800 hover:bg-stone-100/70"
                    }`}
                  >
                    Home
                  </Link>

                  {navItems.map((item, idx) => {
                    if (item.type === "dropdown" && Array.isArray(item.dropdownItems) && item.dropdownItems.length > 0) {
                      const isItemActive =
                        pathname === item.href ||
                        item.dropdownItems.some((sub) => pathname === sub.href);
                      const isMobileOpen = mobileActiveDropdownIndex === idx;

                      return (
                        <div key={item._id || idx} className="rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              setMobileActiveDropdownIndex(isMobileOpen ? null : idx)
                            }
                            className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                              isItemActive ? "text-rose-900 bg-rose-50/70" : "text-stone-800 hover:bg-stone-100/70"
                            }`}
                            aria-expanded={isMobileOpen}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                                isMobileOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isMobileOpen && (
                            <div className="pl-3 pr-1 py-1.5 space-y-1 bg-amber-50/60 rounded-xl mt-1 ml-2 border-l-2 border-amber-600/30">
                              {item.dropdownItems.map((sub, sIdx) => (
                                <Link
                                  key={sub.href || sIdx}
                                  href={sub.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block py-2 px-3 text-xs rounded-lg transition ${
                                    pathname === sub.href
                                      ? "bg-rose-100/80 text-rose-950 font-bold"
                                      : "text-stone-700 hover:bg-white"
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Simple Link
                    const isActive = isLinkActive(item.href);
                    return (
                      <Link
                        key={item._id || idx}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                        className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition ${
                          isActive ? "bg-rose-50 text-rose-900 font-bold" : "text-stone-800 hover:bg-stone-100/70"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Bar (User / Auth Actions) */}
              <div className="p-4 border-t border-amber-900/10 bg-white/80 space-y-3">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 text-xs font-bold text-amber-50 bg-[#5C0612] hover:bg-[#48050e] rounded-xl min-h-[44px] flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <User className="w-4 h-4 text-amber-200" />
                      <span>My Account ({user.name})</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-center py-2.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginModalOpen(true);
                      }}
                      className="w-full text-center py-2.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl min-h-[42px] flex items-center justify-center cursor-pointer transition"
                    >
                      Login
                    </button>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 text-xs font-bold text-white bg-[#5C0612] hover:bg-[#48050e] rounded-xl min-h-[42px] flex items-center justify-center shadow-xs transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>,
          document.body
        )}

      {/* Auth Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </>
  );
}
