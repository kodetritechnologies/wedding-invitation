import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Wedding Invitation Video Maker",
  description:
    "Make an HD wedding invitation video with music, photos and venue. Share on WhatsApp and Instagram in minutes.",
  alternates: {
    canonical: `${BRAND.siteUrl}/wedding/video`,
  },
  openGraph: {
    title: "Wedding Invitation Video Maker",
    description:
      "Make an HD wedding invitation video with music, photos and venue. Share on WhatsApp and Instagram in minutes.",
    url: `${BRAND.siteUrl}/wedding/video`,
    type: "website",
  },
};

export default function WeddingVideoPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Wedding", href: "/wedding" },
        { label: "Video Invitation" },
      ]}
      h1="Wedding Invitation Video Maker"
      introText="Make an HD wedding invitation video with music, names, photos and venue. Perfect for WhatsApp status and Instagram. Edit details before you share."
      occasion="wedding"
      defaultFormat="video"
      supportedFormats={["video"]}
      faqs={[
        {
          q: "What music is used in the wedding video invitation?",
          a: "You can choose from traditional Shehnai, sacred mantras, romantic instrumental tracks, or provide your preferred audio clip.",
        },
        {
          q: "Is the video invitation optimized for mobile screens?",
          a: "Yes. All videos are rendered in crisp 1080p vertical/landscape format perfectly sized for WhatsApp Status, Instagram Stories, and family sharing.",
        },
        {
          q: "How fast can I receive the final video?",
          a: "Standard customized video invitations are prepared and delivered within hours directly via WhatsApp.",
        },
      ]}
      relatedOccasions={[
        { label: "Website Invitation with RSVP", href: "/wedding/invitation-website" },
        { label: "PDF Wedding Cards", href: "/wedding/pdf" },
        { label: "Engagement Videos", href: "/engagement/video" },
      ]}
    />
  );
}

