import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Engagement Invitation Video Maker",
  description: "Cinematic animated engagement and ring ceremony video invitations with music for WhatsApp and Instagram.",
  alternates: { canonical: `${BRAND.siteUrl}/engagement/video` },
};

export default function EngagementVideoPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Engagement", href: "/engagement" }, { label: "Video" }]}
      h1="Engagement Invitation Video Maker"
      introText="Make an HD engagement invitation video with music, names, photos and venue. Perfect for WhatsApp status and Instagram. Edit details before you share."
      occasion="engagement"
      defaultFormat="video"
      supportedFormats={["video"]}
      faqs={[
        { q: "Can I add our pre-wedding couple photos?", a: "Yes. Photo-integrated templates let you feature your favorite couple portraits with romantic animations." },
        { q: "Is background music customizable?", a: "Yes, you can choose from romantic instrumental tracks or supply your own song." },
        { q: "What format will I receive?", a: "An MP4 video file in full HD 1080p, optimized for WhatsApp and Instagram." },
      ]}
      relatedOccasions={[{ label: "PDF Engagement Cards", href: "/engagement/pdf" }, { label: "Wedding Videos", href: "/wedding/video" }]}
    />
  );
}

