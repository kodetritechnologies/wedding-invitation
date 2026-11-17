"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  CheckCircle2,
  XCircle,
  Loader2,
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

interface WeddingData {
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string;
  city: string;
  story?: string;
  familyMessage?: string;
  contactPersons?: { name: string; phone: string; relation: string }[];
  settings: {
    allowPublicRsvp: boolean;
    showHeadcount: boolean;
  };
}

interface PersonalGuestInfo {
  name: string;
  rsvpStatus: "pending" | "attending" | "declined";
  attendeeCount: number;
  guestMessage?: string;
}

function InvitationContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const guestCode = searchParams.get("guest");

  const [wedding, setWedding] = useState<WeddingData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [guest, setGuest] = useState<PersonalGuestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [status, setStatus] = useState<"attending" | "declined">("attending");
  const [attendeeCount, setAttendeeCount] = useState(2);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  useEffect(() => {
    async function fetchInvitation() {
      try {
        const url = guestCode
          ? `/api/public/wedding/${slug}?guest=${encodeURIComponent(guestCode)}`
          : `/api/public/wedding/${slug}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setNotFound(true);
          return;
        }

        setWedding(data.wedding);
        setEvents(data.events || []);
        if (data.guest) {
          setGuest(data.guest);
          setRsvpName(data.guest.name);
          if (data.guest.rsvpStatus !== "pending") {
            setStatus(data.guest.rsvpStatus);
            setAttendeeCount(data.guest.attendeeCount || 1);
            setMessage(data.guest.guestMessage || "");
            setRsvpSuccess(true);
          }
        }
      } catch (err) {
        console.error("Failed to load invitation", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchInvitation();
  }, [slug, guestCode]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/public/wedding/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestCode: guestCode || undefined,
          name: rsvpName || guest?.name,
          phone: rsvpPhone || undefined,
          rsvpStatus: status,
          attendeeCount: status === "attending" ? attendeeCount : 0,
          guestMessage: message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit RSVP");
      }

      setRsvpSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting RSVP";
      setRsvpError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/40">
        <div className="flex flex-col items-center gap-3">
          <Heart className="w-10 h-10 text-rose-500 animate-pulse fill-rose-500" />
          <p className="text-sm font-medium text-amber-900/70">
            Opening Wedding Invitation...
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center space-y-3">
          <Heart className="w-12 h-12 text-gray-300 mx-auto" />
          <h1 className="text-xl font-bold text-gray-800">Invitation Not Found</h1>
          <p className="text-sm text-gray-500">
            This wedding invitation may be in draft mode or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const weddingDateFormatted = new Date(wedding.weddingDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 antialiased font-serif selection:bg-rose-100">
      {/* Hero Cover Header */}
      <header className="relative bg-gradient-to-b from-rose-950 via-rose-900 to-rose-950 text-amber-50 pt-16 pb-20 px-6 text-center shadow-lg">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-amber-300/40 text-amber-300 mb-1">
            <Heart className="w-5 h-5 fill-amber-300" />
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/90 font-cinzel font-semibold">
            Together with their families
          </p>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-wide font-serif text-amber-100">
            {wedding.brideName}
            <span className="block text-2xl sm:text-3xl font-serif italic text-rose-300 my-1">
              &amp;
            </span>
            {wedding.groomName}
          </h1>

          <div className="pt-2 text-sm sm:text-base font-sans text-amber-200 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{weddingDateFormatted}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-100/80">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>
                {wedding.venue}, {wedding.city}
              </span>
            </div>
          </div>

          {guest && (
            <div className="mt-4 inline-block bg-white/10 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs text-amber-100 font-sans border border-amber-300/30">
              Honoured Guest: <strong className="text-white">{guest.name}</strong>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-12 -mt-6">
        {/* Family Message */}
        {wedding.familyMessage && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 text-center space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-rose-800 font-sans font-bold">
              A Warm Invitation
            </h2>
            <p className="text-base text-stone-700 italic leading-relaxed">
              &ldquo;{wedding.familyMessage}&rdquo;
            </p>
          </section>
        )}

        {/* Multi-Function Itinerary */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest text-rose-800 font-sans font-bold">
              Celebration Itinerary
            </span>
            <h2 className="text-2xl font-bold font-serif text-stone-900">
              Wedding Functions
            </h2>
          </div>

          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-center text-xs text-stone-400 font-sans py-4">
                Detailed function schedule will be updated shortly.
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200/80 hover:border-amber-400/50 transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase font-sans px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                        {event.eventType}
                      </span>
                      <h3 className="text-lg font-bold font-serif text-stone-900 mt-1.5">
                        {event.title}
                      </h3>
                    </div>

                    <div className="text-right font-sans text-xs text-stone-500">
                      <p className="font-semibold text-stone-800">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="flex items-center gap-1 justify-end text-rose-700 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{event.startTime}</span>
                      </p>
                    </div>
                  </div>

                  <div className="font-sans text-xs text-stone-600 space-y-1 pt-1 border-t border-stone-100">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{event.venueName}</span>
                    </p>

                    {event.dressCode && (
                      <p className="flex items-center gap-2 text-rose-800 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Dress Code: {event.dressCode}</span>
                      </p>
                    )}
                  </div>

                  {event.mapUrl && (
                    <div className="pt-2">
                      <a
                        href={event.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>View Location Map</span>
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Interactive RSVP Section */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest text-rose-800 font-sans font-bold">
              Response Requested
            </span>
            <h2 className="text-2xl font-bold font-serif text-stone-900">
              Will You Attend?
            </h2>
            <p className="text-xs font-sans text-stone-500">
              Please RSVP to help our families organize seating and catering arrangements.
            </p>
          </div>

          {rsvpSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 font-sans">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">
                Thank You for Responding!
              </h3>
              <p className="text-xs text-emerald-700">
                {status === "attending"
                  ? `We are delighted that you (${attendeeCount} guest(s)) will join the celebrations!`
                  : "We received your response and will miss you at the celebrations!"}
              </p>
              <button
                onClick={() => setRsvpSuccess(false)}
                className="text-xs text-emerald-800 font-semibold underline mt-2 cursor-pointer"
              >
                Change or update response
              </button>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4 font-sans text-sm">
              {rsvpError && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {rsvpError}
                </div>
              )}

              {/* Status Radio */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("attending")}
                  className={`p-3 rounded-xl border text-center font-semibold text-xs transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    status === "attending"
                      ? "bg-rose-50 border-rose-600 text-rose-800 ring-1 ring-rose-600"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  <span>Joyfully Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("declined")}
                  className={`p-3 rounded-xl border text-center font-semibold text-xs transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    status === "declined"
                      ? "bg-stone-200 border-stone-500 text-stone-900 ring-1 ring-stone-500"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <XCircle className="w-4 h-4 text-stone-500" />
                  <span>Regretfully Decline</span>
                </button>
              </div>

              {/* Guest Name & Phone (if not personalized) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="e.g. Sharma Family / Rajesh Verma"
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                />
              </div>

              {status === "attending" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                      Attending Headcount
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={attendeeCount}
                      onChange={(e) => setAttendeeCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="+91 98260 00000"
                      className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Blessings & Wishes for Couple
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  placeholder="Share your warm wishes and blessings..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Submit My RSVP</span>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Contact Assistance */}
        {wedding.contactPersons && wedding.contactPersons.length > 0 && (
          <section className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200 space-y-3 font-sans">
            <h3 className="text-xs font-bold uppercase text-stone-500 tracking-wider text-center">
              For Venue & Travel Assistance
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-700">
              {wedding.contactPersons.map((cp, idx) => (
                <a
                  key={idx}
                  href={`tel:${cp.phone}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200 hover:border-rose-300 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>
                    <strong>{cp.name}</strong> ({cp.relation}): {cp.phone}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 font-sans text-xs text-stone-400 border-t border-stone-200 space-y-1">
        <p>Created with ShaadiConnect — Digital Wedding Invitations & RSVPs</p>
      </footer>
    </div>
  );
}

function InvitationWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  return <InvitationContent slug={resolvedParams.slug} />;
}

export default function PublicWeddingInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
        </div>
      }
    >
      <InvitationWrapper params={params} />
    </Suspense>
  );
}
