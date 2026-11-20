"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Filter,
} from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";
import { CATALOG, OccasionType, FormatType, CatalogItem } from "@/lib/catalog";
import { BRAND } from "@/lib/brand";

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedOccasion {
  label: string;
  href: string;
}

interface OccasionTemplateProps {
  breadcrumbs: { label: string; href?: string }[];
  h1: string;
  introText: string;
  occasion: OccasionType;
  defaultFormat?: FormatType | "all";
  supportedFormats?: (FormatType | "all")[];
  faqs: FaqItem[];
  relatedOccasions: RelatedOccasion[];
}

export default function OccasionTemplate({
  breadcrumbs,
  h1,
  introText,
  occasion,
  defaultFormat = "all",
  supportedFormats = ["all", "website", "video", "pdf"],
  faqs,
  relatedOccasions,
}: OccasionTemplateProps) {
  const [selectedFormat, setSelectedFormat] = useState<FormatType | "all">(defaultFormat);
  const [selectedTradition, setSelectedTradition] = useState<string>("all");
  const [selectedPriceSort, setSelectedPriceSort] = useState<"default" | "lowToHigh" | "highToLow">("default");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currentFaqs, setCurrentFaqs] = useState<FaqItem[]>(faqs);
  const [dbTemplates, setDbTemplates] = useState<CatalogItem[]>([]);

  // Fetch real master templates uploaded by Super Admin for this specific occasion category
  useEffect(() => {
    async function loadDbTemplates() {
      try {
        const res = await fetch(`/api/templates?category=${encodeURIComponent(occasion)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.templates) && data.templates.length > 0) {
            const mapped: CatalogItem[] = data.templates.map((t: any) => ({
              id: `db-${t._id || t.slug}`,
              slug: t.slug,
              title: t.name,
              occasion: (t.category || occasion) as OccasionType,
              format: "website" as FormatType,
              tradition: "Royal Heritage",
              style: "Palace Gold & Crimson",
              price: 399,
              badge: "trending" as const,
              language: "Hindi & English",
              bgGradient: "from-rose-950 via-rose-900 to-amber-950",
              demoSlug: t.slug,
              description:
                t.description ||
                "Full interactive master theme with dynamic countdown, Vedic shlokas, and Google Maps GPS navigation.",
              isDynamicMaster: true,
            }));
            setDbTemplates(mapped);
          } else {
            setDbTemplates([]);
          }
        }
      } catch {
        setDbTemplates([]);
      }
    }
    loadDbTemplates();
  }, [occasion]);

  // Sync when prop changes
  useEffect(() => {
    setCurrentFaqs(faqs);
  }, [faqs]);

  // Dynamically load category/occasion specific FAQs from Super Admin
  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch(`/api/public/faqs?category=${occasion}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.faqs) && data.faqs.length > 0) {
            setCurrentFaqs(
              data.faqs.map((f: { question: string; answer: string }) => ({
                q: f.question,
                a: f.answer,
              }))
            );
          }
        }
      } catch {
        // Keep initial faqs
      }
    }
    loadFaqs();
  }, [occasion]);

  // Available traditions for this occasion (Strictly dynamic from DB when available)
  const traditions = useMemo(() => {
    const list = dbTemplates.map((item) => item.tradition);
    return Array.from(new Set(list));
  }, [dbTemplates]);

  // Filtered and sorted items - 100% Pure Dynamic from Database
  const filteredItems: CatalogItem[] = useMemo(() => {
    let items = [...dbTemplates];

    // Format filter
    if (selectedFormat !== "all") {
      items = items.filter((item) => item.format === selectedFormat);
    }

    // Tradition filter
    if (selectedTradition !== "all") {
      items = items.filter((item) => item.tradition === selectedTradition);
    }

    // Price sort
    if (selectedPriceSort === "lowToHigh") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (selectedPriceSort === "highToLow") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [selectedFormat, selectedTradition, selectedPriceSort, dbTemplates]);

  // JSON-LD Schema for ItemList, BreadcrumbList, and FAQPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: crumb.label,
          item: crumb.href ? `${BRAND.siteUrl}${crumb.href}` : undefined,
        })),
      },
      {
        "@type": "ItemList",
        name: h1,
        itemListElement: filteredItems.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.title,
          description: item.description,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: item.price,
            availability: "https://schema.org/InStock",
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicHeader />

      <main className="flex-1">
        {/* HERO & INTRO HEADER */}
        <section className="pt-8 pb-12 px-4 sm:px-8 border-b border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB]">
          <div className=" mx-auto space-y-4">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <span key={i} className="flex items-center gap-1.5">
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="hover:text-rose-800 transition">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-stone-900 font-semibold" : ""}>{crumb.label}</span>
                    )}
                    {!isLast && <ChevronRight className="w-3.5 h-3.5 text-stone-400" />}
                  </span>
                );
              })}
            </nav>

            {/* H1 */}
            <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-[1.15]">
              {h1}
            </h1>

            {/* 80-120 words Intro Text */}
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-3xl">
              {introText}
            </p>
          </div>
        </section>

        {/* FILTERS & FORMAT TABS */}
        <section className="py-6 px-4 sm:px-8  mx-auto">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Format Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {supportedFormats.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition capitalize cursor-pointer whitespace-nowrap min-h-[44px] ${
                    selectedFormat === fmt
                      ? "bg-rose-800 text-white shadow-xs"
                      : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {fmt === "all" ? "All Formats" : `${fmt.toUpperCase()} Invitation`}
                </button>
              ))}
            </div>

            {/* Dropdown Filters: Tradition & Price */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Tradition Filter */}
              {traditions.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Filter className="w-3.5 h-3.5 text-stone-500" />
                  <select
                    aria-label="Filter by tradition"
                    value={selectedTradition}
                    onChange={(e) => setSelectedTradition(e.target.value)}
                    className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px]"
                  >
                    <option value="all">All Traditions</option>
                    {traditions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Sort */}
              <div className="flex items-center gap-1.5 text-xs">
                <select
                  aria-label="Sort by price"
                  value={selectedPriceSort}
                  onChange={(e) => setSelectedPriceSort(e.target.value as "default" | "lowToHigh" | "highToLow")}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px]"
                >
                  <option value="default">Sort: Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* TEMPLATE GRID */}
        <section className="py-6 px-4 sm:px-8  mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <p className="text-sm font-bold text-stone-800">
                No designs match your chosen format or filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFormat("all");
                  setSelectedTradition("all");
                  setSelectedPriceSort("default");
                }}
                className="px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-bold transition min-h-[44px]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Card Visual Header */}
                  <div className={`h-52 bg-gradient-to-br ${item.bgGradient} p-5 flex flex-col justify-between text-white relative`}>
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-amber-200 border border-white/20">
                        {item.format === "website" ? "Website" : item.format === "video" ? "Video" : "PDF"}
                      </span>

                      {/* Product Rule Badge */}
                      {item.format === "website" && (
                        <span className="text-[9px] font-bold bg-amber-400/90 text-rose-950 px-2 py-0.5 rounded-md shadow-xs">
                          Includes PDF + Link
                        </span>
                      )}

                      {item.badge && item.format !== "website" && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="text-center space-y-1 relative z-10 py-2">
                      <p className="text-[10px] text-amber-200/80 font-medium">
                        {item.tradition}
                      </p>
                      <h3 className="text-xl font-bold text-amber-100 tracking-wide">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-stone-300">{item.style}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-300 relative z-10 border-t border-white/10 pt-2">
                      <span>{item.language}</span>
                      <span className="font-bold text-amber-300 text-sm">₹{item.price}</span>
                    </div>
                  </div>

                  {/* Card Content & CTAs */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                      {item.demoSlug ? (
                        <Link
                          href={
                            (item as any).isDynamicMaster
                              ? `/api/public/templates/${item.slug}/preview`
                              : `/w/${item.demoSlug}`
                          }
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-rose-700 transition py-2 px-3 rounded-xl border border-stone-200 min-h-[44px]"
                        >
                          <Eye className="w-3.5 h-3.5 text-rose-600" />
                          <span>Live Demo</span>
                        </Link>
                      ) : (
                        <a
                          href={`https://wa.me/${BRAND.whatsapp}?text=Namaste!%20I%20would%20like%20to%20see%20a%20sample%20of%20${encodeURIComponent(item.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-rose-700 transition py-2 px-3 rounded-xl border border-stone-200 min-h-[44px]"
                        >
                          <Eye className="w-3.5 h-3.5 text-rose-600" />
                          <span>Sample Video</span>
                        </a>
                      )}

                      <a
                        href={`https://wa.me/${BRAND.whatsapp}?text=Namaste!%20I%20would%20like%20to%20customize%20${encodeURIComponent(item.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-amber-50 text-xs font-bold rounded-xl shadow-xs transition min-h-[44px]"
                      >
                        <span>Choose Design</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3 PAGE-SPECIFIC FAQS */}
        {currentFaqs.length > 0 && (
          <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 border-b border-stone-200 pb-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {currentFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-stone-900 cursor-pointer hover:text-rose-800 min-h-[44px]"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* RELATED OCCASIONS LINKS */}
        {relatedOccasions.length > 0 && (
          <section className="py-12 px-4 sm:px-8 border-t border-amber-900/10 bg-amber-50/30">
            <div className=" mx-auto space-y-4 text-center sm:text-left">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">
                Explore Other Celebrations
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                {relatedOccasions.map((rel, i) => (
                  <Link
                    key={i}
                    href={rel.href}
                    className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl border border-stone-200 shadow-2xs transition min-h-[44px] flex items-center"
                  >
                    {rel.label} →
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

