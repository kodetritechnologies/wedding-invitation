"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  CalendarHeart,
  UserCheck,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";

interface WeddingItem {
  _id: string;
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string;
  slug: string;
  status: string;
}

export default function DashboardOverviewPage() {
  const [weddings, setWeddings] = useState<WeddingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const resWeddings = await fetch("/api/admin/weddings");
        if (resWeddings.ok) {
          const dataW = await resWeddings.json();
          setWeddings(dataW.weddings || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalWeddings = weddings.length;
  const publishedWeddings = weddings.filter((w) => w.status === "published").length;
  const draftWeddings = weddings.filter((w) => w.status !== "published").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>

        <Link
          href="/dashboard/weddings"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Wedding Card</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <CalendarHeart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Wedding Cards
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              {totalWeddings}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Live Published Cards
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              {publishedWeddings}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Draft Cards
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              {draftWeddings}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Wedding Cards Table / List (10 Items) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Recent Wedding Cards</h2>
          <Link
            href="/dashboard/weddings"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span>View All Cards</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {weddings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
              <CalendarHeart className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No wedding cards yet</p>
            <Link
              href="/dashboard/weddings"
              className="inline-block mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg shadow-sm"
            >
              Create First Wedding Card
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {weddings.slice(0, 10).map((wedding) => {
              const formattedDate = wedding.weddingDate
                ? new Date(wedding.weddingDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";

              return (
                <div
                  key={wedding._id}
                  className="p-4 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm font-bold text-gray-900">
                        {wedding.brideName} &amp; {wedding.groomName}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          wedding.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {wedding.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formattedDate}
                      </span>
                      {wedding.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {wedding.venue}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {wedding.slug && (
                      <a
                        href={`/w/${wedding.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-1.5"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                    )}

                    <Link
                      href={`/dashboard/weddings/${wedding._id}`}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium flex items-center gap-1"
                    >
                      <span>RSVP Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
