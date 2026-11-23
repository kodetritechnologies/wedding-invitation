"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Loader2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";

interface OrderItem {
  _id: string;
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  templateTitle: string;
  templateSlug: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  mode: "test" | "live";
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidOrdersCount: 0,
    pendingOrdersCount: 0,
    failedOrdersCount: 0,
    totalOrdersCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("shaadi_super_admin_token")
        : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadOrders = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const headers = getAuthHeaders();
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (modeFilter !== "all") params.set("mode", modeFilter);

      const res = await fetch(`/api/super-admin/orders?${params.toString()}`, {
        headers,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadOrders();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, statusFilter, modeFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Customer Orders
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live records of all template purchases, payment confirmations, and customer details
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadOrders(true)}
          disabled={refreshing}
          className="px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
              Total Revenue
            </span>
            <span className="text-xl font-bold font-serif text-white mt-0.5 block">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Paid Orders */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
              Paid Orders
            </span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
              {stats.paidOrdersCount}
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
              Pending Checkouts
            </span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">
              {stats.pendingOrdersCount}
            </span>
          </div>
        </div>

        {/* Total Checkouts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
              Total Initiated
            </span>
            <span className="text-xl font-bold text-zinc-200 mt-0.5 block">
              {stats.totalOrdersCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Customer name, Phone, Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 transition cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="created">Pending / Created</option>
            <option value="failed">Failed</option>
          </select>

          {/* Mode Filter */}
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-amber-500 transition cursor-pointer"
          >
            <option value="all">All Modes</option>
            <option value="test">Test Mode</option>
            <option value="live">Live Mode</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-xs text-zinc-400">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto stroke-[1.5]" />
            <p className="text-sm font-semibold text-zinc-300">No orders found</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {search || statusFilter !== "all" || modeFilter !== "all"
                ? "Try clearing your filters or search keyword."
                : "When customers purchase templates on the storefront, their orders will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 bg-zinc-900/90">
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Template</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Mode</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Razorpay Payment ID</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-zinc-800/30 transition">
                    {/* Order ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-zinc-200">
                      {ord.orderId}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      {ord.customerPhone && (
                        <div className="text-[11px] text-zinc-400">{ord.customerPhone}</div>
                      )}
                      {ord.customerEmail && (
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {ord.customerEmail}
                        </div>
                      )}
                    </td>

                    {/* Template */}
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">
                      {ord.templateTitle}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-serif font-bold text-amber-400">
                      ₹{ord.amount}
                    </td>

                    {/* Mode */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          ord.mode === "live"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {ord.mode}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          ord.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : ord.status === "failed"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ord.status === "paid"
                              ? "bg-emerald-400"
                              : ord.status === "failed"
                              ? "bg-rose-400"
                              : "bg-zinc-500"
                          }`}
                        />
                        <span className="capitalize">{ord.status}</span>
                      </span>
                    </td>

                    {/* Razorpay Payment ID */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                      {ord.razorpayPaymentId || "—"}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-right text-zinc-400 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
