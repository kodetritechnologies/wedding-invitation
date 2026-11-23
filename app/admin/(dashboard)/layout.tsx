"use client";

import { useEffect, useState, ReactNode, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  CalendarHeart,
  LogOut,
  Loader2,
  Menu,
  X,
  LayoutDashboard,
  Settings,
  ChevronDown,
  ChevronRight,
  Globe,
  MessageSquareQuote,
  LayoutTemplate,
  HelpCircle,
  FolderTree,
  Compass,
  Mail,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
}

function SuperAdminLayoutInner({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<SuperAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("shaadi_super_admin_token")
            : null;

        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/auth/super-admin/me", {
          headers,
          credentials: "include",
        });

        if (!res.ok) {
          router.replace("/admin");
          return;
        }

        const data = await res.json();
        if (!data.success || !data.superAdmin) {
          router.replace("/admin");
          return;
        }

        setAdminUser(data.superAdmin);
      } catch {
        router.replace("/admin");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/super-admin/logout", { method: "POST" });
      localStorage.removeItem("shaadi_super_admin_token");
      router.replace("/admin");
    } catch {
      router.replace("/admin");
    }
  };

  // Auto-expand settings menu if on a settings subpage
  useEffect(() => {
    if (pathname.startsWith("/admin/settings")) {
      setSettingsOpen(true);
    }
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // If on the template code/theme editor, render as a dedicated full-page screen (no dashboard sidebar, header, or padding)
  const isEditorPage = pathname.includes("/templates/") && pathname.includes("/editor");
  if (isEditorPage) {
    return <div className="h-screen w-screen overflow-hidden bg-zinc-950">{children}</div>;
  }

  const isDashboardActive = pathname === "/admin/dashboard";
  const isClientsActive = pathname.startsWith("/admin/clients");
  const isWeddingsActive = pathname.startsWith("/admin/weddings");
  const isOrdersActive = pathname.startsWith("/admin/orders");
  const isTemplatesActive = pathname.startsWith("/admin/templates");
  const isCategoriesActive = pathname.startsWith("/admin/categories");
  const isNavigationActive = pathname.startsWith("/admin/navigation");
  const isTestimonialsActive = pathname.startsWith("/admin/testimonials");
  const isFaqsActive = pathname.startsWith("/admin/faqs");
  const isEnquiriesActive = pathname.startsWith("/admin/enquiries");
  const isPaymentSettingsActive = pathname.startsWith("/admin/settings/payment") || pathname.startsWith("/admin/payments");
  const isWebsiteSettingsActive = pathname.startsWith("/admin/settings/website");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* =========================================================================
          LEFT SIDEBAR (Persistent across all /admin routes)
         ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center p-1 border border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.png" alt="VivahVaani" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight block leading-tight">
                VivahVaani
              </span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
          {/* 1. Dashboard */}
          <Link
            href="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isDashboardActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          {/* 2. Clients */}
          <Link
            href="/admin/clients"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isClientsActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Clients</span>
          </Link>

          {/* 3. Weddings */}
          <Link
            href="/admin/weddings"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isWeddingsActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <CalendarHeart className="w-4 h-4" />
            <span>Weddings</span>
          </Link>

          {/* 4. Orders */}
          <Link
            href="/admin/orders"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isOrdersActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </Link>

          {/* 4. Master Templates */}
          <Link
            href="/admin/templates"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isTemplatesActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Templates</span>
          </Link>

          {/* 5. Categories */}
          <Link
            href="/admin/categories"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isCategoriesActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories</span>
          </Link>

          {/* 6. Navigation */}
          <Link
            href="/admin/navigation"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isNavigationActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Navigation</span>
          </Link>

          {/* 4. Testimonials */}
          <Link
            href="/admin/testimonials"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isTestimonialsActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Testimonials</span>
          </Link>

          {/* 5. FAQs */}
          <Link
            href="/admin/faqs"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isFaqsActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs</span>
          </Link>

          {/* 6. Enquiries / Leads */}
          <Link
            href="/admin/enquiries"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              isEnquiriesActive
                ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Enquiries</span>
          </Link>

          {/* 5. Settings (Collapsible Parent) */}
          <div className="pt-2">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
              {settingsOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {settingsOpen && (
              <div className="mt-1 pl-4 space-y-1">
                {/* 4.1 Website Settings Subpage */}
                <Link
                  href="/admin/settings/website"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition ${
                    isWebsiteSettingsActive
                      ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website Settings</span>
                </Link>

                {/* 4.2 Payment Gateway Subpage */}
                <Link
                  href="/admin/settings/payment"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition ${
                    isPaymentSettingsActive
                      ? "bg-zinc-800 text-amber-400 font-semibold border-l-2 border-amber-500"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Payment Gateway</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer: Profile & Logout */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900">
          <div className="px-2 py-1.5 mb-2">
            <p className="text-xs font-semibold text-white truncate">
              {adminUser?.name || "Super Admin"}
            </p>
            <p className="text-[11px] text-zinc-400 truncate ">
              {adminUser?.email || "admin@vivahvaani.kodetri.com"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-zinc-800 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT CONTENT SURFACE
         ========================================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">
              {isOrdersActive
                ? "Customer Orders"
                : isPaymentSettingsActive
                ? "Settings / Payment Gateway"
                : isWebsiteSettingsActive
                ? "Settings / Website Settings"
                : isClientsActive
                ? "Clients"
                : isWeddingsActive
                ? "Weddings"
                : isTestimonialsActive
                ? "Testimonials"
                : "Dashboard Overview"}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs transition"
            >
              View Live Website
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Route Page Content */}
        <main className="flex-1 p-6 space-y-6  w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm font-medium">Loading control panel...</p>
        </div>
      }
    >
      <SuperAdminLayoutInner>{children}</SuperAdminLayoutInner>
    </Suspense>
  );
}
