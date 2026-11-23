"use client";

import { useEffect, useState, useMemo } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  status: "active" | "inactive";
  order: number;
  createdAt: string;
}

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "general", label: "General & Homepage" },
  { id: "pricing", label: "Pricing" },
  { id: "wedding", label: "Wedding" },
  { id: "engagement", label: "Engagement" },
  { id: "anniversary", label: "Anniversary" },
  { id: "birthday", label: "Birthday" },
  { id: "housewarming", label: "House Warming" },
  { id: "reception", label: "Reception" },
];

export default function SuperAdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Form State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");
  const [customCategory, setCustomCategory] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [order, setOrder] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchFaqs = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/super-admin/faqs", {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs || []);
      }
    } catch (err) {
      console.error("Failed to load FAQs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setQuestion("");
    setAnswer("");
    setCategory(selectedCategory !== "all" ? selectedCategory : "general");
    setCustomCategory("");
    setStatus("active");
    setOrder(faqs.length + 1);
    setError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: FaqItem) => {
    setEditingItem(item);
    setQuestion(item.question);
    setAnswer(item.answer);
    const isStandard = CATEGORIES.some((c) => c.id === item.category);
    if (isStandard) {
      setCategory(item.category);
      setCustomCategory("");
    } else {
      setCategory("other");
      setCustomCategory(item.category);
    }
    setStatus(item.status);
    setOrder(item.order || 0);
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const finalCategory =
      category === "other"
        ? (customCategory || "general").trim().toLowerCase()
        : category;

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        category: finalCategory,
        status,
        order: Number(order) || 0,
      };

      if (editingItem) {
        // UPDATE existing
        const res = await fetch(`/api/super-admin/faqs/${editingItem._id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update FAQ");
        }

        setFaqs((prev) =>
          prev.map((item) =>
            item._id === editingItem._id ? data.faq : item
          )
        );
        setSuccessMsg("FAQ updated successfully!");
      } else {
        // CREATE new
        const res = await fetch("/api/super-admin/faqs", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create FAQ");
        }

        setFaqs((prev) => [data.faq, ...prev]);
        setSuccessMsg("FAQ created successfully!");
      }

      setModalOpen(false);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: FaqItem) => {
    const newStatus = item.status === "active" ? "inactive" : "active";
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/super-admin/faqs/${item._id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({
          question: item.question,
          answer: item.answer,
          category: item.category,
          status: newStatus,
          order: item.order,
        }),
      });

      if (res.ok) {
        setFaqs((prev) =>
          prev.map((f) => (f._id === item._id ? { ...f, status: newStatus } : f))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async (id: string, q: string) => {
    if (!confirm(`Are you sure you want to delete this FAQ?\n\n"${q}"`)) {
      return;
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/super-admin/faqs/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (res.ok) {
        setFaqs((prev) => prev.filter((item) => item._id !== id));
        setSuccessMsg("FAQ deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Filtered FAQs based on category & search query
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  // Statistics
  const activeCount = faqs.filter((f) => f.status === "active").length;
  const inactiveCount = faqs.filter((f) => f.status === "inactive").length;

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
            <HelpCircle className="w-5 h-5 text-amber-400" />
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage dynamic FAQs across the website (Homepage, Pricing, Occasion pages). Super admin changes reflect immediately.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Total FAQs</span>
          <span className="text-xl font-bold text-white mt-1 block">{faqs.length}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Active</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Inactive</span>
          <span className="text-xl font-bold text-zinc-500 mt-1 block">{inactiveCount}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Categories</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">
            {new Set(faqs.map((f) => f.category)).size}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === "all"
                ? faqs.length
                : faqs.filter((f) => f.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-zinc-950 font-bold"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-zinc-950/20 text-zinc-950 font-bold"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or answers..."
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

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-xs">
            No FAQs found for the current filter. Click &quot;Add New FAQ&quot; to create one.
          </div>
        ) : (
          filteredFaqs.map((item, index) => (
            <div
              key={item._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-zinc-700 transition"
            >
              {/* Question & Answer Content */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px]  text-zinc-500">
                    #{item.order ?? index + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-amber-400 border border-zinc-700">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition ${
                      item.status === "active"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60"
                        : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700"
                    }`}
                    title="Click to toggle active/inactive status"
                  >
                    {item.status === "active" ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {item.question}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {item.answer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(item._id, item.question)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/80 hover:text-rose-400 text-zinc-400 transition cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================================================================
          ADD / EDIT MODAL
         ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                {editingItem ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Question */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Question <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is a digital wedding invitation?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Answer */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Answer <span className="text-amber-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Clear and helpful explanation for customers..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 resize-y"
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="general">General & Homepage</option>
                    <option value="pricing">Pricing</option>
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="birthday">Birthday</option>
                    <option value="housewarming">House Warming</option>
                    <option value="reception">Reception</option>
                    <option value="other">Other (Custom)</option>
                  </select>
                </div>

                {category === "other" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Custom Category Key
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. corporate"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Display Order */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Display Order (1 = Top)
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Visibility Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="faq_status"
                      value="active"
                      checked={status === "active"}
                      onChange={() => setStatus("active")}
                      className="accent-amber-500"
                    />
                    <span>Active (Visible on public site)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="radio"
                      name="faq_status"
                      value="inactive"
                      checked={status === "inactive"}
                      onChange={() => setStatus("inactive")}
                      className="accent-amber-500"
                    />
                    <span>Inactive (Draft / Hidden)</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Update FAQ" : "Create FAQ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
