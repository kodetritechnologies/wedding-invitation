import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Griha Pravesh Invitation Cards Online",
  description:
    "Traditional and modern Griha Pravesh invitation designs. Video and PDF, ready to share.",
  alternates: {
    canonical: `${BRAND.siteUrl}/housewarming`,
  },
  openGraph: {
    title: "Griha Pravesh Invitation Cards Online",
    description:
      "Traditional and modern Griha Pravesh invitation designs. Video and PDF, ready to share.",
    url: `${BRAND.siteUrl}/housewarming`,
    type: "website",
  },
};

export default function HousewarmingPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "House Warming" }]}
      h1="Griha Pravesh Invitation Cards Online"
      introText="Welcome relatives and friends to your new home with auspicious Griha Pravesh digital invitations. Choose from traditional Toran and Kalash motifs, Vastu puja schedules, high-resolution printable PDFs, or interactive housewarming websites with 1-click Google Maps turn-by-turn navigation straight to your new door."
      occasion="housewarming"
      defaultFormat="all"
      supportedFormats={["all", "website", "video", "pdf"]}
      faqs={[
        {
          q: "How does the Google Maps link help guests find my new house?",
          a: "New houses can be hard to find in developing neighborhoods. The Google Maps button opens your exact GPS coordinates with turn-by-turn navigation so guests arrive without asking for landmarks.",
        },
        {
          q: "Can I include Havan, Vastu Puja and Lunch timings?",
          a: "Yes. Our templates feature an itemized puja and celebration schedule with shubh muhurat times.",
        },
        {
          q: "Can I get a PDF to print for elderly neighbors?",
          a: "Yes. All Website invitations include a free matching PDF card, or you can choose a standalone PDF design."
        },
      ]}
      relatedOccasions={[
        { label: "Wedding Invitations", href: "/wedding" },
        { label: "Engagement Invitations", href: "/engagement" },
        { label: "Birthday Invitations", href: "/birthday" },
      ]}
    />
  );
}

