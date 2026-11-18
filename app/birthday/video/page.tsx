import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Birthday Invitation Video Maker",
  description: "Animated birthday invitation videos with upbeat music, photos, and party venue for WhatsApp.",
  alternates: { canonical: `${BRAND.siteUrl}/birthday/video` },
};

export default function BirthdayVideoPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Birthday", href: "/birthday" }, { label: "Video" }]}
      h1="Birthday Invitation Video Maker"
      introText="Make an HD birthday invitation video with music, names, photos and venue. Perfect for WhatsApp status and Instagram. Edit details before you share."
      occasion="birthday"
      defaultFormat="video"
      supportedFormats={["video"]}
      faqs={[
        { q: "Can I add music from cartoons or trending tracks?", a: "Yes. You can select popular children's tunes, energetic birthday songs, or provide custom audio." },
        { q: "How long is the birthday video?", a: "Most videos are 20 to 35 seconds, ideal for viewing on mobile and sharing on social media." },
        { q: "Can I see a preview before sending?", a: "Yes. We send you a preview on WhatsApp to confirm details before finalizing." },
      ]}
      relatedOccasions={[{ label: "PDF Birthday Cards", href: "/birthday/pdf" }, { label: "Engagement Videos", href: "/engagement/video" }]}
    />
  );
}

