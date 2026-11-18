import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Engagement Invitation Cards Online",
  description:
    "Create engagement invitation videos and PDFs with your names, date and venue. Share instantly on WhatsApp.",
  alternates: {
    canonical: `${BRAND.siteUrl}/engagement`,
  },
  openGraph: {
    title: "Engagement Invitation Cards Online",
    description:
      "Create engagement invitation videos and PDFs with your names, date and venue. Share instantly on WhatsApp.",
    url: `${BRAND.siteUrl}/engagement`,
    type: "website",
  },
};

export default function EngagementPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Engagement" }]}
      h1="Engagement Invitation Cards Online"
      introText="Celebrate your Sagai and Ring Ceremony with custom digital invitations. Choose from sparkling video cards, printable PDFs, or interactive event websites with Google Maps navigation and guest RSVP. Share easily on WhatsApp with family and friends."
      occasion="engagement"
      defaultFormat="all"
      supportedFormats={["all", "website", "video", "pdf"]}
      faqs={[
        {
          q: "What details should be included in an engagement invitation?",
          a: "Bride and groom names, date, ring exchange time, dinner schedule, and venue address with a Google Maps link.",
        },
        {
          q: "Can I get both a video invite and a website for our Sagai?",
          a: "Yes. Many couples choose a cinematic video for WhatsApp status alongside an interactive website for guest navigation and headcount.",
        },
        {
          q: "How fast can I customize my engagement card?",
          a: "Customization takes just a few minutes, with instant WhatsApp delivery for review.",
        },
      ]}
      relatedOccasions={[
        { label: "Wedding Invitations", href: "/wedding" },
        { label: "Reception Invitations", href: "/reception" },
        { label: "Anniversary Invitations", href: "/anniversary" },
      ]}
    />
  );
}

