"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import {
  Palette,
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Save,
  Check,
  Loader2,
  Sparkles,
  Layers,
  Type,
  Maximize2,
  Eye,
  Sliders,
  AlertCircle,
  Code2,
  FileCode,
  FileText,
  FileJson,
  FolderOpen,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface DesignSettingDef {
  key: string;
  label: string;
  type: "color" | "font" | "text" | "image" | "select" | "number";
  default?: any;
  options?: string[];
}

interface TemplateFileItem {
  path: string;
  name: string;
  size: number;
  ext: string;
}

interface TemplateData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  status: string;
  manifest: {
    name: string;
    description?: string;
    entry: string;
    designSettings: DesignSettingDef[];
    customerFields: any[];
  };
  designSettings: Record<string, any>;
  affectedWeddingsCount?: number;
}

function getMonacoLanguage(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "html":
    case "htm":
      return "html";
    case "css":
      return "css";
    case "js":
    case "mjs":
      return "javascript";
    case "json":
      return "json";
    case "svg":
    case "xml":
      return "xml";
    default:
      return "plaintext";
  }
}

export default function TemplateEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Editor Mode: "code" (Full Code Editor) or "visual" (Design Sliders)
  const [editorMode, setEditorMode] = useState<"code" | "visual">("code");

  // Device Viewport: mobile (380px), tablet (768px), desktop (100%)
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet" | "desktop">("mobile");

  // ==========================================
  // CODE EDITOR STATE
  // ==========================================
  const [fileList, setFileList] = useState<TemplateFileItem[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string>("index.html");
  const [fileCode, setFileCode] = useState<string>("");
  const [originalFileCode, setOriginalFileCode] = useState<string>("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [savingFile, setSavingFile] = useState(false);
  const [codeSavedSuccess, setCodeSavedSuccess] = useState(false);

  // Line numbers calculation
  const lineCount = fileCode.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // ==========================================
  // VISUAL SETTINGS STATE
  // ==========================================
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [visualSavedSuccess, setVisualSavedSuccess] = useState(false);
  const [activeVisualTab, setActiveVisualTab] = useState<"colors" | "typography" | "layout">("colors");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Load Template Metadata & Initial Files
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const token = localStorage.getItem("shaadi_super_admin_token");
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch template details
        const resT = await fetch(`/api/admin/templates/${id}`, {
          headers,
          credentials: "include",
        });
        const dataT = await resT.json();

        if (!resT.ok || !dataT.success) {
          setErrorMsg(dataT.error || "Failed to load template");
          return;
        }

        const tmpl: TemplateData = dataT.template;
        setTemplate(tmpl);

        // Build active visual settings map
        const initialSettings: Record<string, any> = {};
        for (const def of tmpl.manifest?.designSettings || []) {
          initialSettings[def.key] =
            tmpl.designSettings?.[def.key] !== undefined
              ? tmpl.designSettings[def.key]
              : def.default || "";
        }
        setSettings(initialSettings);

        // 2. Fetch file list for Code Editor
        const resC = await fetch(`/api/admin/templates/${id}/code`, {
          headers,
          credentials: "include",
        });
        const dataC = await resC.json();
        if (dataC.success && Array.isArray(dataC.files)) {
          setFileList(dataC.files);
          // Auto-select index.html or first file
          const defaultFile = dataC.files.find((f: any) => f.name === "index.html") || dataC.files[0];
          if (defaultFile) {
            loadFileContent(defaultFile.path);
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to initialize editor");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [id]);

  // Load a specific file's content
  const loadFileContent = async (filePath: string) => {
    setLoadingFile(true);
    setActiveFilePath(filePath);
    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch(
        `/api/admin/templates/${id}/code?file=${encodeURIComponent(filePath)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        setFileCode(data.content);
        setOriginalFileCode(data.content);
      } else {
        alert(data.error || "Failed to read file");
      }
    } catch (err: any) {
      alert(err.message || "Error reading file");
    } finally {
      setLoadingFile(false);
    }
  };

  // Save active file content to disk
  const handleSaveCodeFile = async () => {
    if (!activeFilePath) return;
    setSavingFile(true);
    setCodeSavedSuccess(false);

    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch(`/api/admin/templates/${id}/code`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          filePath: activeFilePath,
          content: fileCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save file");
      }

      setOriginalFileCode(fileCode);
      setCodeSavedSuccess(true);
      setTimeout(() => setCodeSavedSuccess(false), 3000);

      // Reload live iframe to reflect HTML/CSS/JS code changes
      refreshIframe();
    } catch (err: any) {
      alert(err.message || "Error saving file");
    } finally {
      setSavingFile(false);
    }
  };

  // Keyboard shortcut: Ctrl+S / Cmd+S to save
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSaveCodeFile();
      return;
    }

    // Support Tab key indentation (inserts 2 spaces)
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = fileCode.substring(0, start) + "  " + fileCode.substring(end);
      setFileCode(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Sync line numbers scroll with textarea
  const handleTextareaScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Refresh preview iframe
  const refreshIframe = () => {
    if (iframeRef.current && template) {
      iframeRef.current.src = `/api/public/templates/${template.slug}/preview?t=${Date.now()}`;
    }
  };

  // Visual setting live change
  const applyVisualSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const varName = `--${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
      doc.documentElement.style.setProperty(varName, value);
    }
  };

  // Save visual settings
  const handleSaveVisualSettings = async () => {
    setSavingSettings(true);
    setVisualSavedSuccess(false);
    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch(`/api/admin/templates/${id}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ designSettings: settings }),
      });
      const data = await res.json();
      if (data.success) {
        setVisualSavedSuccess(true);
        setTimeout(() => setVisualSavedSuccess(false), 3000);
      } else {
        alert(data.error || "Failed to save settings");
      }
    } catch (err: any) {
      alert(err.message || "Error saving settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!template) return;
    const affected = template.affectedWeddingsCount || 0;
    let promptMsg = `Are you sure you want to permanently delete template '${template.name}'? All files will be removed.`;
    if (affected > 0) {
      promptMsg = `WARNING: This template is used by ${affected} active customer wedding(s)!\n\nAre you sure you want to permanently delete it?`;
    }

    if (!confirm(promptMsg)) return;

    try {
      const token = localStorage.getItem("shaadi_super_admin_token");
      const res = await fetch(`/api/admin/templates/${template._id}?force=true`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        router.push("/admin/templates");
      } else {
        alert(data.error || "Failed to delete template");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete template");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mr-3" />
        <span>Loading Template Editor...</span>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 p-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-white text-lg font-bold">Template Not Found</h2>
        <p className="text-xs text-zinc-500 mt-1">{errorMsg || "Could not retrieve template"}</p>
        <Link
          href="/admin/templates"
          className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs"
        >
          Back to Templates
        </Link>
      </div>
    );
  }

  const isCodeModified = fileCode !== originalFileCode;

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-hidden">
      {/* =========================================================================
          TOP NAVBAR: Template Info, Editor Mode Switcher, Device Modes & Save
         ========================================================================= */}
      <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 z-30">
        {/* Left: Brand & Back */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/templates"
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            title="Back to Templates"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-tight">
                {template.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                /{template.slug}
              </span>
              <span className="text-[10px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded capitalize">
                {template.category || "wedding"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher (Code Editor vs Visual Customizer) */}
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => setEditorMode("code")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              editorMode === "code"
                ? "bg-amber-500 text-black font-semibold shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>

          <button
            onClick={() => setEditorMode("visual")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              editorMode === "visual"
                ? "bg-amber-500 text-black font-semibold shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Visual Styling</span>
          </button>
        </div>

        {/* Right: Device Viewport & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Device Viewport Switcher */}
          <div className="hidden md:flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded text-xs transition cursor-pointer ${
                deviceMode === "mobile" ? "bg-zinc-800 text-amber-400" : "text-zinc-500 hover:text-white"
              }`}
              title="Mobile (380px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`p-1.5 rounded text-xs transition cursor-pointer ${
                deviceMode === "tablet" ? "bg-zinc-800 text-amber-400" : "text-zinc-500 hover:text-white"
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded text-xs transition cursor-pointer ${
                deviceMode === "desktop" ? "bg-zinc-800 text-amber-400" : "text-zinc-500 hover:text-white"
              }`}
              title="Desktop (Full)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={refreshIframe}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
            title="Refresh Live Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Primary Action Button */}
          {editorMode === "code" ? (
            <button
              onClick={handleSaveCodeFile}
              disabled={savingFile || !isCodeModified}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-black text-xs font-bold rounded-lg shadow-md transition cursor-pointer"
            >
              {savingFile ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : codeSavedSuccess ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{codeSavedSuccess ? "Saved!" : isCodeModified ? "Save (Ctrl+S)" : "Saved"}</span>
            </button>
          ) : (
            <button
              onClick={handleSaveVisualSettings}
              disabled={savingSettings}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-black text-xs font-bold rounded-lg shadow-md transition cursor-pointer"
            >
              {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{visualSavedSuccess ? "Saved!" : "Save Styling"}</span>
            </button>
          )}

          {/* Delete Template Button */}
          <button
            onClick={handleDeleteTemplate}
            className="p-1.5 bg-zinc-900 hover:bg-rose-950/50 text-zinc-500 hover:text-rose-400 border border-zinc-800 hover:border-rose-900/50 rounded-lg transition cursor-pointer"
            title="Delete this Template"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE (Split Screen: Editor Left / Live Preview Right)
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* =====================================================================
            LEFT WORKSPACE: CODE EDITOR OR VISUAL STYLING
           ===================================================================== */}
        {editorMode === "code" ? (
          <div className="flex-1 flex overflow-hidden border-r border-zinc-800">
            {/* File Explorer Sidebar */}
            <div className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 select-none">
              <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                  Files
                </span>
                <span className="text-[10px] text-zinc-500">{fileList.length} files</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
                {fileList.map((file) => {
                  const isActive = activeFilePath === file.path;
                  const Icon =
                    file.ext === ".html"
                      ? FileCode
                      : file.ext === ".css"
                      ? FileText
                      : file.ext === ".json"
                      ? FileJson
                      : FileCode;

                  return (
                    <button
                      key={file.path}
                      onClick={() => loadFileContent(file.path)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition font-mono text-[11px] cursor-pointer ${
                        isActive
                          ? "bg-amber-500/15 text-amber-300 font-semibold border-l-2 border-amber-500"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-400" : "text-zinc-500"}`} />
                        <span className="truncate">{file.path}</span>
                      </div>
                      <span className="text-[9px] text-zinc-600 font-sans shrink-0 ml-1">
                        {(file.size / 1024).toFixed(1)}k
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code Editor Pane (IDE Styling) */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
              {/* Tab Bar */}
              <div className="h-9 bg-[#252526] border-b border-[#333333] px-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-zinc-300">
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeFilePath}</span>
                  {isCodeModified && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                </div>

                <span className="text-[10px] text-zinc-500 font-mono">
                  {lineCount} lines • UTF-8
                </span>
              </div>

              {/* Monaco VS Code Editor Area */}
              <div className="flex-1 flex overflow-hidden relative">
                {loadingFile ? (
                  <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mr-2 text-amber-500" />
                    <span>Loading file code into VS Code engine...</span>
                  </div>
                ) : (
                  <Editor
                    height="100%"
                    language={getMonacoLanguage(activeFilePath)}
                    theme="vs-dark"
                    value={fileCode}
                    onChange={(val) => setFileCode(val || "")}
                    onMount={(editor, monaco) => {
                      // Bind Ctrl+S / Cmd+S in Monaco
                      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                        handleSaveCodeFile();
                      });
                    }}
                    options={{
                      fontSize: 13,
                      fontFamily: "var(--font-mono, Menlo, Monaco, 'Courier New', monospace)",
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      automaticLayout: true,
                      tabSize: 2,
                      lineNumbers: "on",
                      folding: true,
                      bracketPairColorization: { enabled: true },
                      formatOnPaste: true,
                    }}
                    loading={
                      <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
                        <Loader2 className="w-5 h-5 animate-spin mr-2 text-amber-500" />
                        <span>Loading Monaco Editor...</span>
                      </div>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* =====================================================================
              VISUAL STYLING CONTROLS PANE
             ===================================================================== */
          <div className="w-80 sm:w-96 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
            {/* Visual Tabs */}
            <div className="p-3 border-b border-zinc-800">
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
                <button
                  onClick={() => setActiveVisualTab("colors")}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeVisualTab === "colors" ? "bg-zinc-800 text-amber-400 font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Colors</span>
                </button>
                <button
                  onClick={() => setActiveVisualTab("typography")}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeVisualTab === "typography" ? "bg-zinc-800 text-amber-400 font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Fonts</span>
                </button>
              </div>
            </div>

            {/* Controls List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeVisualTab === "colors" &&
                template.manifest?.designSettings
                  ?.filter((s) => s.type === "color")
                  .map((def) => {
                    const val = settings[def.key] || "#000000";
                    return (
                      <div key={def.key} className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-zinc-200">{def.label}</label>
                          <span className="text-[10px] font-mono text-zinc-500">
                            --{def.key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-zinc-700 shrink-0 cursor-pointer">
                            <input
                              type="color"
                              value={val}
                              onChange={(e) => applyVisualSettingChange(def.key, e.target.value)}
                              className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0"
                            />
                          </div>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => applyVisualSettingChange(def.key, e.target.value)}
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none uppercase"
                          />
                        </div>
                      </div>
                    );
                  })}

              {activeVisualTab === "typography" &&
                template.manifest?.designSettings
                  ?.filter((s) => s.type === "font")
                  .map((def) => {
                    const val = settings[def.key] || "";
                    return (
                      <div key={def.key} className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 space-y-2">
                        <label className="text-xs font-semibold text-zinc-200">{def.label}</label>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => applyVisualSettingChange(def.key, e.target.value)}
                          placeholder="e.g. Playfair Display, Cinzel"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    );
                  })}
            </div>
          </div>
        )}

        {/* =====================================================================
            RIGHT WORKSPACE: INTERACTIVE LIVE PREVIEW CANVAS
           ===================================================================== */}
        <main className="flex-1 bg-zinc-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
          <div
            className={`transition-all duration-300 h-full flex flex-col bg-black rounded-2xl shadow-2xl overflow-hidden border border-zinc-800 ${
              deviceMode === "mobile"
                ? "w-[380px] max-w-full my-auto"
                : deviceMode === "tablet"
                ? "w-[768px] max-w-full my-auto"
                : "w-full h-full"
            }`}
          >
            {/* Viewport Frame Header */}
            <div className="h-7 bg-zinc-900 border-b border-zinc-800 px-3 flex items-center justify-between text-[11px] text-zinc-500 shrink-0 select-none">
              <span className="font-mono text-[10px]">
                {deviceMode === "mobile" ? "iPhone 15 • 380px" : deviceMode === "tablet" ? "iPad • 768px" : "Desktop View"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 text-[10px]">Live Preview</span>
              </div>
            </div>

            {/* Sandboxed Live Preview Iframe */}
            <div className="flex-1 relative bg-black">
              <iframe
                ref={iframeRef}
                src={`/api/public/templates/${template.slug}/preview`}
                className="w-full h-full border-0"
                title="Template Live Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
