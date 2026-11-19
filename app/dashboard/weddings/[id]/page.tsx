"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import {
  CalendarHeart,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Users,
  UserCheck,
  UserX,
  Share2,
  Trash2,
  Loader2,
  X,
  Sparkles,
  LayoutTemplate,
  Eye,
  Palette,
} from "lucide-react";

interface EventItem {
  _id: string;
  eventType: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  venueName: string;
  venueAddress?: string;
  mapUrl?: string;
  dressCode?: string;
}

interface GuestItem {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  inviteCode: string;
  rsvpStatus: "pending" | "attending" | "declined";
  attendeeCount: number;
  guestMessage?: string;
}

interface RsvpStats {
  totalGuests: number;
  attending: number;
  declined: number;
  pending: number;
  totalExpectedAttendees: number;
}

interface WeddingDetail {
  _id: string;
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string;
  city: string;
  slug: string;
  status: "draft" | "published" | "archived";
  packageTier: string;
  story?: string;
  familyMessage?: string;
  templateId?: any;
  templateContent?: Record<string, any>;
}

function WeddingDetailContent({ weddingId }: { weddingId: string }) {

  const [wedding, setWedding] = useState<WeddingDetail | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [rsvpStats, setRsvpStats] = useState<RsvpStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "guests" | "template" | "settings">("itinerary");

  // Template State
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templateContent, setTemplateContent] = useState<Record<string, any>>({});
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateSuccessMsg, setTemplateSuccessMsg] = useState("");
  const [previewIframeOpen, setPreviewIframeOpen] = useState(false);

  // Modals State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  // New Event Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("Haldi");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [venueName, setVenueName] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [dressCode, setDressCode] = useState("");

  // New Guest Form State
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestHeadcount, setGuestHeadcount] = useState(1);

  const loadWeddingData = async () => {
    try {
      setLoading(true);
      const [resW, resG, resT] = await Promise.all([
        fetch(`/api/admin/weddings/${weddingId}`),
        fetch(`/api/admin/weddings/${weddingId}/guests`),
        fetch("/api/templates"),
      ]);

      const dataW = await resW.json();
      const dataG = await resG.json();
      const dataT = await resT.json();

      if (dataW.success) {
        setWedding(dataW.wedding);
        setEvents(dataW.events || []);
        setRsvpStats(dataW.rsvpStats || null);

        const currentTmplId = dataW.wedding.templateId?._id || dataW.wedding.templateId || "";
        setSelectedTemplateId(currentTmplId);
        setTemplateContent(dataW.wedding.templateContent || {});
      }

      if (dataG.success) {
        setGuests(dataG.guests || []);
      }

      if (dataT.success) {
        setAvailableTemplates(dataT.templates || []);
      }
    } catch (err) {
      console.error("Failed to load wedding details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeddingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTogglePublish = async () => {
    if (!wedding) return;
    const newStatus = wedding.status === "published" ? "draft" : "published";

    try {
      const res = await fetch(`/api/admin/weddings/${weddingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setWedding({ ...wedding, status: newStatus });
      }
    } catch (err) {
      console.error("Status toggle error", err);
    }
  };

  const handleSaveTemplateSettings = async () => {
    setSavingTemplate(true);
    setTemplateSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/weddings/${weddingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplateId || null,
          templateContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTemplateSuccessMsg("Template customization saved successfully!");
        setTimeout(() => setTemplateSuccessMsg(""), 4000);
        loadWeddingData();
      } else {
        alert(data.error || "Failed to save template personalization");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/weddings/${weddingId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventTitle,
          eventType,
          date: eventDate,
          startTime,
          venueName,
          mapUrl,
          dressCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add event");
      }

      setEventTitle("");
      setEventDate("");
      setStartTime("");
      setVenueName("");
      setMapUrl("");
      setDressCode("");
      setShowAddEventModal(false);
      loadWeddingData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error adding event";
      setActionError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/admin/weddings/${weddingId}/events/${eventId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadWeddingData();
      }
    } catch (err) {
      console.error("Delete event error", err);
    }
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/weddings/${weddingId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestName,
          phone: guestPhone,
          email: guestEmail,
          attendeeCount: guestHeadcount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add guest");
      }

      setGuestName("");
      setGuestPhone("");
      setGuestEmail("");
      setGuestHeadcount(1);
      setShowAddGuestModal(false);
      loadWeddingData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error adding guest";
      setActionError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Remove this guest from guest list?")) return;

    try {
      const res = await fetch(`/api/admin/weddings/${weddingId}/guests/${guestId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadWeddingData();
      }
    } catch (err) {
      console.error("Delete guest error", err);
    }
  };

  if (loading || !wedding) {
    return (
      <div className="p-12 text-center text-sm text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-600 mb-2" />
        Loading wedding workspace...
      </div>
    );
  }

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/w/${wedding.slug}` : `/w/${wedding.slug}`;

  return (
    <div className="space-y-6">
      {/* Wedding Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {wedding.brideName} & {wedding.groomName}
              </h1>
              <button
                onClick={handleTogglePublish}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition cursor-pointer ${
                  wedding.status === "published"
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                ● {wedding.status} (Click to toggle)
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {new Date(wedding.weddingDate).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {wedding.venue}, {wedding.city}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyLink(publicUrl)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied Link!" : "Copy Public URL"}</span>
            </button>

            <a
              href={`/w/${wedding.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <span>View Live Invitation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live RSVP Bar */}
        {rsvpStats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-[10px] font-semibold text-gray-500 uppercase">Total Guests</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{rsvpStats.totalGuests}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-[10px] font-semibold text-emerald-700 uppercase">Confirmed Attending</p>
              <p className="text-lg font-bold text-emerald-800 mt-0.5">{rsvpStats.attending}</p>
            </div>
            <div className="bg-rose-50 rounded-xl p-3 text-center">
              <p className="text-[10px] font-semibold text-rose-700 uppercase">Expected Headcount</p>
              <p className="text-lg font-bold text-rose-800 mt-0.5">{rsvpStats.totalExpectedAttendees}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-[10px] font-semibold text-amber-700 uppercase">Pending RSVP</p>
              <p className="text-lg font-bold text-amber-800 mt-0.5">{rsvpStats.pending}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-[10px] font-semibold text-red-700 uppercase">Declined</p>
              <p className="text-lg font-bold text-red-800 mt-0.5">{rsvpStats.declined}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("itinerary")}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "itinerary"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <CalendarHeart className="w-4 h-4" />
          <span>Itinerary & Functions ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("guests")}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "guests"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Guest List & RSVPs ({guests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("template")}
          className={`py-3 px-5 text-sm font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "template"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>Website Template & Theme</span>
        </button>
      </div>

      {/* TAB 1: ITINERARY & FUNCTIONS */}
      {activeTab === "itinerary" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Wedding Functions & Events</h2>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Function</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-gray-700">No events added yet</p>
              <p className="text-xs text-gray-400">
                Add Haldi, Mehendi, Sangeet, Wedding, and Reception to build the digital schedule.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((ev) => (
                <div
                  key={ev._id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {ev.eventType}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base mt-1">{ev.title}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(ev._id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded transition"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(ev.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ""}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{ev.venueName}</span>
                    </p>
                    {ev.dressCode && (
                      <p className="flex items-center gap-2 text-rose-600 font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Dress Code: {ev.dressCode}</span>
                      </p>
                    )}
                  </div>

                  {ev.mapUrl && (
                    <div className="pt-2 border-t border-gray-100">
                      <a
                        href={ev.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Open in Google Maps</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GUEST LIST & RSVP */}
      {activeTab === "guests" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Invited Guests & Headcount</h2>
            <button
              onClick={() => setShowAddGuestModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guest</span>
            </button>
          </div>

          {guests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-gray-700">No guests added yet</p>
              <p className="text-xs text-gray-400">
                Add guests to generate personalized invitation links with instant RSVP capture.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">RSVP Status</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">Personal Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guests.map((g) => {
                    const guestPersonalUrl = `${publicUrl}?guest=${g.inviteCode}`;

                    return (
                      <tr key={g._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {g.name}
                          {g.guestMessage && (
                            <p className="text-[10px] text-gray-400 font-normal italic mt-0.5">
                              &ldquo;{g.guestMessage}&rdquo;
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">{g.phone || "-"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              g.rsvpStatus === "attending"
                                ? "bg-emerald-100 text-emerald-800"
                                : g.rsvpStatus === "declined"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {g.rsvpStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {g.rsvpStatus === "attending" ? `${g.attendeeCount} attending` : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleCopyLink(guestPersonalUrl)}
                            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Copy WhatsApp Invite</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteGuest(g._id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded"
                            title="Remove Guest"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WEBSITE TEMPLATE & THEME */}
      {activeTab === "template" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-rose-600" />
                Select &amp; Personalize Master Theme
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Choose an HTML/CSS/JS master theme and customize the dynamic fields defined in its manifest.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewIframeOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Live Preview</span>
              </button>

              <button
                type="button"
                disabled={savingTemplate}
                onClick={handleSaveTemplateSettings}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {savingTemplate ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Theme Settings</span>
              </button>
            </div>
          </div>

          {templateSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{templateSuccessMsg}</span>
            </div>
          )}

          {/* Step 1: Theme Selection Cards */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider text-[11px]">
              Step 1: Choose Website Theme
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Option: Default Built-in React Patrika */}
              <div
                onClick={() => setSelectedTemplateId("")}
                className={`border-2 rounded-xl p-4 cursor-pointer transition flex flex-col justify-between ${
                  !selectedTemplateId
                    ? "border-rose-600 bg-rose-50/30"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Standard Royal Patrika</span>
                    {!selectedTemplateId && (
                      <span className="text-[10px] bg-rose-600 text-white font-semibold px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Classic Vedic gold-bordered mobile card with interactive RSVP and turn-by-turn Google Maps.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                  Built-in Default Theme
                </div>
              </div>

              {/* Master Templates from Template Engine */}
              {availableTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl._id;
                return (
                  <div
                    key={tmpl._id}
                    onClick={() => setSelectedTemplateId(tmpl._id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? "border-rose-600 bg-rose-50/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{tmpl.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-rose-600 text-white font-semibold px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {tmpl.description || "Master HTML/CSS/JS template with dynamic countdown and animations."}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                      <span>/{tmpl.slug}</span>
                      <span className="text-rose-600 font-sans font-medium">
                        {tmpl.manifest?.customerFields?.length || 0} Dynamic Fields
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Dynamic Form Fields (Rendered from Manifest) */}
          {(() => {
            const currentTmpl = availableTemplates.find((t) => t._id === selectedTemplateId);
            if (!currentTmpl || !currentTmpl.manifest?.customerFields?.length) {
              return null;
            }

            return (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                    Step 2: Manifest Personalization ({currentTmpl.name})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    These fields are dynamically defined by this template&apos;s manifest contract.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTmpl.manifest.customerFields.map((field: any) => {
                    const currentVal =
                      templateContent[field.key] !== undefined
                        ? templateContent[field.key]
                        : field.key === "groomName"
                        ? wedding.groomName
                        : field.key === "brideName"
                        ? wedding.brideName
                        : field.key === "weddingDate"
                        ? wedding.weddingDate?.split("T")[0]
                        : field.key === "venue"
                        ? wedding.venue
                        : field.key === "city"
                        ? wedding.city
                        : field.key === "story"
                        ? wedding.story || ""
                        : field.key === "familyMessage"
                        ? wedding.familyMessage || ""
                        : field.defaultValue || "";

                    return (
                      <div
                        key={field.key}
                        className={field.type === "textarea" ? "md:col-span-2 space-y-1" : "space-y-1"}
                      >
                        <label className="block text-xs font-semibold text-gray-700">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                          <span className="ml-1 text-[10px] font-normal text-gray-400 font-mono">
                            {`{{${field.key}}}`}
                          </span>
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            rows={3}
                            value={currentVal}
                            placeholder={field.placeholder || `Enter ${field.label}...`}
                            onChange={(e) =>
                              setTemplateContent({
                                ...templateContent,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                          />
                        ) : (
                          <input
                            type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                            value={currentVal}
                            placeholder={field.placeholder || `Enter ${field.label}...`}
                            onChange={(e) =>
                              setTemplateContent({
                                ...templateContent,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    disabled={savingTemplate}
                    onClick={handleSaveTemplateSettings}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {savingTemplate ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Save Personalized Details</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* PREVIEW IFRAME MODAL */}
      {previewIframeOpen && wedding && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col p-4 sm:p-6">
          <div className="bg-white rounded-t-xl px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-gray-800">
                Live Preview: {wedding.brideName} &amp; {wedding.groomName}&apos;s Card
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/api/public/wedding/${wedding.slug}/render`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2.5 py-1 bg-rose-50 rounded"
              >
                Open Fullscreen
              </a>
              <button
                onClick={() => setPreviewIframeOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-stone-900 rounded-b-xl overflow-hidden">
            <iframe
              src={`/api/public/wedding/${wedding.slug}/render`}
              className="w-full h-full border-0"
              title="Personalized Wedding Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* MODAL: ADD EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">Add Wedding Function</h2>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {actionError}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Function Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="Haldi">Haldi</option>
                    <option value="Mehendi">Mehendi</option>
                    <option value="Sangeet">Sangeet</option>
                    <option value="Wedding">Wedding Ceremony</option>
                    <option value="Reception">Reception</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Display Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Sangeet Night"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="e.g. 07:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Lawn 1, Brilliant Convention Centre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Dress Code (Optional)
                </label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="e.g. Traditional Yellow / Ethnic Indo-Western"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Function</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GUEST */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">Add Guest</h2>
              <button
                onClick={() => setShowAddGuestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {actionError}
              </div>
            )}

            <form onSubmit={handleCreateGuest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Guest / Family Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sharma Family / Rajesh Verma"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Phone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98260 00000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Default Headcount
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guestHeadcount}
                    onChange={(e) => setGuestHeadcount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="guest@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Guest</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function WeddingDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <WeddingDetailContent weddingId={resolvedParams.id} />;
}

export default function WeddingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-600 mb-2" />
          Loading wedding workspace...
        </div>
      }
    >
      <WeddingDetailWrapper params={params} />
    </Suspense>
  );
}
