import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Wedding Invitation Cards Online",
  description:
    "Browse digital wedding invitations for Hindu, Muslim and South Indian weddings. Add Haldi, Mehndi, Sangeet and Reception in one invite.",
  alternates: {
    canonical: `${BRAND.siteUrl}/wedding`,
  },
  openGraph: {
    title: "Wedding Invitation Cards Online",
    description:
      "Browse digital wedding invitations for Hindu, Muslim and South Indian weddings. Add Haldi, Mehndi, Sangeet and Reception in one invite.",
    url: `${BRAND.siteUrl}/wedding`,
    type: "website",
  },
};

export default function WeddingPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wedding" }]}
      h1="Wedding Invitation Cards Online"
      introText="Create a beautiful digital wedding invitation in minutes. Choose a Video, PDF or Website design for Hindu, Muslim and South Indian weddings, add Haldi, Mehndi, Sangeet and Reception events, and share it on WhatsApp. Website invitations include a free PDF and a shareable link."
      occasion="wedding"
      defaultFormat="all"
      supportedFormats={["all", "website", "video", "pdf"]}
      faqs={[
        {
          q: "How do I share my digital wedding card on WhatsApp?",
          a: "Once customized, you receive a direct link and downloadable PDF. You can send it directly to individual chats, family groups, or post it on WhatsApp status.",
        },
        {
          q: "Can I add all ceremonies like Haldi, Mehndi, Sangeet and Reception?",
          a: "Yes. Our Website invitations allow you to add every wedding function with its separate date, shubh muhurat, venue and GPS map location.",
        },
        {
          q: "What makes Website invitations better than a plain PDF card?",
          a: "Website invitations include interactive Google Maps 1-click navigation for your guests, live RSVP headcount tracking, and a photo gallery, while also including a free PDF.",
        },
      ]}
      relatedOccasions={[
        { label: "Engagement Invitations", href: "/engagement" },
        { label: "Reception Invitations", href: "/reception" },
        { label: "Anniversary Invitations", href: "/anniversary" },
      ]}
    />
  );
}

