"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, ExternalLink, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchWeddings = useCallback(async (targetPage = page) => {
    try {
      setLoading(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const params = new URLSearchParams({
        page: String(targetPage),
        limit: "10",
        search: searchQuery,
        status: statusFilter,
      });

      const res = await fetch(`/api/super-admin/weddings?${params.toString()}`, {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setWeddings(data.weddings || []);
        if (data.pagination) {
          setPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalRecords(data.pagination.total);
        }
      }
    } catch (err) {
      console.error("Failed to load weddings", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  // Debounced search / filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchWeddings(1);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      fetchWeddings(newPage);
    }
  };

  const startRecord = totalRecords > 0 ? (page - 1) * 10 + 1 : 0;
  const endRecord = Math.min(page * 10, totalRecords);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white">All Wedding Invitations</h2>
        </div>

        <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900">All Statuses</option>
              <option value="published" className="bg-zinc-900">Published</option>
              <option value="draft" className="bg-zinc-900">Draft</option>
              <option value="archived" className="bg-zinc-900">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <p className="text-xs text-zinc-400">Loading weddings...</p>
          </div>
        ) : weddings.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            No wedding invitations found.
          </div>
        ) : (
          <>
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
                  {weddings.map((w) => (
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

            {/* Pagination Controls */}
            <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/60">
              <span>
                Showing <span className="font-semibold text-white">{startRecord}</span> to{" "}
                <span className="font-semibold text-white">{endRecord}</span> of{" "}
                <span className="font-semibold text-white">{totalRecords}</span> invitations
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="px-2 text-zinc-300 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
