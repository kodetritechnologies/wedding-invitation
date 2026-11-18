import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Griha Pravesh Invitation Video Maker",
  description: "Auspicious Griha Pravesh video invitations with sacred mantras, new home photos, and venue directions.",
  alternates: { canonical: `${BRAND.siteUrl}/housewarming/video` },
};

export default function HousewarmingVideoPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "House Warming", href: "/housewarming" }, { label: "Video" }]}
      h1="Griha Pravesh Invitation Video Maker"
      introText="Make an HD housewarming invitation video with music, names, photos and venue. Perfect for WhatsApp status and Instagram. Edit details before you share."
      occasion="housewarming"
      defaultFormat="video"
      supportedFormats={["video"]}
      faqs={[
        { q: "Can I add a picture of our new home in the video?", a: "Yes. Photo slots allow you to showcase your new home facade, living room, or family portrait." },
        { q: "What background audio is included?", a: "Traditional Gayatri Mantra, Shehnai, devotional flute, or your chosen auspicious melody." },
        { q: "How do I share the video?", a: "Download the HD MP4 file and distribute instantly on WhatsApp groups and status." },
      ]}
      relatedOccasions={[{ label: "PDF Griha Pravesh Cards", href: "/housewarming/pdf" }, { label: "Wedding Videos", href: "/wedding/video" }]}
    />
  );
}

