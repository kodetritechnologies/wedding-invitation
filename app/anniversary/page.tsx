import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Anniversary Invitation Cards Online",
  description:
    "Celebrate with a custom anniversary invitation video or PDF. Easy to edit and share.",
  alternates: {
    canonical: `${BRAND.siteUrl}/anniversary`,
  },
  openGraph: {
    title: "Anniversary Invitation Cards Online",
    description:
      "Celebrate with a custom anniversary invitation video or PDF. Easy to edit and share.",
    url: `${BRAND.siteUrl}/anniversary`,
    type: "website",
  },
};

export default function AnniversaryPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Anniversary" }]}
      h1="Anniversary Invitation Cards Online"
      introText="Celebrate 25th Silver, 50th Golden, and milestone wedding anniversaries with elegant digital invitations. Choose from nostalgic photo video cards, high-res printable PDFs, or interactive celebration websites with dinner party locations and RSVP tracking for loved ones."
      occasion="anniversary"
      defaultFormat="all"
      supportedFormats={["all", "website", "video", "pdf"]}
      faqs={[
        {
          q: "Can we include a couple journey photo timeline?",
          a: "Yes. Our Anniversary website and video templates feature dedicated photo slots to showcase the couple's journey over the decades.",
        },
        {
          q: "Can we collect dinner RSVPs from family members?",
          a: "Yes. Website invitations provide an effortless 1-tap headcount submission for catering management.",
        },
        {
          q: "What music is used for anniversary videos?",
          a: "We offer classic nostalgic melodies, instrumental strings, or your family's favorite song.",
        },
      ]}
      relatedOccasions={[
        { label: "Wedding Invitations", href: "/wedding" },
        { label: "Birthday Invitations", href: "/birthday" },
        { label: "Reception Invitations", href: "/reception" },
      ]}
    />
  );
}

