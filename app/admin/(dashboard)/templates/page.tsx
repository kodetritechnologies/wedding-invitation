"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  LayoutTemplate,
  Upload,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  Trash2,
  Loader2,
  ExternalLink,
  X,
  FileCode,
  Code2,
  Sparkles,
  ImageIcon,
  Camera,
} from "lucide-react";

interface CustomerField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
}

interface DesignSetting {
  key: string;
  label: string;
  type: string;
  default?: any;
}

interface TemplateItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  format?: "website" | "video" | "pdf";
  price?: number;
  isDefault?: boolean;
  status: "draft" | "published" | "unpublished" | "archived";
  manifest: {
    name: string;
    description?: string;
    entry: string;
    version?: string;
    customerFields: CustomerField[];
    designSettings: DesignSetting[];
  };
  designSettings: Record<string, any>;
  backupZipPath?: string;
  affectedWeddingsCount?: number;
  createdAt: string;
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categoriesList, setCategoriesList] = useState<{ _id?: string; name: string; slug: string }[]>([
    { name: "Wedding", slug: "wedding" },
    { name: "Engagement", slug: "engagement" },
    { name: "Birthday", slug: "birthday" },
    { name: "Anniversary", slug: "anniversary" },
    { name: "House Warming", slug: "housewarming" },
    { name: "Reception", slug: "reception" },
  ]);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateSlug, setNewTemplateSlug] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("wedding");
  const [newTemplateCustomCat, setNewTemplateCustomCat] = useState("");
  const [newTemplateFormat, setNewTemplateFormat] = useState<"website" | "video" | "pdf">("website");
  const [newTemplatePrice, setNewTemplatePrice] = useState<number | string>(999);
  const [newTemplateIsDefault, setNewTemplateIsDefault] = useState(false);
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [newThumbnailPreview, setNewThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnailId, setUploadingThumbnailId] = useState<string | null>(null);
  const createThumbnailRef = useRef<HTMLInputElement>(null);
  const [creating, setCreating] = useState(false);

  // Upload ZIP modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [uploadFormat, setUploadFormat] = useState<"website" | "video" | "pdf">("website");
  const [uploadIsDefault, setUploadIsDefault] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success?: boolean;
    message?: string;
    compatibility?: any;
    errors?: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview Modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);


  // Action status message
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch active categories from DB
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/public/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
            setCategoriesList(data.categories);
          }
        }
      } catch (err) {
        console.warn("Could not fetch categories:", err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [statusFilter, categoryFilter]);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 5000);
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let url = "/api/admin/templates";
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (search) params.append("search", search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { headers, credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setTemplates(data.templates || []);
      }
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName || !newTemplateSlug) return;
    setCreating(true);

    try {
      const finalCategory =
        newTemplateCategory === "other"
          ? (newTemplateCustomCat || "wedding").trim().toLowerCase()
          : newTemplateCategory;

      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: newTemplateName,
          slug: newTemplateSlug,
          description: newTemplateDesc,
          category: finalCategory,
          format: newTemplateFormat,
          price: Number(newTemplatePrice) || (newTemplateFormat === "video" ? 499 : newTemplateFormat === "pdf" ? 399 : 999),
          isDefault: newTemplateIsDefault,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const createdTmpl = data.template;
        // If thumbnail was chosen, upload it now
        if (newThumbnailFile && createdTmpl?._id) {
          try {
            const thumbData = new FormData();
            thumbData.append("file", newThumbnailFile);
            await fetch(`/api/admin/templates/${createdTmpl._id}/thumbnail`, {
              method: "POST",
              headers: { Authorization: token ? `Bearer ${token}` : "" },
              body: thumbData,
            });
          } catch (tErr) {
            console.warn("Failed to upload thumbnail upon creation:", tErr);
          }
        }

        showNotification("Template created! Now upload the ZIP package.");
        setCreateModalOpen(false);
        setNewTemplateName("");
        setNewTemplateSlug("");
        setNewTemplateDesc("");
        setNewTemplateCategory("wedding");
        setNewTemplateCustomCat("");
        setNewTemplateFormat("website");
        setNewTemplatePrice(999);
        setNewTemplateIsDefault(false);
        setNewThumbnailFile(null);
        setNewThumbnailPreview(null);
        fetchTemplates();
        // Open upload modal right away
        setSelectedTemplate(data.template);
        setUploadFormat(newTemplateFormat);
        setUploadIsDefault(newTemplateIsDefault);
        setUploadModalOpen(true);
      } else {
        showNotification(data.error || "Failed to create template", "error");
      }
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleUploadZip = async () => {
    if (!selectedTemplate || !zipFile) return;
    setUploading(true);
    setUploadStatus(null);

    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const formData = new FormData();
      formData.append("file", zipFile);
      formData.append("format", uploadFormat);
      formData.append("isDefault", String(uploadIsDefault));

      const res = await fetch(`/api/admin/templates/${selectedTemplate._id}/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setUploadStatus({
          success: true,
          message: data.message,
          compatibility: data.compatibility,
        });
        showNotification("Template package uploaded and deployed successfully!");
        fetchTemplates();
      } else {
        setUploadStatus({
          success: false,
          message: data.error,
          errors: data.errors,
        });
        showNotification(data.error || "Upload failed", "error");
      }
    } catch (err: any) {
      setUploadStatus({ success: false, message: err.message });
      showNotification(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handlePublishToggle = async (template: TemplateItem) => {
    const isPublishing = template.status !== "published";
    const endpoint = isPublishing
      ? `/api/admin/templates/${template._id}/publish`
      : `/api/admin/templates/${template._id}/unpublish`;

    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        fetchTemplates();
      } else {
        showNotification(data.error, "error");
      }
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  const handleRollback = async (template: TemplateItem) => {
    if (!confirm(`Are you sure you want to rollback '${template.name}' to the previous working package?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch(`/api/admin/templates/${template._id}/restore-backup`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        fetchTemplates();
      } else {
        showNotification(data.error, "error");
      }
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };

  const handleSetDefault = async (template: TemplateItem) => {
    setSettingDefaultId(template._id);
    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch(`/api/admin/templates/${template._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`'${template.name}' is now the Default Theme! Hero section will show this live demo.`);
        setTemplates((prev) =>
          prev.map((t) => ({
            ...t,
            isDefault: t._id === template._id,
          }))
        );
      } else {
        showNotification(data.error || "Failed to set default template", "error");
      }
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleThumbnailUpload = async (templateId: string, file: File) => {
    setUploadingThumbnailId(templateId);
    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/templates/${templateId}/thumbnail`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Template featured image/thumbnail updated successfully!");
        setTemplates((prev) =>
          prev.map((t) => (t._id === templateId ? { ...t, thumbnail: data.thumbnail } : t))
        );
      } else {
        showNotification(data.error || "Failed to upload thumbnail", "error");
      }
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setUploadingThumbnailId(null);
    }
  };

  const handleDeleteTemplate = async (template: TemplateItem) => {
    const affected = template.affectedWeddingsCount || 0;
    let promptMsg = `Are you sure you want to permanently delete template '${template.name}'? All files will be removed.`;
    if (affected > 0) {
      promptMsg = `WARNING: This template is used by ${affected} active customer wedding(s)!\n\nAre you sure you want to permanently delete it?`;
    }

    if (!confirm(promptMsg)) return;

    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const url = `/api/admin/templates/${template._id}?force=true`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        fetchTemplates();
      } else {
        showNotification(data.error, "error");
      }
    } catch (err: any) {
      showNotification(err.message, "error");
    }
  };


  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <LayoutTemplate className="w-6 h-6 text-amber-500" />
            Master Template Engine
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Centralized theme management, ZIP packages, dynamic manifest forms, and global CSS updates.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Master Template</span>
        </button>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            actionMessage.type === "success"
              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
              : "bg-rose-950/80 text-rose-300 border border-rose-800"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates by name, slug or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchTemplates()}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition"
            />
          </div>
          <div className="flex gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl">
            {["all", "published", "draft", "unpublished"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition cursor-pointer font-medium ${
                  statusFilter === status
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[10px] text-zinc-500 font-medium mr-0.5 shrink-0 uppercase tracking-wider">Category:</span>
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
              categoryFilter === "all"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-xs"
                : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            All Categories
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategoryFilter(cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 capitalize ${
                categoryFilter === cat.slug
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-xs"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-2" />
          <span className="text-xs">Loading master templates...</span>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-xl p-8">
          <LayoutTemplate className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-300">No templates found</p>
          <p className="text-xs text-zinc-500 mt-1">Upload a ZIP package with manifest.json to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((template) => {
            return (
              <div
                key={template._id}
                className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/80 hover:shadow-xl hover:shadow-black/20 transition-all duration-200 group"
              >
                <div>
                  {/* Thumbnail / Featured Image with 1-Click Upload */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3.5 bg-zinc-950 border border-zinc-800 flex items-center justify-center group/thumb">
                    {template.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover object-center group-hover/thumb:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-600 gap-1.5 p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-zinc-700" />
                        <span className="text-[11px] text-zinc-500 font-medium">No Featured Image</span>
                      </div>
                    )}

                    {/* Floating Badges over Image */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-black/80 text-zinc-200 border border-white/10 backdrop-blur-xs">
                        {template.format === "video" ? "▶ Video" : template.format === "pdf" ? "📄 PDF" : "🌐 Website"}
                      </span>
                      {template.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-400 to-yellow-400 text-black shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          Hero Demo
                        </span>
                      )}
                    </div>

                    {/* Upload / Replace Thumbnail Button */}
                    <label className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-medium border border-white/20 backdrop-blur-xs shadow-md transition-all cursor-pointer opacity-90 group-hover/thumb:opacity-100">
                      {uploadingThumbnailId === template._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      ) : (
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{template.thumbnail ? "Change Image" : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingThumbnailId === template._id}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleThumbnailUpload(template._id, f);
                        }}
                      />
                    </label>
                  </div>

                  {/* Header: Name + Category + Status Badge + Single Delete Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-white tracking-tight truncate">
                          {template.name}
                        </h3>
                        {/* Format Badge */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                          {template.format === "video" ? "▶ Video" : template.format === "pdf" ? "📄 PDF" : "🌐 Website"}
                        </span>
                        {/* Premium Category Badge */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-amber-500/10 text-amber-300 border border-amber-500/25">
                          <span className="w-1 h-1 rounded-full bg-amber-400/80" />
                          {template.category || "wedding"}
                        </span>
                        {/* Default Demo Theme Badge */}
                        {template.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-500/20 to-yellow-500/25 text-amber-300 border border-amber-400/50 shadow-[0_0_8px_rgba(251,191,36,0.2)]">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Default Demo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-zinc-500 ">
                          /{template.slug}
                        </p>
                        <span className="text-[11px] text-amber-400 font-medium">
                          • ₹{template.price || (template.format === "video" ? 499 : template.format === "pdf" ? 399 : 999)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Premium Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all ${
                          template.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.12)]"
                            : template.status === "draft"
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/25 shadow-[0_0_8px_rgba(245,158,11,0.12)]"
                            : template.status === "unpublished"
                            ? "bg-zinc-800/80 text-zinc-400 border border-zinc-700/60"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/25 shadow-[0_0_8px_rgba(244,63,94,0.12)]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            template.status === "published"
                              ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse"
                              : template.status === "draft"
                              ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]"
                              : template.status === "unpublished"
                              ? "bg-zinc-400"
                              : "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.9)]"
                          }`}
                        />
                        {template.status}
                      </span>

                      {/* Single Delete Button */}
                      <button
                        onClick={() => handleDeleteTemplate(template)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
                    {template.description || "No description provided."}
                  </p>
                </div>

                {/* Actions Grid */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-2">
                  {/* Dedicated Code & Visual Editor (Opens in new tab) */}
                  <Link
                    href={`/admin/templates/${template._id}/editor`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-600/15 hover:from-amber-500/25 hover:to-amber-600/25 text-amber-300 text-xs font-semibold border border-amber-500/30 hover:border-amber-500/50 transition shadow-xs cursor-pointer group/btn"
                  >
                    <Code2 className="w-3.5 h-3.5 text-amber-400 group-hover/btn:scale-110 transition-transform" />
                    <span>Open Code &amp; Theme Editor</span>
                    <ExternalLink className="w-3 h-3 text-amber-400/70 ml-0.5" />
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Live Preview Button */}
                    <button
                      onClick={() => {
                        setPreviewTemplate(template);
                        setPreviewModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/40 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Preview</span>
                    </button>

                    {/* Upload ZIP Package */}
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setUploadFormat(template.format || "website");
                        setUploadIsDefault(Boolean(template.isDefault));
                        setZipFile(null);
                        setUploadStatus(null);
                        setUploadModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/40 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Update ZIP</span>
                    </button>
                  </div>

                  {/* Publish / Unpublish Toggle */}
                  <button
                    onClick={() => handlePublishToggle(template)}
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
                      template.status === "published"
                        ? "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/40"
                        : "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    <span>{template.status === "published" ? "Unpublish Template" : "Publish Template"}</span>
                  </button>

                  {/* Set as Default Hero Demo Button */}
                  <button
                    type="button"
                    onClick={() => handleSetDefault(template)}
                    disabled={template.isDefault || settingDefaultId === template._id}
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
                      template.isDefault
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/40 cursor-default shadow-xs"
                        : "bg-zinc-800/40 hover:bg-amber-500/10 text-zinc-400 hover:text-amber-300 border border-zinc-800 hover:border-amber-500/30"
                    }`}
                  >
                    {settingDefaultId === template._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{template.isDefault ? "✦ Default Hero Demo Theme" : "Set as Default Hero Demo"}</span>
                  </button>

                  {/* Rollback button if backup exists */}
                  {template.backupZipPath && (
                    <button
                      onClick={() => handleRollback(template)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-amber-400/90 text-[11px] font-medium border border-amber-500/20 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rollback to Previous Package</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: CREATE NEW TEMPLATE
         ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-white tracking-tight mb-1">
              Create Master Template
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Enter template details. Next you will be prompted to upload the HTML/CSS/JS ZIP package.
            </p>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Palace Wedding"
                  value={newTemplateName}
                  onChange={(e) => {
                    setNewTemplateName(e.target.value);
                    if (!newTemplateSlug) {
                      setNewTemplateSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-")
                      );
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  URL Slug * (Unique)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. royal-palace-wedding"
                  value={newTemplateSlug}
                  onChange={(e) => setNewTemplateSlug(e.target.value.toLowerCase())}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs  text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Template Type / Format */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Template Type / Format *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "website", label: "Website", icon: "🌐", desc: "Interactive RSVP & Maps" },
                    { id: "video", label: "Video", icon: "▶", desc: "Animated MP4 / Video" },
                    { id: "pdf", label: "PDF", icon: "📄", desc: "Digital E-Card / PDF" },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => {
                        setNewTemplateFormat(fmt.id as "website" | "video" | "pdf");
                        if (fmt.id === "website") setNewTemplatePrice(999);
                        else if (fmt.id === "video") setNewTemplatePrice(499);
                        else setNewTemplatePrice(399);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        newTemplateFormat === fmt.id
                          ? "bg-amber-500/15 border-amber-500/50 text-white shadow-xs"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <span>{fmt.icon}</span>
                        <span className={newTemplateFormat === fmt.id ? "text-amber-400" : ""}>{fmt.label}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1 leading-tight">
                        {fmt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Starting Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 499 or 999"
                  value={newTemplatePrice}
                  onChange={(e) => setNewTemplatePrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Service Category * (Where this template will appear)
                </label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 capitalize"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.slug} value={cat.slug} className="bg-zinc-900 text-white">
                      {cat.name} ({cat.slug})
                    </option>
                  ))}
                  <option value="other" className="bg-zinc-900 text-white">
                    + Custom Category Slug
                  </option>
                </select>
                {newTemplateCategory === "other" && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom category slug (e.g. sangeet, haldi, birthday)"
                    value={newTemplateCustomCat}
                    onChange={(e) => setNewTemplateCustomCat(e.target.value)}
                    className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs  text-white focus:outline-none focus:border-amber-500"
                  />
                )}
                <p className="text-[11px] text-zinc-500 mt-1">
                  This template will be displayed on the public page for this service (e.g. /{newTemplateCategory === "other" ? newTemplateCustomCat || "custom" : newTemplateCategory}).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe theme style, animations, suitable traditions..."
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Featured Image / Thumbnail Upload */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Featured Image / Thumbnail (Card &amp; Showcase)
                </label>
                <div
                  onClick={() => createThumbnailRef.current?.click()}
                  className="border-2 border-dashed border-zinc-800 hover:border-amber-500/60 rounded-xl p-3.5 text-center cursor-pointer bg-zinc-950/60 transition flex items-center justify-center gap-3"
                >
                  {newThumbnailPreview ? (
                    <div className="flex items-center gap-3 w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={newThumbnailPreview}
                        alt="Preview"
                        className="w-14 h-14 rounded-lg object-cover border border-zinc-700"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs text-white font-medium truncate">{newThumbnailFile?.name}</p>
                        <p className="text-[11px] text-emerald-400">Image selected &bull; Click to change</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewThumbnailFile(null);
                          setNewThumbnailPreview(null);
                        }}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 py-1 text-zinc-400">
                      <ImageIcon className="w-5 h-5 text-amber-500 shrink-0" />
                      <span className="text-xs">Click to upload Thumbnail image (PNG, JPG, WEBP)</span>
                    </div>
                  )}
                  <input
                    ref={createThumbnailRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setNewThumbnailFile(f);
                        setNewThumbnailPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Default Theme Checkbox */}
              <div className="flex items-start gap-3 p-3 bg-zinc-950/80 border border-amber-500/30 rounded-xl">
                <input
                  type="checkbox"
                  id="newTemplateIsDefault"
                  checked={newTemplateIsDefault}
                  onChange={(e) => setNewTemplateIsDefault(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700 cursor-pointer"
                />
                <label htmlFor="newTemplateIsDefault" className="text-xs text-zinc-300 cursor-pointer">
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Set as Default Theme (Hero Section Live Demo)
                  </span>
                  <span className="block text-[11px] text-zinc-400 mt-0.5">
                    Frontend ke Hero section me &ldquo;Watch Demo&rdquo; button par iska live demo dynamic link ho jayega.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black flex items-center gap-1.5"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Continue to Upload ZIP</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: UPLOAD ZIP PACKAGE
         ========================================================================= */}
      {uploadModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-white tracking-tight mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-500" />
              Upload Template Package
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Deploying package for <span className="text-amber-400 font-semibold">{selectedTemplate.name}</span>.
              The ZIP must include <code className="text-zinc-200">manifest.json</code> and <code className="text-zinc-200">index.html</code>.
            </p>

            {/* Warning if existing weddings will be affected */}
            {(selectedTemplate.affectedWeddingsCount || 0) > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Global Update Notice:</p>
                  <p className="text-zinc-400 mt-0.5">
                    This template is actively used by <strong className="text-amber-300">{selectedTemplate.affectedWeddingsCount}</strong> live customer website(s).
                    Their design will update automatically upon publishing. Customer data will remain 100% intact.
                  </p>
                </div>
              </div>
            )}

            {/* Template Type / Format Confirmation */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Template Type / Format *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "website", label: "Website", icon: "🌐" },
                  { id: "video", label: "Video", icon: "▶" },
                  { id: "pdf", label: "PDF", icon: "📄" },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setUploadFormat(fmt.id as "website" | "video" | "pdf")}
                    className={`py-2 px-3 rounded-lg border text-center transition cursor-pointer font-medium text-xs flex items-center justify-center gap-1.5 ${
                      uploadFormat === fmt.id
                        ? "bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-xs"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    <span>{fmt.icon}</span>
                    <span>{fmt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Set as Default Theme Checkbox */}
            <div className="mb-4 flex items-start gap-3 p-3 bg-zinc-950/80 border border-amber-500/30 rounded-xl">
              <input
                type="checkbox"
                id="uploadIsDefault"
                checked={uploadIsDefault}
                onChange={(e) => setUploadIsDefault(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700 cursor-pointer"
              />
              <label htmlFor="uploadIsDefault" className="text-xs text-zinc-300 cursor-pointer">
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Set as Default Theme (Hero Section Live Demo)
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">
                  Isse select karne par frontend hero section me &ldquo;Watch Demo&rdquo; iss theme ka live demo dikhayega.
                </span>
              </label>
            </div>

            {/* Thumbnail / Featured Image in Modal 2 */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Featured Image / Thumbnail</span>
                {selectedTemplate.thumbnail && (
                  <span className="text-[11px] text-emerald-400">✓ Active Thumbnail</span>
                )}
              </label>
              <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                {selectedTemplate.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedTemplate.thumbnail}
                    alt={selectedTemplate.name}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-700 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-6 h-6 text-zinc-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium truncate">
                    {selectedTemplate.thumbnail ? "Thumbnail image is active" : "No image uploaded yet"}
                  </p>
                  <label className="inline-block mt-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 cursor-pointer">
                    {uploadingThumbnailId === selectedTemplate._id ? "Uploading image..." : "Upload / Replace Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingThumbnailId === selectedTemplate._id}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f && selectedTemplate) {
                          handleThumbnailUpload(selectedTemplate._id, f);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* File Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-amber-500 rounded-xl p-8 text-center cursor-pointer bg-zinc-950/40 transition"
            >
              <FileCode className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
              <p className="text-xs font-medium text-zinc-200">
                {zipFile ? zipFile.name : "Click to select or drop .zip file here"}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {zipFile
                  ? `${(zipFile.size / 1024 / 1024).toFixed(2)} MB selected`
                  : "Maximum 50MB. Allowed: HTML, CSS, JS, JSON, images, fonts, audio"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setZipFile(e.target.files[0]);
                }}
              />
            </div>

            {/* Status Feedback */}
            {uploadStatus && (
              <div
                className={`mt-4 p-3.5 rounded-lg text-xs ${
                  uploadStatus.success
                    ? "bg-emerald-950/60 border border-emerald-800 text-emerald-200"
                    : "bg-rose-950/60 border border-rose-800 text-rose-200"
                }`}
              >
                <p className="font-semibold">{uploadStatus.message}</p>
                {uploadStatus.compatibility && (
                  <div className="mt-2 text-[11px] text-zinc-300 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <span>Compatibility:</span>
                      {uploadStatus.compatibility.compatible ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Fully Compatible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> Breaking Changes Detected
                        </span>
                      )}
                    </p>
                    {uploadStatus.compatibility.breakingChanges?.length > 0 && (
                      <ul className="list-disc pl-4 text-rose-300">
                        {uploadStatus.compatibility.breakingChanges.map((b: string, i: number) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                disabled={!zipFile || uploading}
                onClick={handleUploadZip}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center gap-1.5 cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating &amp; Deploying...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload &amp; Extract</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: LIVE PREVIEW
         ========================================================================= */}
      {previewModalOpen && previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col p-4 sm:p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-t-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Live Preview: {previewTemplate.name}
                </h3>
                <span className="text-[11px] text-zinc-400">
                  Rendered with sample couple data &amp; active CSS variables
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/api/public/templates/${previewTemplate.slug}/preview`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 px-2.5 py-1 bg-zinc-800 rounded"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in New Tab</span>
              </a>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-zinc-950 rounded-b-xl overflow-hidden border-x border-b border-zinc-800">
            <iframe
              src={`/api/public/templates/${previewTemplate.slug}/preview`}
              className="w-full h-full border-0"
              title="Template Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}


    </div>
  );
}
