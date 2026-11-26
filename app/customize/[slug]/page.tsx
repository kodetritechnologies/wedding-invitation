"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Users,
  Image as ImageIcon,
  Images,
  Calendar,
  Music,
  Mail,
  ChevronDown,
  ChevronRight,
  Eye,
  Sparkles,
  Check,
  Loader2,
  Plus,
  X,
  Smartphone,
  Monitor,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import RazorpayCheckoutModal from "@/components/payment/RazorpayCheckoutModal";

interface BasicInfoData {
  side: "groom" | "bride";
  groomName: string;
  groomShortName: string;
  brideName: string;
  brideShortName: string;
  weddingHashtag: string;
}

interface ParentsInfoData {
  brideParentsPrefix: string;
  brideParentsName: string;
  brideGrandparentsPrefix: string;
  brideGrandparentsName: string;
  groomParentsPrefix: string;
  groomParentsName: string;
  groomGrandparentsPrefix: string;
  groomGrandparentsName: string;
}

interface EventItem {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  mapLink: string;
}

interface TemplateData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  format?: string;
  category?: string;
  price?: number;
}

const ACCORDION_ITEMS = [
  { id: "basic", label: "Basic Information", icon: Heart },
  { id: "parents", label: "Parents Details", icon: Users },
  { id: "couplePhotos", label: "Couple Photos", icon: ImageIcon },
  { id: "gallery", label: "Photo Gallery", icon: Images },
  { id: "events", label: "Events", icon: Calendar },
  { id: "music", label: "Background Music", icon: Music },
  { id: "rsvp", label: "RSVP / Message", icon: Mail },
] as const;

type AccordionId = (typeof ACCORDION_ITEMS)[number]["id"];

