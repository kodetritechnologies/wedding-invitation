"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarHeart,
  LogOut,
  Heart,
  Loader2,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  businessName?: string;
  businessTypes?: string[];
}

function NavLinks() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/weddings", label: "My Wedding Cards", icon: CalendarHeart },
  ];

  return (
    <nav className="p-4 space-y-1.5">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive
                ? "bg-rose-50 text-rose-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? "text-rose-600" : "text-gray-400"
              }`}
            />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderTitle() {
  const pathname = usePathname();

  return (
    <h2 className="text-base font-semibold text-gray-800">
      {pathname === "/dashboard"
        ? "My Wedding Overview"
        : pathname.startsWith("/dashboard/weddings")
        ? "Wedding Card & Guests"
        : "Wedding Portal"}
    </h2>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("shaadi_auth_token")
            : null;

        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("/api/auth/me", {
          headers,
          credentials: "include",
        });

        if (!res.ok) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          window.location.href = "/login";
        }
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("shaadi_auth_token");
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
          <p className="text-sm text-gray-500 font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 tracking-tight text-lg">
                Shaadi<span className="text-rose-600">Connect</span>
              </span>
              <span className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                Client Portal
              </span>
            </div>
          </div>

          {/* Navigation Links wrapped in Suspense */}
          <Suspense fallback={<div className="p-4 text-xs text-gray-400">Loading nav...</div>}>
            <NavLinks />
          </Suspense>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
              CLIENT
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-100 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Surface */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <Suspense fallback={<h2 className="text-base font-semibold text-gray-800">Workspace</h2>}>
            <HeaderTitle />
          </Suspense>
          <div className="text-xs text-gray-400 font-medium">
            Location: <span className="text-gray-700 font-semibold">Indore, MP</span>
          </div>
        </header>

        <div className="p-8  mx-auto">{children}</div>
      </main>
    </div>
  );
}
