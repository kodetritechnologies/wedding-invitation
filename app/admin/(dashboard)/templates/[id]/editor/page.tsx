"use client";

import { useEffect, useState, useRef, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Check,
  Loader2,
  Maximize2,
  Columns,
  AlertCircle,
  Code2,
  FileCode,
  FileText,
  FileJson,
  FolderOpen,
  FolderClosed,
  RefreshCw,
  Trash2,
  ExternalLink,
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

function TemplateEditorContent({ id }: { id: string }) {
  const router = useRouter();

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Code View Layout: "full" (Full Page Code Editor) or "split" (Code + Live Preview)
  const [codeLayout, setCodeLayout] = useState<"full" | "split">("full");

  // File Explorer Sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Refresh preview iframe
  const refreshIframe = () => {
    if (iframeRef.current && template) {
      iframeRef.current.src = `/api/public/templates/${template.slug}/preview?t=${Date.now()}`;
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
    <div className="fixed inset-0 z-50 w-screen h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-hidden">
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
              <span className="text-[10px]  text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                /{template.slug}
              </span>
              <span className="text-[10px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded capitalize">
                {template.category || "wedding"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: File Status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400  bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
          <Code2 className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold text-zinc-200">Monaco IDE</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 truncate max-w-[200px]">{activeFilePath}</span>
        </div>

        {/* Right: View Modes, Device Viewport & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Code Layout Switcher (Full Page vs Split View) */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setCodeLayout("full")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                codeLayout === "full"
                  ? "bg-amber-500 text-black font-semibold shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Full Page Editor (100% Space for Coding)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Page</span>
            </button>
            <button
              onClick={() => setCodeLayout("split")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                codeLayout === "split"
                  ? "bg-amber-500 text-black font-semibold shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Split Screen (Code + Live Preview side-by-side)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split Preview</span>
            </button>
          </div>

          {/* Device Viewport Switcher - Shown when preview is active */}
          {codeLayout === "split" && (
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
          )}

          {codeLayout === "split" && (
            <button
              onClick={refreshIframe}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
              title="Refresh Live Preview"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {codeLayout === "full" && (
            <a
              href={`/api/public/templates/${template.slug}/preview`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition"
              title="Open Live Preview in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview Tab</span>
            </a>
          )}

          {/* Primary Action Button: Save Code */}
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
          MAIN WORKSPACE (Full Screen IDE: Files + Monaco Editor + Optional Split Preview)
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Workspace: Code Editor Pane */}
        <div className={`flex-1 flex overflow-hidden ${codeLayout === "split" ? "border-r border-zinc-800" : ""}`}>
            {/* File Explorer Sidebar */}
            {isSidebarOpen ? (
              <div className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 select-none transition-all">
                <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                    Files
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">{fileList.length} files</span>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                      title="Collapse Files Sidebar"
                    >
                      <FolderClosed className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition  text-[11px] cursor-pointer ${
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
            ) : null}

            {/* Code Editor Pane (IDE Styling) */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
              {/* Tab Bar */}
              <div className="h-9 bg-[#252526] border-b border-[#333333] px-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2  text-zinc-300">
                  {!isSidebarOpen && (
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-zinc-800 hover:bg-zinc-700 text-amber-400 transition cursor-pointer mr-1"
                      title="Show File Explorer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span className="text-[10px] text-zinc-300">Files</span>
                    </button>
                  )}
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeFilePath}</span>
                  {isCodeModified && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-zinc-500  hidden sm:inline">
                    {lineCount} lines • UTF-8
                  </span>

                  {/* Toggle Split / Full Page button inside Editor Tab Bar */}
                  <button
                    onClick={() => setCodeLayout(codeLayout === "full" ? "split" : "full")}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer border border-zinc-700/60"
                    title={codeLayout === "full" ? "Switch to Split Screen (with live preview)" : "Maximize Code Editor to Full Page"}
                  >
                    {codeLayout === "full" ? (
                      <>
                        <Columns className="w-3 h-3 text-amber-400" />
                        <span>Split Preview</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3 h-3 text-amber-400" />
                        <span>Full Page Code</span>
                      </>
                    )}
                  </button>
                </div>
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
                      fontFamily: "var(--, Menlo, Monaco, 'Courier New', monospace)",
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

        {/* =====================================================================
            RIGHT WORKSPACE: INTERACTIVE LIVE PREVIEW CANVAS
            Rendered ONLY when "split" layout is selected
           ===================================================================== */}
        {codeLayout === "split" && (
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
                <span className=" text-[10px]">
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
        )}
      </div>
    </div>
  );
}

function TemplateEditorWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TemplateEditorContent id={id} />;
}

export default function TemplateEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-200">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <TemplateEditorWrapper params={params} />
    </Suspense>
  );
}
