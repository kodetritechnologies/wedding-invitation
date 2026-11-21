"use client";

import { useEffect, useState, useMemo } from "react";
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

  const fetchEnquiries = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/super-admin/enquiries", {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error("Failed to load enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "unread" | "read" | "replied") => {
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
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || (item.status || "unread") === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        item.message.toLowerCase().includes(q) ||
        (item.role && item.role.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, searchQuery]);

  // Statistics
  const totalCount = enquiries.length;
  const unreadCount = enquiries.filter((e) => (e.status || "unread") === "unread").length;
  const repliedCount = enquiries.filter((e) => e.status === "replied").length;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            Client Enquiries &amp; Messages
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Review incoming leads, connect via WhatsApp or Phone, and manage inquiries from the Contact form.
          </p>
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
          <span className="text-xl font-bold text-white mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Unread Leads</span>
          <span className="text-xl font-bold text-rose-400 mt-1 block">{unreadCount}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Contacted / Replied</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{repliedCount}</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All", count: totalCount },
            { id: "unread", label: "Unread", count: unreadCount },
            { id: "read", label: "Read", count: enquiries.filter((e) => e.status === "read").length },
            { id: "replied", label: "Replied", count: repliedCount },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-zinc-950 font-bold"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-zinc-950/20 text-zinc-950 font-bold"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
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
        {filteredEnquiries.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-xs flex flex-col items-center justify-center gap-2">
            <Inbox className="w-8 h-8 text-zinc-600" />
            <p>No enquiries found for the selected filter.</p>
          </div>
        ) : (
          filteredEnquiries.map((item) => {
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
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-zinc-950/70 rounded-xl p-3.5 border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {item.message}
                </div>

                {/* Contact Bar & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                    <span className="font-semibold text-white">Contact:</span>

                    {/* Phone */}
                    <a
                      href={`tel:${item.phone}`}
                      className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{item.phone}</span>
                    </a>

                    {/* Direct WhatsApp */}
                    <a
                      href={`https://wa.me/${waNumber}?text=Namaste%20${encodeURIComponent(
                        item.name
                      )},%20we%20received%20your%20inquiry%20regarding%20digital%20invitation.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleUpdateStatus(item._id, "replied")}
                      className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800 font-semibold"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>WhatsApp Chat</span>
                    </a>

                    {/* Email if provided */}
                    {item.email && (
                      <a
                        href={`mailto:${item.email}`}
                        className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700 truncate max-w-[200px]"
                      >
                        <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{item.email}</span>
                      </a>
                    )}
                  </div>

                  {/* Delete button */}
                  <div className="self-end sm:self-center">
                    <button
                      onClick={() => handleDelete(item._id, item.name)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/80 hover:text-rose-400 text-zinc-400 transition cursor-pointer flex items-center gap-1 text-xs"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] sm:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
