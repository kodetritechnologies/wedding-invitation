"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Compass,
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
  RefreshCw,
} from "lucide-react";

interface SubNavItem {
  label: string;
  href: string;
  order?: number;
}

interface NavItem {
  _id: string;
  label: string;
  href: string;
  type: "link" | "dropdown";
  categorySlug?: string;
  dropdownItems?: SubNavItem[];
  openInNewTab: boolean;
  order: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
  href: string;
}

export default function SuperAdminNavigationPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [type, setType] = useState<"link" | "dropdown">("link");
  const [categorySlug, setCategorySlug] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [order, setOrder] = useState(0);

  // Sub-items for dropdown
  const [dropdownItems, setDropdownItems] = useState<SubNavItem[]>([]);
  const [newSubLabel, setNewSubLabel] = useState("");
  const [newSubHref, setNewSubHref] = useState("");

  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchNavAndCategories = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const [navRes, catRes] = await Promise.all([
        fetch("/api/super-admin/navigation", { headers, credentials: "include" }),
        fetch("/api/super-admin/categories", { headers, credentials: "include" }),
      ]);

      if (navRes.ok) {
        const navData = await navRes.json();
        setNavItems(navData.navItems || []);
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error("Failed to load navigation items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavAndCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setLabel("");
    setHref("");
    setType("link");
    setCategorySlug("");
    setOpenInNewTab(false);
    setStatus("active");
    setOrder(navItems.length + 1);
    setDropdownItems([]);
    setNewSubLabel("");
    setNewSubHref("");
    setError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: NavItem) => {
    setEditingItem(item);
    setLabel(item.label);
    setHref(item.href || "/");
    setType(item.type || "link");
    setCategorySlug(item.categorySlug || "");
    setOpenInNewTab(Boolean(item.openInNewTab));
    setStatus(item.status);
    setOrder(item.order || 0);
    setDropdownItems(item.dropdownItems ? [...item.dropdownItems] : []);
    setNewSubLabel("");
    setNewSubHref("");
    setError("");
    setModalOpen(true);
  };

  const handleSelectCategory = (slug: string) => {
    setCategorySlug(slug);
    if (!slug) return;
    const found = categories.find((c) => c.slug === slug);
    if (found) {
      setLabel(found.name);
      setHref(found.href || `/${found.slug}`);
    }
  };

  const handleAddSubItem = () => {
    if (!newSubLabel.trim() || !newSubHref.trim()) return;
    setDropdownItems((prev) => [
      ...prev,
      {
        label: newSubLabel.trim(),
        href: newSubHref.trim(),
        order: prev.length + 1,
      },
    ]);
    setNewSubLabel("");
    setNewSubHref("");
  };

  const handleRemoveSubItem = (idx: number) => {
    setDropdownItems((prev) => prev.filter((_, i) => i !== idx));
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
        label: label.trim(),
        href: href.trim() || "/",
        type,
        categorySlug: categorySlug.trim(),
        dropdownItems: type === "dropdown" ? dropdownItems : [],
        openInNewTab,
        status,
        order: Number(order) || 0,
      };

      if (editingItem) {
        // UPDATE
        const res = await fetch(`/api/super-admin/navigation/${editingItem._id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update navigation item");
        }

        setNavItems((prev) =>
          prev.map((item) =>
            item._id === editingItem._id ? data.navItem : item
          )
        );
        setSuccessMsg("Navigation item updated successfully!");
      } else {
        // CREATE
        const res = await fetch("/api/super-admin/navigation", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create navigation item");
        }

        setNavItems((prev) => [data.navItem, ...prev]);
        setSuccessMsg("Navigation item created successfully!");
      }

      setModalOpen(false);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving navigation item");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: NavItem) => {
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

      const res = await fetch(`/api/super-admin/navigation/${item._id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({
          label: item.label,
          href: item.href,
          type: item.type,
          categorySlug: item.categorySlug,
          dropdownItems: item.dropdownItems,
          openInNewTab: item.openInNewTab,
          status: newStatus,
          order: item.order,
        }),
      });

      if (res.ok) {
        setNavItems((prev) =>
          prev.map((n) => (n._id === item._id ? { ...n, status: newStatus } : n))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async (id: string, itemLabel: string) => {
    if (!confirm(`Are you sure you want to delete navigation item "${itemLabel}"?`)) {
      return;
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/super-admin/navigation/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      if (res.ok) {
        setNavItems((prev) => prev.filter((item) => item._id !== id));
        setSuccessMsg("Navigation item deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSyncCategories = async () => {
    setSyncing(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/super-admin/navigation/sync-categories", {
        method: "POST",
        headers,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNavItems(data.navItems || []);
        setSuccessMsg(data.message || "Categories synced to navigation!");
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        alert(data.error || "Failed to sync categories");
      }
    } catch (err) {
      console.error("Sync failed", err);
    } finally {
      setSyncing(false);
    }
  };

  const filteredNavItems = useMemo(() => {
    return navItems.filter((n) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.label.toLowerCase().includes(q) ||
        n.href.toLowerCase().includes(q) ||
        n.categorySlug?.toLowerCase().includes(q)
      );
    });
  }, [navItems, searchQuery]);

  const activeCount = navItems.filter((n) => n.status === "active").length;
  const inactiveCount = navItems.filter((n) => n.status === "inactive").length;
  const dropdownCount = navItems.filter((n) => n.type === "dropdown").length;

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
            <Compass className="w-5 h-5 text-amber-400" />
            Header Navigation Menu
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage links and dropdown menus displayed on the public website header. Changes reflect dynamically in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncCategories}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700 transition cursor-pointer disabled:opacity-50"
            title="Import active categories as navigation links"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${syncing ? "animate-spin" : ""}`} />
            <span>Sync from Categories</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Nav Item</span>
          </button>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Total Nav Items</span>
          <span className="text-xl font-bold text-white mt-1 block">{navItems.length}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Active (Visible)</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Inactive</span>
          <span className="text-xl font-bold text-zinc-500 mt-1 block">{inactiveCount}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-xs text-zinc-400 block font-medium">Dropdown Menus</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">{dropdownCount}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative min-w-[260px] max-w-sm w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search navigation by label or URL..."
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

      {/* Nav Items List */}
      <div className="space-y-3">
        {filteredNavItems.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-xs">
            No navigation items found. Click &quot;Add Nav Item&quot; or &quot;Sync from Categories&quot;.
          </div>
        ) : (
          filteredNavItems.map((item, index) => (
            <div
              key={item._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition"
            >
              {/* Item Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">
                    #{item.order ?? index + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.type === "dropdown"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                    }`}
                  >
                    {item.type === "dropdown" ? "Dropdown" : "Link"}
                  </span>

                  {item.categorySlug && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-amber-400 border border-zinc-700">
                      Category: {item.categorySlug}
                    </span>
                  )}

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

                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.label}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {item.href}
                  </span>
                </div>

                {/* Sub-items preview if Dropdown */}
                {item.type === "dropdown" && Array.isArray(item.dropdownItems) && item.dropdownItems.length > 0 && (
                  <div className="pt-1.5 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-zinc-500 mr-1">Sub-links:</span>
                    {item.dropdownItems.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] bg-zinc-950/80 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <span>{sub.label}</span>
                        <span className="text-[10px] text-zinc-500">({sub.href})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  title="Edit Navigation Item"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(item._id, item.label)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/80 hover:text-rose-400 text-zinc-400 transition cursor-pointer"
                  title="Delete Navigation Item"
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
                <Compass className="w-4 h-4 text-amber-500" />
                {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
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

              {/* Quick Pick from Category */}
              <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                <label className="text-xs font-semibold text-amber-400 block">
                  Quick Select from Category (Optional)
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => handleSelectCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-500"
                >
                  <option value="">-- Choose Category or type custom below --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.name} ({c.href || `/${c.slug}`})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-zinc-500 block">
                  Selecting a category will automatically set the Label and Route URL.
                </span>
              </div>

              {/* Label & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Menu Label <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engagement"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Target URL / Route <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /engagement"
                    value={href}
                    onChange={(e) => setHref(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Type Selection (Single Link vs Dropdown) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Navigation Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="nav_type"
                      value="link"
                      checked={type === "link"}
                      onChange={() => setType("link")}
                      className="accent-amber-500"
                    />
                    <span>Single Link</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="nav_type"
                      value="dropdown"
                      checked={type === "dropdown"}
                      onChange={() => setType("dropdown")}
                      className="accent-amber-500"
                    />
                    <span>Dropdown Menu (Sub-links)</span>
                  </label>
                </div>
              </div>

              {/* Sub-items if Dropdown */}
              {type === "dropdown" && (
                <div className="space-y-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-amber-400 block">
                      Dropdown Sub-items ({dropdownItems.length})
                    </label>
                  </div>

                  {dropdownItems.length > 0 && (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {dropdownItems.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-semibold text-white">{sub.label}</span>
                            <span className="text-[11px] font-mono text-zinc-400">({sub.href})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubItem(sIdx)}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Sub-item Row */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-zinc-800/80">
                    <input
                      type="text"
                      placeholder="Sub-item Label (e.g. Video Invitation)"
                      value={newSubLabel}
                      onChange={(e) => setNewSubLabel(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Sub-item URL (e.g. /wedding/video)"
                      value={newSubHref}
                      onChange={(e) => setNewSubHref(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubItem}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold flex items-center gap-1 justify-center shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Display Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Display Order (1 = Leftmost)
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
                  <span>{editingItem ? "Update Item" : "Create Item"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