function CustomizeContent({ slug }: { slug: string }) {
  const router = useRouter();
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedStatus, setSavedStatus] = useState<"saved" | "saving">("saved");

  // Basic Information open by default
  const [openSection, setOpenSection] = useState<AccordionId | null>("basic");

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    side: "groom",
    groomName: "",
    groomShortName: "",
    brideName: "",
    brideShortName: "",
    weddingHashtag: "",
  });

  const [parentsInfo, setParentsInfo] = useState<ParentsInfoData>({
    brideParentsPrefix: "Daughter of",
    brideParentsName: "",
    brideGrandparentsPrefix: "Grand Daughter of",
    brideGrandparentsName: "",
    groomParentsPrefix: "Son of",
    groomParentsName: "",
    groomGrandparentsPrefix: "Grand Son of",
    groomGrandparentsName: "",
  });

  const [couplePhotos, setCouplePhotos] = useState<{
    groomPhoto: string;
    bridePhoto: string;
  }>({
    groomPhoto: "",
    bridePhoto: "",
  });

  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const MAX_GALLERY_PHOTOS = 15;

  const [eventsList, setEventsList] = useState<EventItem[]>([]);

  const [backgroundMusic, setBackgroundMusic] = useState<{
    mode: "default" | "custom" | "none";
    fileName: string;
    fileUrl: string;
  }>({
    mode: "default",
    fileName: "",
    fileUrl: "",
  });

  const [rsvpInfo, setRsvpInfo] = useState<{
    enabled: boolean;
    message: string;
  }>({
    enabled: true,
    message: "",
  });

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");

  // Load template metadata & saved draft
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/templates/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.template) {
            setTemplate(data.template);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();

    try {
      const raw = localStorage.getItem(`shaadi_draft_${slug}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.basicInfo) {
          setBasicInfo((prev) => ({ ...prev, ...parsed.basicInfo }));
        }
        if (parsed.parentsInfo) {
          setParentsInfo((prev) => ({ ...prev, ...parsed.parentsInfo }));
        }
        if (parsed.couplePhotos) {
          setCouplePhotos((prev) => ({ ...prev, ...parsed.couplePhotos }));
        }
        if (Array.isArray(parsed.galleryPhotos)) {
          setGalleryPhotos(parsed.galleryPhotos);
        }
        if (Array.isArray(parsed.eventsList)) {
          setEventsList(parsed.eventsList);
        }
        if (parsed.backgroundMusic) {
          setBackgroundMusic((prev) => ({ ...prev, ...parsed.backgroundMusic }));
        }
        if (parsed.rsvpInfo) {
          setRsvpInfo((prev) => ({ ...prev, ...parsed.rsvpInfo }));
        }
      }
    } catch {
      // ignore
    }
  }, [slug]);

  // Auto-save draft to localStorage
  const updateBasicInfo = (patch: Partial<BasicInfoData>) => {
    setSavedStatus("saving");
    setBasicInfo((prev) => {
      const next = { ...prev, ...patch };
      try {
        const existing = JSON.parse(localStorage.getItem(`shaadi_draft_${slug}`) || "{}");
        localStorage.setItem(
          `shaadi_draft_${slug}`,
          JSON.stringify({ ...existing, basicInfo: next })
        );
      } catch {
        // ignore
      }
      return next;
    });
    setTimeout(() => setSavedStatus("saved"), 300);
  };

  const updateParentsInfo = (patch: Partial<ParentsInfoData>) => {
    setSavedStatus("saving");
    setParentsInfo((prev) => {
      const next = { ...prev, ...patch };
      try {
        const existing = JSON.parse(localStorage.getItem(`shaadi_draft_${slug}`) || "{}");
        localStorage.setItem(
          `shaadi_draft_${slug}`,
          JSON.stringify({ ...existing, parentsInfo: next })
        );
      } catch {
        // ignore
      }
      return next;
    });
    setTimeout(() => setSavedStatus("saved"), 300);
  };

  const handleCouplePhotoUpload = (
    role: "groomPhoto" | "bridePhoto",
    file: File | undefined
  ) => {
    if (!file) return;
    setSavedStatus("saving");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      setCouplePhotos((prev) => {
        const next = { ...prev, [role]: dataUrl };
        try {
          const existing = JSON.parse(localStorage.getItem(`shaadi_draft_${slug}`) || "{}");
          localStorage.setItem(
            `shaadi_draft_${slug}`,
            JSON.stringify({ ...existing, couplePhotos: next })
          );
        } catch {
          // ignore
        }
        return next;
      });
      setTimeout(() => setSavedStatus("saved"), 300);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_GALLERY_PHOTOS - galleryPhotos.length;
    if (remaining <= 0) return;
    const selected = Array.from(files).slice(0, remaining);
    setSavedStatus("saving");
    Promise.all(
      selected.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve(typeof reader.result === "string" ? reader.result : "");
            reader.readAsDataURL(file);
          })
      )
    ).then((urls) => {
      const valid = urls.filter(Boolean);
      setGalleryPhotos((prev) => {
        const next = [...prev, ...valid].slice(0, MAX_GALLERY_PHOTOS);
        try {
          const existing = JSON.parse(
            localStorage.getItem(`shaadi_draft_${slug}`) || "{}"
          );
          localStorage.setItem(
            `shaadi_draft_${slug}`,
            JSON.stringify({ ...existing, galleryPhotos: next })
          );
        } catch {
          // ignore
        }
        return next;
      });
      setTimeout(() => setSavedStatus("saved"), 300);
    });
  };

  const removeGalleryPhoto = (index: number) => {
    setSavedStatus("saving");
    setGalleryPhotos((prev) => {
      const next = prev.filter((_, i) => i !== index);
      try {
        const existing = JSON.parse(
          localStorage.getItem(`shaadi_draft_${slug}`) || "{}"
        );
        localStorage.setItem(
          `shaadi_draft_${slug}`,
          JSON.stringify({ ...existing, galleryPhotos: next })
        );
      } catch {
        // ignore
      }
      return next;
    });
    setTimeout(() => setSavedStatus("saved"), 300);
  };

  const saveEvents = (next: EventItem[]) => {
    setSavedStatus("saving");
    setEventsList(next);
    try {
      const existing = JSON.parse(localStorage.getItem(`shaadi_draft_${slug}`) || "{}");
      localStorage.setItem(
        `shaadi_draft_${slug}`,
        JSON.stringify({ ...existing, eventsList: next })
      );
    } catch {
      // ignore
    }
    setTimeout(() => setSavedStatus("saved"), 300);
  };

  const addEvent = () => {
    saveEvents([
      ...eventsList,
      {
        id: `evt-${Date.now()}`,
        name: "",
        date: "",
        time: "",
        venue: "",
        mapLink: "",
      },
    ]);
  };

  const updateEvent = (id: string, patch: Partial<EventItem>) => {
    saveEvents(eventsList.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const removeEvent = (id: string) => {
    saveEvents(eventsList.filter((e) => e.id !== id));
  };

  const updateBackgroundMusic = (
    patch: Partial<{ mode: "default" | "custom" | "none"; fileName: string; fileUrl: string }>
  ) => {
    setSavedStatus("saving");
    setBackgroundMusic((prev) => {
      const next = { ...prev, ...patch };
      try {
        const existing = JSON.parse(localStorage.getItem(`shaadi_draft_${slug}`) || "{}");
        localStorage.setItem(
          `shaadi_draft_${slug}`,
          JSON.stringify({ ...existing, backgroundMusic: next })
        );
      } catch {
        // ignore
      }
      return next;
    });
    setTimeout(() => setSavedStatus("saved"), 300);
  };

  const handleMusicUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      updateBackgroundMusic({
        mode: "custom",
        fileName: file.name,
        fileUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const updateRsvpInfo = (patch: Partial<{ enabled: boolean; message: string }>) => {
    setSavedStatus("saving");
    setRsvpInfo((prev) => {
      const next = { ...prev, ...patch };
      try {
        const existing = JSON.parse(localStorage.getItem(`shaadi_draft_${slug}`) || "{}");
        localStorage.setItem(
          `shaadi_draft_${slug}`,
          JSON.stringify({ ...existing, rsvpInfo: next })
        );
      } catch {
        // ignore
      }
      return next;
    });
    setTimeout(() => setSavedStatus("saved"), 300);
  };

  const handleOpenPreview = async () => {
    setShowPreviewModal(true);
    setPreviewLoading(true);
    try {
      const payload = {
        customerData: {
          ...basicInfo,
          ...parentsInfo,
          couplePhotos,
          galleryPhotos,
          events: eventsList,
          backgroundMusic,
          rsvp: rsvpInfo,
          groom_name: basicInfo.groomName,
          bride_name: basicInfo.brideName,
          hashtag: basicInfo.weddingHashtag,
        },
      };
      let res = await fetch(`/api/public/templates/${encodeURIComponent(slug)}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        res = await fetch(`/api/public/templates/${encodeURIComponent(slug)}/preview`);
      }
      const html = await res.text();
      setPreviewHtml(html);
    } catch {
      setPreviewHtml("");
    } finally {
      setPreviewLoading(false);
    }
  };

  const toggleSection = (id: AccordionId) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const groomFields = (
    <div className="space-y-4">
      <div className="text-xs font-bold tracking-widest uppercase text-[#720E16] border-b border-[#EADBCE] pb-2">
        Groom&apos;s Details
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-800 mb-1.5">
          Groom&apos;s Name <span className="text-[#720E16]">*</span>
        </label>
        <input
          type="text"
          value={basicInfo.groomName}
          onChange={(e) => updateBasicInfo({ groomName: e.target.value })}
          placeholder="e.g. Abhay Suneriya"
          className="w-full px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-800 mb-1.5">
          Groom&apos;s Short Name <span className="text-stone-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={basicInfo.groomShortName}
          onChange={(e) => updateBasicInfo({ groomShortName: e.target.value })}
          placeholder="e.g. Vijay"
          className="w-full px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
        />
      </div>
    </div>
  );

  const brideFields = (
    <div className="space-y-4">
      <div className="text-xs font-bold tracking-widest uppercase text-[#720E16] border-b border-[#EADBCE] pb-2">
        Bride&apos;s Details
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-800 mb-1.5">
          Bride&apos;s Name <span className="text-[#720E16]">*</span>
        </label>
        <input
          type="text"
          value={basicInfo.brideName}
          onChange={(e) => updateBasicInfo({ brideName: e.target.value })}
          placeholder="e.g. Palak Panthi"
          className="w-full px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-800 mb-1.5">
          Bride&apos;s Short Name <span className="text-stone-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={basicInfo.brideShortName}
          onChange={(e) => updateBasicInfo({ brideShortName: e.target.value })}
          placeholder="e.g. Rashima"
          className="w-full px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col">
      <PublicHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#720E16] mx-auto mb-3" />
            <p className="text-sm text-stone-500">Loading customization studio...</p>
          </div>
        ) : (
          <>
            {/* Accordion Stack */}
            <div className="space-y-3.5">
              {ACCORDION_ITEMS.map((item) => {
                const isOpen = openSection === item.id;
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border transition-all ${
                      isOpen
                        ? "border-[#EADBCE] shadow-sm"
                        : "border-stone-200/80 hover:border-[#EADBCE]"
                    }`}
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleSection(item.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer"
                    >
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isOpen ? "text-[#720E16]" : "text-stone-400"
                        }`}
                      />
                      <span className="font-semibold text-base sm:text-lg text-stone-900">
                        {item.label}
                      </span>
                    </button>

                    {/* Accordion Body */}
                    {isOpen && item.id === "basic" && (
                      <div className="px-5 pb-6 pt-1 space-y-6 border-t border-stone-100">
                        <p className="text-sm text-stone-600 font-normal pt-2">
                          Tell us about the couple.
                        </p>

                        {/* Bride Side or Groom Side */}
                        <div className="space-y-2">
                          <div className="text-sm font-bold text-stone-900">
                            Bride Side or Groom Side
                          </div>
                          <p className="text-xs text-stone-500">
                            Whose family is sending the invitation? That person&apos;s name will appear first.
                          </p>

                          {/* Segmented Toggle */}
                          <div className="grid grid-cols-2 p-1 rounded-xl border border-[#EADBCE] bg-[#FAF4EB]/50 mt-2">
                            <button
                              type="button"
                              onClick={() => updateBasicInfo({ side: "groom" })}
                              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
                                basicInfo.side === "groom"
                                  ? "bg-white text-[#720E16] shadow-xs border border-[#EADBCE]"
                                  : "text-stone-600 hover:text-stone-900"
                              }`}
                            >
                              <span>🤵</span>
                              <span>Groom&apos;s Side</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBasicInfo({ side: "bride" })}
                              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
                                basicInfo.side === "bride"
                                  ? "bg-white text-[#720E16] shadow-xs border border-[#EADBCE]"
                                  : "text-stone-600 hover:text-stone-900"
                              }`}
                            >
                              <span>👰</span>
                              <span>Bride&apos;s Side</span>
                            </button>
                          </div>
                        </div>

                        {/* Dynamic Order: Groom first or Bride first */}
                        {basicInfo.side === "groom" ? (
                          <>
                            {groomFields}
                            {brideFields}
                          </>
                        ) : (
                          <>
                            {brideFields}
                            {groomFields}
                          </>
                        )}

                        {/* Wedding Hashtag */}
                        <div>
                          <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                            Wedding Hashtag{" "}
                            <span className="text-stone-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={basicInfo.weddingHashtag}
                            onChange={(e) =>
                              updateBasicInfo({ weddingHashtag: e.target.value })
                            }
                            placeholder="e.g. #ForeverTogether"
                            className="w-full px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
                          />
                          <p className="text-xs text-stone-400 mt-1.5">
                            Shown on your website exactly as you type it.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Parents Details Accordion Body */}
                    {isOpen && item.id === "parents" && (
                      <div className="px-5 pb-6 pt-1 space-y-6 border-t border-stone-100">
                        <p className="text-sm text-stone-600 font-normal pt-2">
                          Add the parents&apos; and grandparents&apos; names shown on your invitation.
                        </p>

                        {/* BRIDE'S FAMILY */}
                        <div className="space-y-4">
                          <div className="text-xs font-bold tracking-widest uppercase text-[#720E16] border-b border-[#EADBCE] pb-2">
                            Bride&apos;s Family
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                              Bride&apos;s Mother&apos;s and Father&apos;s Name <span className="text-[#720E16]">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2.5">
                              <select
                                value={parentsInfo.brideParentsPrefix}
                                onChange={(e) =>
                                  updateParentsInfo({ brideParentsPrefix: e.target.value })
                                }
                                aria-label="Bride parents relation"
                                className="sm:w-44 shrink-0 px-3.5 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] cursor-pointer"
                              >
                                <option value="Daughter of">Daughter of</option>
                                <option value="D/o">D/o</option>
                                <option value="Smt. & Shri">Smt. &amp; Shri</option>
                              </select>
                              <input
                                type="text"
                                value={parentsInfo.brideParentsName}
                                onChange={(e) =>
                                  updateParentsInfo({ brideParentsName: e.target.value })
                                }
                                placeholder="e.g. Mrs. & Mr. Sharma"
                                className="flex-1 px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                              Bride&apos;s Grandmother&apos;s and Grandfather&apos;s Name{" "}
                              <span className="text-stone-400 font-normal">(Optional)</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2.5">
                              <select
                                value={parentsInfo.brideGrandparentsPrefix}
                                onChange={(e) =>
                                  updateParentsInfo({ brideGrandparentsPrefix: e.target.value })
                                }
                                aria-label="Bride grandparents relation"
                                className="sm:w-44 shrink-0 px-3.5 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] cursor-pointer"
                              >
                                <option value="Grand Daughter of">Grand Daughter of</option>
                                <option value="Granddaughter of">Granddaughter of</option>
                              </select>
                              <input
                                type="text"
                                value={parentsInfo.brideGrandparentsName}
                                onChange={(e) =>
                                  updateParentsInfo({ brideGrandparentsName: e.target.value })
                                }
                                placeholder="Grandmother's and Grandfather's Names"
                                className="flex-1 px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
                              />
                            </div>
                          </div>
                        </div>

                        {/* GROOM'S FAMILY */}
                        <div className="space-y-4">
                          <div className="text-xs font-bold tracking-widest uppercase text-[#720E16] border-b border-[#EADBCE] pb-2">
                            Groom&apos;s Family
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                              Groom&apos;s Mother&apos;s and Father&apos;s Name <span className="text-[#720E16]">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2.5">
                              <select
                                value={parentsInfo.groomParentsPrefix}
                                onChange={(e) =>
                                  updateParentsInfo({ groomParentsPrefix: e.target.value })
                                }
                                aria-label="Groom parents relation"
                                className="sm:w-44 shrink-0 px-3.5 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] cursor-pointer"
                              >
                                <option value="Son of">Son of</option>
                                <option value="S/o">S/o</option>
                                <option value="Smt. & Shri">Smt. &amp; Shri</option>
                              </select>
                              <input
                                type="text"
                                value={parentsInfo.groomParentsName}
                                onChange={(e) =>
                                  updateParentsInfo({ groomParentsName: e.target.value })
                                }
                                placeholder="e.g. Mrs. & Mr. Verma"
                                className="flex-1 px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                              Groom&apos;s Grandmother&apos;s and Grandfather&apos;s Name{" "}
                              <span className="text-stone-400 font-normal">(Optional)</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2.5">
                              <select
                                value={parentsInfo.groomGrandparentsPrefix}
                                onChange={(e) =>
                                  updateParentsInfo({ groomGrandparentsPrefix: e.target.value })
                                }
                                aria-label="Groom grandparents relation"
                                className="sm:w-44 shrink-0 px-3.5 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] cursor-pointer"
                              >
                                <option value="Grand Son of">Grand Son of</option>
                                <option value="Grandson of">Grandson of</option>
                              </select>
                              <input
                                type="text"
                                value={parentsInfo.groomGrandparentsName}
                                onChange={(e) =>
                                  updateParentsInfo({ groomGrandparentsName: e.target.value })
                                }
                                placeholder="Grandmother's and Grandfather's Names"
                                className="flex-1 px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Couple Photos Accordion Body */}
                    {isOpen && item.id === "couplePhotos" && (
                      <div className="px-5 pb-6 pt-1 space-y-6 border-t border-stone-100">
                        <p className="text-sm text-stone-600 font-normal pt-2">
                          Add individual photos of the groom and bride.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2">
                          {(
                            [
                              { key: "groomPhoto", label: "Groom's Photo" },
                              { key: "bridePhoto", label: "Bride's Photo" },
                            ] as const
                          ).map((slot) => {
                            const photoUrl = couplePhotos[slot.key];
                            return (
                              <div
                                key={slot.key}
                                className="flex flex-col items-center text-center space-y-3"
                              >
                                <div className="text-sm font-bold text-stone-800">
                                  {slot.label}
                                </div>

                                <div className="w-36 h-36 rounded-2xl border border-dashed border-stone-200 bg-stone-50/70 flex items-center justify-center overflow-hidden relative">
                                  {photoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={photoUrl}
                                      alt={slot.label}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="w-8 h-8 text-stone-400" />
                                  )}
                                </div>

                                <label className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-[#720E16]/40 text-[#720E16] hover:bg-[#FAF4EB] text-sm font-semibold transition cursor-pointer">
                                  <span>{photoUrl ? "Change" : "Upload"}</span>
                                  <input
                                    type="file"
                                    accept="image/*,.heic"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleCouplePhotoUpload(
                                        slot.key,
                                        e.target.files?.[0]
                                      )
                                    }
                                  />
                                </label>

                                <p className="text-xs text-stone-400">
                                  JPG, PNG, GIF, WebP, HEIC
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Photo Gallery Accordion Body */}
                    {isOpen && item.id === "gallery" && (
                      <div className="px-5 pb-6 pt-1 space-y-4 border-t border-stone-100">
                        <p className="text-sm text-stone-600 font-normal pt-2">
                          Photo Gallery &mdash; {galleryPhotos.length} / {MAX_GALLERY_PHOTOS} photo(s)
                        </p>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {galleryPhotos.map((src, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-2xl overflow-hidden border border-[#EADBCE] bg-stone-50 group"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryPhoto(idx)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-[#720E16] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                title="Remove photo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          {galleryPhotos.length < MAX_GALLERY_PHOTOS && (
                            <label className="aspect-square rounded-2xl border border-dashed border-stone-300 hover:border-[#720E16] bg-stone-50/70 hover:bg-[#FAF4EB]/60 flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-[#720E16] transition cursor-pointer">
                              <Plus className="w-5 h-5" />
                              <span className="text-xs font-medium">Add Photo</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*,.heic"
                                className="hidden"
                                onChange={(e) => {
                                  handleGalleryUpload(e.target.files);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          )}
                        </div>

                        <p className="text-xs text-stone-400">
                          Supported formats: JPG, PNG, GIF, WebP, HEIC. Max {MAX_GALLERY_PHOTOS} photos.
                        </p>
                      </div>
                    )}

                    {/* Events Accordion Body */}
                    {isOpen && item.id === "events" && (
                      <div className="px-5 pb-6 pt-1 space-y-4 border-t border-stone-100">
                        <p className="text-sm text-stone-600 font-normal pt-2">
                          Add one or more events to your invitation website.
                        </p>

                        {eventsList.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-[#EADBCE] bg-stone-50/40 py-10 text-center text-sm text-stone-500">
                            No events added yet
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {eventsList.map((evt, idx) => (
                              <div
                                key={evt.id}
                                className="p-4 rounded-2xl border border-[#EADBCE] bg-[#FAF4EB]/30 space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase tracking-wider text-[#720E16]">
                                    Event {idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeEvent(evt.id)}
                                    className="text-xs text-stone-400 hover:text-[#720E16] flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    Remove
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    value={evt.name}
                                    onChange={(e) =>
                                      updateEvent(evt.id, { name: e.target.value })
                                    }
                                    placeholder="Event Name (e.g. Haldi, Sangeet)"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16]"
                                  />
                                  <input
                                    type="date"
                                    value={evt.date}
                                    onChange={(e) =>
                                      updateEvent(evt.id, { date: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16]"
                                  />
                                  <input
                                    type="text"
                                    value={evt.time}
                                    onChange={(e) =>
                                      updateEvent(evt.id, { time: e.target.value })
                                    }
                                    placeholder="Time (e.g. 7:00 PM onwards)"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16]"
                                  />
                                  <input
                                    type="text"
                                    value={evt.venue}
                                    onChange={(e) =>
                                      updateEvent(evt.id, { venue: e.target.value })
                                    }
                                    placeholder="Venue / Address"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16]"
                                  />
                                </div>

                                <input
                                  type="url"
                                  value={evt.mapLink}
                                  onChange={(e) =>
                                    updateEvent(evt.id, { mapLink: e.target.value })
                                  }
                                  placeholder="Google Maps Link (Optional)"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16]"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={addEvent}
                          className="w-full py-3.5 rounded-2xl border border-dashed border-[#720E16]/40 hover:border-[#720E16] hover:bg-[#FAF4EB]/50 text-[#720E16] font-bold text-sm transition cursor-pointer"
                        >
                          + Add Another Event
                        </button>
                      </div>
                    )}

                    {/* Background Music Accordion Body */}
                    {isOpen && item.id === "music" && (
                      <div className="px-5 pb-6 pt-1 space-y-5 border-t border-stone-100">
                        <p className="text-sm text-stone-600 font-normal pt-2">
                          Choose background music or upload your own custom song.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {(
                            [
                              { id: "default", label: "Default Music" },
                              { id: "custom", label: "Upload Custom Song" },
                              { id: "none", label: "No Music" },
                            ] as const
                          ).map((opt) => {
                            const active = backgroundMusic.mode === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => updateBackgroundMusic({ mode: opt.id })}
                                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                                  active
                                    ? "bg-[#FAF4EB] border-[#720E16] text-[#720E16] shadow-xs"
                                    : "bg-white border-[#EADBCE] text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>

                        {backgroundMusic.mode === "custom" && (
                          <div className="p-4 rounded-2xl border border-dashed border-[#720E16]/40 bg-[#FAF4EB]/40 space-y-3">
                            {backgroundMusic.fileUrl ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Music className="w-4 h-4 text-[#720E16] shrink-0" />
                                    <span className="text-sm font-semibold text-stone-800 truncate">
                                      {backgroundMusic.fileName}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateBackgroundMusic({ fileName: "", fileUrl: "" })
                                    }
                                    className="text-xs text-stone-500 hover:text-[#720E16] flex items-center gap-1 shrink-0 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    Remove
                                  </button>
                                </div>
                                <audio
                                  controls
                                  src={backgroundMusic.fileUrl}
                                  className="w-full h-10"
                                />
                              </div>
                            ) : (
                              <div className="text-center py-4 space-y-2">
                                <Music className="w-7 h-7 text-[#720E16] mx-auto" />
                                <p className="text-sm font-medium text-stone-700">
                                  Upload your wedding song
                                </p>
                                <label className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[#720E16]/40 text-[#720E16] hover:bg-white text-sm font-semibold transition cursor-pointer">
                                  <span>Choose Audio File</span>
                                  <input
                                    type="file"
                                    accept="audio/*,.mp3,.wav,.m4a"
                                    className="hidden"
                                    onChange={(e) => handleMusicUpload(e.target.files?.[0])}
                                  />
                                </label>
                                <p className="text-xs text-stone-400">
                                  MP3, WAV, M4A supported
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* RSVP / Message Accordion Body */}
                    {isOpen && item.id === "rsvp" && (
                      <div className="px-5 pb-6 pt-3 space-y-5 border-t border-stone-100">
                        {/* Guest RSVP Toggle Card */}
                        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF4EB]/60 border border-[#EADBCE]">
                          <div>
                            <div className="text-sm font-bold text-stone-900">
                              Guest RSVP
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Let guests confirm whether they&apos;re coming, right on your invitation website.
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="text-xs font-semibold text-stone-600">
                              {rsvpInfo.enabled ? "On" : "Off"}
                            </span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={rsvpInfo.enabled}
                              onClick={() =>
                                updateRsvpInfo({ enabled: !rsvpInfo.enabled })
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                rsvpInfo.enabled ? "bg-[#720E16]" : "bg-stone-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                                  rsvpInfo.enabled ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-stone-500">
                          Add any info you&apos;d like your guests to see.
                        </p>

                        <div>
                          <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                            Message for your guests
                          </label>
                          <textarea
                            rows={4}
                            value={rsvpInfo.message}
                            onChange={(e) =>
                              updateRsvpInfo({ message: e.target.value })
                            }
                            placeholder="e.g. Kindly RSVP by 1st May. Contact: +91 98765 43210"
                            className="w-full px-4 py-3 rounded-xl border border-[#EADBCE] bg-white text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#720E16]/20 focus:border-[#720E16] transition resize-y"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-8 pt-5 border-t border-[#EADBCE] flex flex-wrap items-center justify-end gap-3">
              <span className="text-xs text-stone-400 mr-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {savedStatus === "saving" ? "Saving..." : "All changes saved"}
              </span>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-sm font-semibold text-stone-700 transition cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleOpenPreview}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#EADBCE] bg-white hover:bg-[#FAF4EB] text-sm font-semibold text-stone-800 transition cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#720E16]" />
                Preview
              </button>

              <button
                type="button"
                onClick={() => setShowBuyModal(true)}
                className="px-6 py-2.5 rounded-full bg-[#720E16] hover:bg-[#5A0910] text-white text-sm font-bold shadow-sm hover:shadow-md transition cursor-pointer"
              >
                Publish
              </button>
            </div>
          </>
        )}
      </main>

      <PublicFooter />

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#EADBCE]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EADBCE] bg-[#FAF4EB]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#720E16]" />
                <span className="font-bold text-sm text-stone-900">
                  Live Theme Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                    previewDevice === "mobile"
                      ? "bg-[#720E16] text-white"
                      : "bg-white text-stone-600 border border-[#EADBCE]"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                    previewDevice === "desktop"
                      ? "bg-[#720E16] text-white"
                      : "bg-white text-stone-600 border border-[#EADBCE]"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-stone-100 flex items-center justify-center p-4 overflow-hidden">
              {previewLoading ? (
                <div className="text-center">
                  <Loader2 className="w-7 h-7 animate-spin text-[#720E16] mx-auto mb-2" />
                  <p className="text-xs text-stone-500">Generating preview with your details...</p>
                </div>
              ) : (
                <iframe
                  title="Theme Live Preview"
                  srcDoc={previewHtml}
                  className={`bg-white shadow-xl border border-stone-200 transition-all duration-300 ${
                    previewDevice === "mobile"
                      ? "w-[375px] h-full rounded-[28px]"
                      : "w-full h-full rounded-xl"
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Buy Now / Publish Modal */}
      <RazorpayCheckoutModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        template={{
          title: template?.name || slug,
          slug: template?.slug || slug,
          price: template?.price || 399,
          format: template?.format || "website",
          thumbnail: template?.thumbnail,
        }}
      />
    </div>
  );
}

function CustomizeContentWrapper({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <CustomizeContent slug={slug} />;
}

export default function CustomizePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <Sparkles className="w-7 h-7 animate-spin text-[#720E16]" />
        </div>
      }
    >
      <CustomizeContentWrapper params={params} />
    </Suspense>
  );
}
