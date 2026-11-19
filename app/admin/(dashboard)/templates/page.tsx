"use client";

import { useEffect, useState, useRef } from "react";
import {
  LayoutTemplate,
  Upload,
  Plus,
  Play,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  Trash2,
  Loader2,
  ExternalLink,
  Layers,
  Sparkles,
  Palette,
  X,
  FileCode,
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

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateSlug, setNewTemplateSlug] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [creating, setCreating] = useState(false);

  // Upload ZIP modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
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

  // Design Settings Modal
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [activeSettingsTemplate, setActiveSettingsTemplate] = useState<TemplateItem | null>(null);
  const [customSettings, setCustomSettings] = useState<Record<string, any>>({});
  const [savingSettings, setSavingSettings] = useState(false);

  // Action status message
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [statusFilter]);

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
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Template created! Now upload the ZIP package.");
        setCreateModalOpen(false);
        setNewTemplateName("");
        setNewTemplateSlug("");
        setNewTemplateDesc("");
        fetchTemplates();
        // Open upload modal right away
        setSelectedTemplate(data.template);
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

  const openSettingsModal = (template: TemplateItem) => {
    setActiveSettingsTemplate(template);
    // Initialize current settings
    const current: Record<string, any> = {};
    for (const def of template.manifest?.designSettings || []) {
      current[def.key] =
        template.designSettings?.[def.key] !== undefined
          ? template.designSettings[def.key]
          : def.default || "";
    }
    setCustomSettings(current);
    setSettingsModalOpen(true);
  };

  const handleSaveSettings = async () => {
    if (!activeSettingsTemplate) return;
    setSavingSettings(true);

    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch(`/api/admin/templates/${activeSettingsTemplate._id}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ designSettings: customSettings }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        setSettingsModalOpen(false);
        fetchTemplates();
      } else {
        showNotification(data.error, "error");
      }
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setSavingSettings(false);
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates by name, slug or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTemplates()}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "published", "draft", "unpublished"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition cursor-pointer ${
                statusFilter === status
                  ? "bg-zinc-800 text-amber-400 border border-amber-500/40 font-medium"
                  : "bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-white"
              }`}
            >
              {status}
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
            const hasManifest = Boolean(template.manifest && template.manifest.customerFields?.length);
            const customerFieldsCount = template.manifest?.customerFields?.length || 0;
            const designSettingsCount = template.manifest?.designSettings?.length || 0;

            return (
              <div
                key={template._id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition"
              >
                <div>
                  {/* Header: Name + Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-white tracking-tight">
                        {template.name}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        /{template.slug}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        template.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : template.status === "draft"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                          : template.status === "unpublished"
                          ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {template.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 mt-2.5 line-clamp-2">
                    {template.description || "No description provided."}
                  </p>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-800/80 text-center">
                    <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 block uppercase">Linked Sites</span>
                      <span className="text-xs font-bold text-amber-400">
                        {template.affectedWeddingsCount || 0}
                      </span>
                    </div>

                    <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 block uppercase">Fields</span>
                      <span className="text-xs font-bold text-white">
                        {customerFieldsCount}
                      </span>
                    </div>

                    <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 block uppercase">CSS Vars</span>
                      <span className="text-xs font-bold text-white">
                        {designSettingsCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Live Preview Button */}
                    <button
                      onClick={() => {
                        setPreviewTemplate(template);
                        setPreviewModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Preview</span>
                    </button>

                    {/* Design Settings Button */}
                    <button
                      onClick={() => openSettingsModal(template)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5 text-sky-400" />
                      <span>Styling</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Upload ZIP Package */}
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setZipFile(null);
                        setUploadStatus(null);
                        setUploadModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Update ZIP</span>
                    </button>

                    {/* Publish / Unpublish Toggle */}
                    <button
                      onClick={() => handlePublishToggle(template)}
                      className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
                        template.status === "published"
                          ? "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"
                          : "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {template.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </div>

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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
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
                    <p>Compatibility: {uploadStatus.compatibility.compatible ? "✅ Fully Compatible" : "⚠️ Breaking Changes Detected"}</p>
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

      {/* =========================================================================
          MODAL 4: VISUAL DESIGN SETTINGS (CSS Variables)
         ========================================================================= */}
      {settingsModalOpen && activeSettingsTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSettingsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-white tracking-tight mb-1 flex items-center gap-2">
              <Palette className="w-5 h-5 text-sky-400" />
              Visual Design Settings
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Edit global CSS variables for <strong className="text-white">{activeSettingsTemplate.name}</strong>.
              These changes apply dynamically across all linked customer cards.
            </p>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {activeSettingsTemplate.manifest?.designSettings?.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-6 text-center">
                  No visual design settings declared in this template&apos;s manifest.json.
                </p>
              ) : (
                activeSettingsTemplate.manifest.designSettings.map((setting) => (
                  <div key={setting.key} className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-300">
                      {setting.label}{" "}
                      <span className="text-[10px] text-zinc-500 font-mono">
                        (--{setting.key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()})
                      </span>
                    </label>

                    {setting.type === "color" ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customSettings[setting.key] || "#000000"}
                          onChange={(e) =>
                            setCustomSettings({
                              ...customSettings,
                              [setting.key]: e.target.value,
                            })
                          }
                          className="w-10 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customSettings[setting.key] || ""}
                          onChange={(e) =>
                            setCustomSettings({
                              ...customSettings,
                              [setting.key]: e.target.value,
                            })
                          }
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200"
                        />
                      </div>
                    ) : setting.type === "font" ? (
                      <input
                        type="text"
                        placeholder="e.g. Playfair Display, Cinzel, Cormorant Garamond"
                        value={customSettings[setting.key] || ""}
                        onChange={(e) =>
                          setCustomSettings({
                            ...customSettings,
                            [setting.key]: e.target.value,
                          })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200"
                      />
                    ) : (
                      <input
                        type="text"
                        value={customSettings[setting.key] || ""}
                        onChange={(e) =>
                          setCustomSettings({
                            ...customSettings,
                            [setting.key]: e.target.value,
                          })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800 mt-4">
              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingSettings}
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5 cursor-pointer"
              >
                {savingSettings && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Design Overrides</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
