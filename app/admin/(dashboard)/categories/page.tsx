"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FolderTree,
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
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { GiRing, GiDiamondRing, GiFireBowl } from "react-icons/gi";
import { MdCake, MdHome, MdCelebration, MdCardGiftcard, MdMusicNote, MdAutoAwesome } from "react-icons/md";
import { FaHeart, FaWineGlassAlt, FaBaby } from "react-icons/fa";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  subtitle: string;
  href: string;
  icon: string;
  imageUrl?: string;
  status: "active" | "inactive";
  order: number;
  createdAt: string;
}

const AVAILABLE_ICONS: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "rings", label: "Wedding Rings", icon: GiRing },
  { id: "diamond", label: "Engagement Ring", icon: GiDiamondRing },
  { id: "cake", label: "Birthday Cake", icon: MdCake },
  { id: "heart", label: "Anniversary Heart", icon: FaHeart },
  { id: "home", label: "House Warming", icon: MdHome },
  { id: "glass", label: "Reception Cheers", icon: FaWineGlassAlt },
  { id: "baby", label: "Baby Shower", icon: FaBaby },
  { id: "flame", label: "Puja / Hawan", icon: GiFireBowl },
  { id: "party", label: "Party / Celebration", icon: MdCelebration },
  { id: "gift", label: "Gift / Event", icon: MdCardGiftcard },
  { id: "music", label: "Sangeet / Music", icon: MdMusicNote },
  { id: "sparkles", label: "Sparkles / Royal", icon: MdAutoAwesome },
];

export default function SuperAdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [href, setHref] = useState("");
  const [icon, setIcon] = useState("sparkles");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [order, setOrder] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchCategories = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/super-admin/categories", {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName("");
    setSlug("");
    setSubtitle("");
    setHref("");
    setIcon("sparkles");
    setImageUrl("");
    setStatus("active");
    setOrder(categories.length + 1);
    setError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: CategoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setSlug(item.slug);
    setSubtitle(item.subtitle || "");
    setHref(item.href || `/templates?category=${item.slug}`);
    setIcon(item.icon || "sparkles");
    setImageUrl(item.imageUrl || "");
    setStatus(item.status);
    setOrder(item.order || 0);
    setError("");
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingItem) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(autoSlug);
      setHref(`/templates?category=${autoSlug}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

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
        name: name.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim(),
        href: href.trim() || `/templates?category=${slug.trim()}`,
        icon: icon.trim(),
        imageUrl: imageUrl.trim(),
        status,
        order: Number(order) || 0,
      };

      if (editingItem) {
        // UPDATE existing
        const res = await fetch(`/api/super-admin/categories/${editingItem._id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update category");
        }

        setCategories((prev) =>
          prev.map((item) =>
            item._id === editingItem._id ? data.category : item
          )
        );
        setSuccessMsg("Category updated successfully!");
      } else {
        // CREATE new
        const res = await fetch("/api/super-admin/categories", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create category");
        }

        setCategories((prev) => [data.category, ...prev]);
        setSuccessMsg("Category created successfully!");
      }

      setModalOpen(false);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving category");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: CategoryItem) => {
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

      const res = await fetch(`/api/super-admin/categories/${item._id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({
          name: item.name,
          slug: item.slug,
          subtitle: item.subtitle,
          href: item.href,
          icon: item.icon,
          imageUrl: item.imageUrl,
          status: newStatus,
          order: item.order,
        }),
      });

      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c._id === item._id ? { ...c, status: newStatus } : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/super-admin/categories/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((item) => item._id !== id));
        setSuccessMsg("Category deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q)
      );
    });
  }, [categories, searchQuery]);

  const activeCount = categories.filter((c) => c.status === "active").length;
  const inactiveCount = categories.filter((c) => c.status === "inactive").length;

  // Icon preview helper
  const renderIconPreview = (iconKey: string) => {
    const found = AVAILABLE_ICONS.find((i) => i.id === iconKey);
    if (found) {
      const Icon = found.icon;
      return <Icon className="w-5 h-5 text-amber-400" />;
    }
    return <Sparkles className="w-5 h-5 text-amber-400" />;
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
            <FolderTree className="w-5 h-5 text-amber-400" />
            Celebration Categories
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage the categories shown in &quot;Invitations for Every Celebration&quot; on the public Homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Total Categories</span>
          <span className="text-xl font-bold text-white mt-1 block">{categories.length}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Active (Visible)</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Inactive (Hidden)</span>
          <span className="text-xl font-bold text-zinc-500 mt-1 block">{inactiveCount}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative min-w-[260px] max-w-sm w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name, slug or subtitle..."
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-xs">
            No categories found. Click &quot;Add New Category&quot; to create one.
          </div>
        ) : (
          filteredCategories.map((item, index) => (
            <div
              key={item._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Sequence Order & Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500">
                      #{item.order ?? index + 1}
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

                  {/* Icon Preview */}
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    {renderIconPreview(item.icon)}
                  </div>
                </div>

                {/* Name & Tagline */}
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {item.subtitle || "No subtitle"}
                  </p>
                </div>

                {/* Target Link & Slug */}
                <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                  <span className="bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800 text-amber-400 flex items-center gap-1 truncate max-w-full">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.href || `/${item.slug}`}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Slug: {item.slug}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="p-1 rounded-lg bg-zinc-800 hover:bg-rose-950/80 hover:text-rose-400 text-zinc-400 transition cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-amber-500" />
                {editingItem ? "Edit Category" : "Add New Category"}
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

              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Category Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baby Shower"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    URL Slug <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. baby-shower"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Subtitle / Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Subtitle / Short Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bless the little one / For your big day"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Target Link (href) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Target Link (HREF)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /templates?category=wedding or /templates?category=baby-shower"
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block">
                  Where users are redirected when clicking this card on the homepage.
                </span>
              </div>

              {/* Icon Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Card Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {AVAILABLE_ICONS.map((i) => {
                    const isSelected = icon === i.id;
                    const IconComp = i.icon;
                    return (
                      <button
                        type="button"
                        key={i.id}
                        onClick={() => setIcon(i.id)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                        title={i.label}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[9px] truncate w-full text-center">
                          {i.label.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Display Order (1 = First)
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Visibility Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
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
                  <span>{editingItem ? "Update Category" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
