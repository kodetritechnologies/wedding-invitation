"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  CalendarHeart,
  UserCheck,
  Building,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface OverviewStats {
  totalAdmins: number;
  totalWeddings: number;
  totalClients: number;
  totalGuests: number;
}

interface AdminRecord {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  subscription: {
    plan: string;
  };
  status: string;
  createdAt: string;
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentAdmins, setRecentAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/super-admin/overview", {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentAdmins(data.recentAdmins || []);
      }
    } catch (err) {
      console.error("Overview fetch error", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOverview();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Platform Overview</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Key metrics for registered clients, active invitations, and guest RSVPs.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Clients
              </span>
              <Users className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalAdmins}</p>
            <p className="text-[11px] text-zinc-500">Registered wedding planners</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Weddings
              </span>
              <CalendarHeart className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalWeddings}</p>
            <p className="text-[11px] text-zinc-500">Invitations created</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">
                Total RSVPs
              </span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalGuests}</p>
            <p className="text-[11px] text-zinc-500">Tracked guest responses</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium uppercase tracking-wider">
                Couples
              </span>
              <Building className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
            <p className="text-[11px] text-zinc-500">Couple accounts</p>
          </div>
        </div>
      )}

      {/* Recent Clients Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Clients</h3>
          <Link
            href="/admin/clients"
            className="text-xs text-amber-500 hover:text-amber-400 font-medium"
          >
            View All Clients →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentAdmins.slice(0, 6).map((adm) => (
                <tr key={adm._id} className="hover:bg-zinc-800/40">
                  <td className="py-3 px-4 font-medium text-white">{adm.name}</td>
                  <td className="py-3 px-4  text-zinc-400">{adm.email}</td>
                  <td className="py-3 px-4 text-zinc-300">{adm.businessName || "—"}</td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-amber-400">
                    {adm.subscription?.plan || "free"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {adm.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-400">
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
      </div>
    </div>
  );
}
