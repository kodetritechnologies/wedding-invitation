"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Trash2,
  Check,
  X,
  Loader2,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface EnquiryItem {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  eventDate?: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export default function SuperAdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [counts, setCounts] = useState({
    total: 0,
    unread: 0,
    replied: 0,
  });

  const fetchEnquiries = useCallback(async (targetPage = page) => {
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
        status: statusFilter,
        search: searchQuery,
      });

      const res = await fetch(`/api/super-admin/enquiries?${params.toString()}`, {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
        if (data.pagination) {
          setPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalRecords(data.pagination.total);
        }
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch (err) {
      console.error("Failed to load enquiries", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery]);

  // Debounced search & filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchEnquiries(1);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "unread" | "read" | "replied"
  ) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/super-admin/enquiries/${id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete enquiry from "${name}"?`)) {
      return;
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/super-admin/enquiries/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (res.ok) {
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        setSuccessMsg("Enquiry deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchEnquiries(page);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      fetchEnquiries(newPage);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const cleanPhoneForWa = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const startRecord = totalRecords > 0 ? (page - 1) * 10 + 1 : 0;
  const endRecord = Math.min(page * 10, totalRecords);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            Client Enquiries &amp; Messages
          </h2>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Total Inquiries</span>
          <span className="text-xl font-bold text-white mt-1 block">{counts.total}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Unread Leads</span>
          <span className="text-xl font-bold text-rose-400 mt-1 block">{counts.unread}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Contacted / Replied</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{counts.replied}</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "read", label: "Read" },
            { id: "replied", label: "Replied" },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-zinc-950 font-bold"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email..."
            className="w-full pl-9 pr-8 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <p className="text-xs text-zinc-400">Loading enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-xs flex flex-col items-center justify-center gap-2">
            <Inbox className="w-8 h-8 text-zinc-600" />
            <p>No enquiries found for the selected filter.</p>
          </div>
        ) : (
          <>
            {enquiries.map((item) => {
              const currentStatus = item.status || "unread";
              const waNumber = cleanPhoneForWa(item.phone);

              return (
                <div
                  key={item._id}
                  className={`bg-zinc-900 border rounded-2xl p-5 space-y-3 transition ${
                    currentStatus === "unread"
                      ? "border-amber-500/40 bg-zinc-900/90 shadow-sm"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {/* Header Row: Client Info, Role, Time, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {item.name}
                      </span>
                      {item.role && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-amber-400 border border-zinc-700 capitalize">
                          {item.role}
                        </span>
                      )}
                      {item.eventDate && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>Event: {item.eventDate}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(item.createdAt)}</span>
                      </span>

                      {/* Status Select */}
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleUpdateStatus(
                            item._id,
                            e.target.value as "unread" | "read" | "replied"
                          )
                        }
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer focus:outline-hidden ${
                          currentStatus === "unread"
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : currentStatus === "replied"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700"
                        }`}
                      >
                        <option value="unread" className="bg-zinc-900">
                          Unread
                        </option>
                        <option value="read" className="bg-zinc-900">
                          Read
                        </option>
                        <option value="replied" className="bg-zinc-900">
                          Replied
                        </option>
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete enquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80">
                    {item.message}
                  </p>

                  {/* Footer Action Row: Contacts & Instant WhatsApp / Call */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-xs">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        {item.phone}
                      </span>
                      {item.email && (
                        <span className="flex items-center gap-1.5 font-mono">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          {item.email}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                          `Namaste ${item.name}, thank you for reaching out to VivahVaani regarding your wedding invitation inquiry.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Reply</span>
                      </a>

                      {/* Call Button */}
                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            <div className="p-4 rounded-xl border border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-900">
              <span>
                Showing <span className="font-semibold text-white">{startRecord}</span> to{" "}
                <span className="font-semibold text-white">{endRecord}</span> of{" "}
                <span className="font-semibold text-white">{totalRecords}</span> enquiries
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition text-xs"
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition text-xs"
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
