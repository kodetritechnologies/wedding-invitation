"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function ClientsPage() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchClients = useCallback(async (targetPage = page) => {
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
        plan: planFilter,
      });

      const res = await fetch(`/api/super-admin/clients?${params.toString()}`, {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setAdmins(data.clients || []);
        if (data.pagination) {
          setPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalRecords(data.pagination.total);
        }
      }
    } catch (err) {
      console.error("Failed to load clients", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, planFilter]);

  // Debounced search / filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchClients(1);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, planFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      fetchClients(newPage);
    }
  };

  const startRecord = totalRecords > 0 ? (page - 1) * 10 + 1 : 0;
  const endRecord = Math.min(page * 10, totalRecords);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white">Registered Clients</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900">All Plans</option>
              <option value="free" className="bg-zinc-900">Free</option>
              <option value="starter" className="bg-zinc-900">Starter</option>
              <option value="professional" className="bg-zinc-900">Professional</option>
              <option value="agency" className="bg-zinc-900">Agency</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <p className="text-xs text-zinc-400">Loading clients...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            No clients found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-zinc-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Business</th>
                    <th className="py-3 px-4">Categories</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {admins.map((adm) => (
                    <tr key={adm._id} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-medium text-white">{adm.name}</td>
                      <td className="py-3 px-4 font-mono text-zinc-400">{adm.email}</td>
                      <td className="py-3 px-4 text-zinc-300">{adm.businessName || "—"}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {adm.businessTypes?.length > 0 ? (
                            adm.businessTypes.map((bt, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-300 border border-zinc-700"
                              >
                                {bt.replace("_", " ")}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-500">-</span>
                          )}
                        </div>
                      </td>
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

            {/* Pagination Controls */}
            <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/60">
              <span>
                Showing <span className="font-semibold text-white">{startRecord}</span> to{" "}
                <span className="font-semibold text-white">{endRecord}</span> of{" "}
                <span className="font-semibold text-white">{totalRecords}</span> clients
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
