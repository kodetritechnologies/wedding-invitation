import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Anniversary Invitation Video Maker",
  description: "Create memorable anniversary video invitations with photo slideshows and background music.",
  alternates: { canonical: `${BRAND.siteUrl}/anniversary/video` },
};

export default function AnniversaryVideoPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Anniversary", href: "/anniversary" }, { label: "Video" }]}
      h1="Anniversary Invitation Video Maker"
      introText="Make an HD anniversary invitation video with music, names, photos and venue. Perfect for WhatsApp status and Instagram. Edit details before you share."
      occasion="anniversary"
      defaultFormat="video"
      supportedFormats={["video"]}
      faqs={[
        { q: "How many couple photos can be added?", a: "Most video templates accommodate between 3 to 10 photos showcasing the couple through the years." },
        { q: "Is it suitable for 25th Silver or 50th Golden anniversaries?", a: "Yes, we have specialized themes tailored for 25th and 50th jubilee celebrations." },
        { q: "How do I share the video?", a: "You can download the MP4 file and send it straight to family WhatsApp groups." },
      ]}
      relatedOccasions={[{ label: "PDF Anniversary Cards", href: "/anniversary/pdf" }, { label: "Wedding Videos", href: "/wedding/video" }]}
    />
  );
}

