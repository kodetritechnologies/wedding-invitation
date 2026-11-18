export type OccasionType =
  | "wedding"
  | "engagement"
  | "anniversary"
  | "birthday"
  | "housewarming"
  | "reception";

export type FormatType = "video" | "pdf" | "website";

export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  occasion: OccasionType;
  format: FormatType;
  tradition: string;
  style: string;
  price: number;
  badge: "trending" | "popular" | "premium" | null;
  language: string;
  bgGradient: string;
  demoSlug?: string;
  description: string;
}

export const PRICES = {
  websiteStarting: 299,
  videoStarting: 499,
  pdfStarting: 199,
  minPrice: 199,
};

export const CATALOG: CatalogItem[] = [
  {
    id: "cat-1",
    slug: "jaipur-royal-heritage-wedding",
    title: "Jaipur Royal Heritage Wedding",
    occasion: "wedding",
    format: "website",
    tradition: "North Indian / Rajputi",
    style: "Royal Palace Maroon & Gold",
    price: 399,
    badge: "trending",
    language: "Hindi & English",
    bgGradient: "from-rose-950 via-rose-900 to-amber-950",
    demoSlug: "aarav-diya",
    description: "Palace arch motifs, Google Maps turn-by-turn navigation, and live RSVP guest headcount tracking.",
  },
  {
    id: "cat-2",
    slug: "vedic-shubh-vivah-website",
    title: "Vedic Shubh Vivah Patrika",
    occasion: "wedding",
    format: "website",
    tradition: "Hindu Vedic",
    style: "Sacred Kalash Sindoor & Gold",
    price: 499,
    badge: "popular",
    language: "Sanskrit, Hindi & English",
    bgGradient: "from-amber-950 via-rose-900 to-amber-900",
    demoSlug: "aarav-diya",
    description: "Shubh muhurat schedule, 7 Pheras symbolism, venue GPS links, and family blessings section.",
  },
  {
    id: "cat-3",
    slug: "blush-botanical-wedding-video",
    title: "Blush Botanical Wedding Video",
    occasion: "wedding",
    format: "video",
    tradition: "Contemporary",
    style: "Pastel Watercolor & Gold Foil",
    price: 699,
    badge: "premium",
    language: "English & Hinglish",
    bgGradient: "from-pink-950 via-rose-900 to-stone-950",
    description: "HD animated invite with soothing Shehnai music, customizable photos, and instant WhatsApp status sizing.",
  },
  {
    id: "cat-4",
    slug: "classic-royal-wedding-pdf",
    title: "Classic Royal Wedding PDF Card",
    occasion: "wedding",
    format: "pdf",
    tradition: "Traditional Indian",
    style: "Gold Mandala & Vintage Border",
    price: 199,
    badge: "popular",
    language: "Hindi & English",
    bgGradient: "from-stone-900 via-amber-950 to-stone-900",
    description: "High-resolution vector printable PDF with WhatsApp sharing optimization and auspicious shloks.",
  },
  {
    id: "cat-5",
    slug: "royal-sagai-engagement-website",
    title: "Royal Sagai & Ring Ceremony",
    occasion: "engagement",
    format: "website",
    tradition: "North Indian",
    style: "Emerald Gold Glitter & Velvet",
    price: 349,
    badge: "trending",
    language: "English & Hindi",
    bgGradient: "from-emerald-950 via-emerald-900 to-amber-950",
    demoSlug: "aarav-diya",
    description: "Ring exchange timeline, couple love story carousel, venue GPS directions, and RSVP headcount.",
  },
  {
    id: "cat-6",
    slug: "glittering-rings-engagement-video",
    title: "Glittering Rings Engagement Video",
    occasion: "engagement",
    format: "video",
    tradition: "Modern",
    style: "Diamond Sparkle & Soft Strings",
    price: 599,
    badge: "premium",
    language: "English",
    bgGradient: "from-cyan-950 via-slate-900 to-amber-950",
    description: "Romantic cinematic 30-second teaser with animated couple portrait and venue reveal.",
  },
  {
    id: "cat-7",
    slug: "golden-jubilee-anniversary-website",
    title: "Silver & Golden Anniversary Celebration",
    occasion: "anniversary",
    format: "website",
    tradition: "All Traditions",
    style: "Warm Champagne Gold & Ivory",
    price: 349,
    badge: "popular",
    language: "Hindi & English",
    bgGradient: "from-amber-950 via-yellow-950 to-stone-950",
    demoSlug: "aarav-diya",
    description: "25/50 years journey photo timeline, celebration venue navigation, and family RSVP tracker.",
  },
  {
    id: "cat-8",
    slug: "milestone-anniversary-video",
    title: "Timeless Love Anniversary Video",
    occasion: "anniversary",
    format: "video",
    tradition: "Contemporary",
    style: "Vintage Film Slides & Instrumental",
    price: 549,
    badge: "premium",
    language: "English",
    bgGradient: "from-rose-950 via-stone-900 to-amber-950",
    description: "Emotional photo montage video with anniversary party invitations, time, and dinner venue.",
  },
  {
    id: "cat-9",
    slug: "little-prince-birthday-video",
    title: "Kids Fantasy 1st Birthday Video",
    occasion: "birthday",
    format: "video",
    tradition: "Fun & Modern",
    style: "Pastel Balloons & Cheerful Music",
    price: 499,
    badge: "trending",
    language: "English",
    bgGradient: "from-blue-950 via-indigo-900 to-purple-950",
    description: "Cute animated milestone invite with baby milestones, party theme dress code, and venue location.",
  },
  {
    id: "cat-10",
    slug: "shubh-griha-pravesh-website",
    title: "Shubh Griha Pravesh & Vastu Puja",
    occasion: "housewarming",
    format: "website",
    tradition: "Vedic Traditional",
    style: "Mango Leaves Toran & Kalash Gold",
    price: 299,
    badge: "popular",
    language: "Hindi & Sanskrit",
    bgGradient: "from-amber-950 via-orange-950 to-stone-950",
    demoSlug: "aarav-diya",
    description: "Havan & Vastu puja muhurat schedule, Google Maps direct gate navigation, and lunch RSVP.",
  },
  {
    id: "cat-11",
    slug: "traditional-griha-pravesh-pdf",
    title: "Traditional Griha Pravesh PDF Card",
    occasion: "housewarming",
    format: "pdf",
    tradition: "Traditional",
    style: "Rangoli Borders & Marigold Yellow",
    price: 199,
    badge: null,
    language: "Hindi & English",
    bgGradient: "from-yellow-950 via-amber-900 to-stone-900",
    description: "Printable and instant WhatsApp shareable card with full family address and muhurat timing.",
  },
  {
    id: "cat-12",
    slug: "grand-wedding-reception-website",
    title: "Grand Evening Reception & Dawat",
    occasion: "reception",
    format: "website",
    tradition: "Modern & Royal",
    style: "Midnight Navy, Velvet & Gold Arches",
    price: 349,
    badge: "premium",
    language: "English & Hindi",
    bgGradient: "from-slate-950 via-indigo-950 to-amber-950",
    demoSlug: "aarav-diya",
    description: "Dinner gala schedule, banquet venue GPS, live attendance counting, and dress code guidance.",
  },
];

