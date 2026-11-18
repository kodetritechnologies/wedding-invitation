"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, ExternalLink, Loader2 } from "lucide-react";

interface WeddingRecord {
  _id: string;
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue?: string;
  city?: string;
  slug: string;
  status: "draft" | "published" | "archived";
  packageTier: string;
  createdAt: string;
}

export default function WeddingsPage() {
  const [weddings, setWeddings] = useState<WeddingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchWeddings() {
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
          setWeddings(data.recentWeddings || []);
        }
      } catch (err) {
        console.error("Failed to load weddings", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeddings();
  }, []);

  const filteredWeddings = useMemo(() => {
    return weddings.filter((w) => {
      const query = searchQuery.toLowerCase();
      return (
        w.title?.toLowerCase().includes(query) ||
        w.brideName?.toLowerCase().includes(query) ||
        w.groomName?.toLowerCase().includes(query) ||
        w.city?.toLowerCase().includes(query) ||
        w.slug?.toLowerCase().includes(query)
      );
    });
  }, [weddings, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white">All Wedding Invitations</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Public digital invitation cards and event websites created by clients.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by couple, city, slug..."
            className="pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {filteredWeddings.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            No wedding invitations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Title &amp; Couple</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredWeddings.map((w) => (
                  <tr key={w._id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <p className="font-medium text-white">{w.title}</p>
                      <p className="text-[11px] text-zinc-400">
                        {w.groomName} &amp; {w.brideName}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">{w.city || "—"}</td>
                    <td className="py-3 px-4 text-zinc-400">
                      {w.weddingDate
                        ? new Date(w.weddingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-amber-400">
                      {w.packageTier || "royal"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                          w.status === "published"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/w/${w.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition cursor-pointer"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
