"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Users,
  CalendarHeart,
  UserCheck,
  LogOut,
  Building,
  CheckCircle,
  Loader2,
  Lock,
} from "lucide-react";

interface AdminRecord {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  businessTypes: string[];
  status: string;
  subscription: {
    plan: string;
    activeWeddingLimit: number;
  };
  createdAt: string;
}

interface OverviewStats {
  totalAdmins: number;
  totalWeddings: number;
  totalClients: number;
  totalGuests: number;
}

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("shaadi_super_admin_token")
            : null;

        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // 1. Verify Super Admin session
        const resMe = await fetch("/api/auth/super-admin/me", {
          headers,
          credentials: "include",
        });

        if (!resMe.ok) {
          window.location.href = "/admin";
          return;
        }

        const dataMe = await resMe.json();
        if (!dataMe.success || !dataMe.superAdmin) {
          window.location.href = "/admin";
          return;
        }
        setAdminUser(dataMe.superAdmin);

        // 2. Fetch platform overview stats
        const resStats = await fetch("/api/super-admin/overview", {
          headers,
          credentials: "include",
        });
        if (resStats.ok) {
          const dataStats = await resStats.json();
          setStats(dataStats.stats);
          setAdmins(dataStats.recentAdmins || []);
        }
      } catch (err) {
        console.error("Super Admin check failed", err);
        window.location.href = "/admin";
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/super-admin/logout", { method: "POST" });
      localStorage.removeItem("shaadi_super_admin_token");
      window.location.href = "/admin";
    } catch (err) {
      console.error("Logout error", err);
      window.location.href = "/admin";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium text-slate-400">
            Authenticating Super Admin Control Plane...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/40">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight">
              ShaadiConnect <span className="text-indigo-400 font-normal">| Control Plane</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Super Admin Master Console (/admin)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{adminUser?.name}</p>
            <p className="text-[11px] text-indigo-400 font-mono">{adminUser?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/40 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Surface */}
      <main className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Dedicated Collection: `superadmins`</span>
            </div>
            <h2 className="text-xl font-bold text-white">Platform Health & Tenant Overview</h2>
            <p className="text-xs text-slate-400 mt-1">
              Complete oversight of registered business Admins, clients, and weddings across Madhya Pradesh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Platform Online</span>
            </span>
          </div>
        </div>

        {/* Global KPIs */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Admins
                </span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalAdmins}</p>
              <p className="text-[11px] text-slate-500">From `admins` collection</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Clients
                </span>
                <Building className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
              <p className="text-[11px] text-slate-500">Managed across all tenants</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Wedding Projects
                </span>
                <CalendarHeart className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalWeddings}</p>
              <p className="text-[11px] text-slate-500">Active & Published invitations</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Guests Tracked
                </span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalGuests}</p>
              <p className="text-[11px] text-slate-500">Accountless RSVP ecosystem</p>
            </div>
          </div>
        )}

        {/* Registered Admins List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Registered Business Admins</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Designers, wedding planners, photographers, and studios
              </p>
            </div>
            <span className="text-xs text-indigo-400 font-mono">
              Count: {admins.length}
            </span>
          </div>

          {admins.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No business admins registered in `admins` collection yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Admin Name</th>
                    <th className="py-3 px-5">Email</th>
                    <th className="py-3 px-5">Business / Studio</th>
                    <th className="py-3 px-5">Categories</th>
                    <th className="py-3 px-5">Plan</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {admins.map((adm) => (
                    <tr key={adm._id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-5 font-semibold text-white">
                        {adm.name}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-400">
                        {adm.email}
                      </td>
                      <td className="py-3.5 px-5 text-slate-300">
                        {adm.businessName || "-"}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex flex-wrap gap-1">
                          {adm.businessTypes?.length > 0 ? (
                            adm.businessTypes.map((bt, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700"
                              >
                                {bt.replace("_", " ")}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-medium text-indigo-300 uppercase text-[10px]">
                        {adm.subscription?.plan || "free"}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {adm.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right text-slate-500">
                        {new Date(adm.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
