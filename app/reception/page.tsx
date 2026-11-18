import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Reception Invitation Cards Online",
  description:
    "Elegant reception invitation videos and cards with venue map and timing.",
  alternates: {
    canonical: `${BRAND.siteUrl}/reception`,
  },
  openGraph: {
    title: "Reception Invitation Cards Online",
    description:
      "Elegant reception invitation videos and cards with venue map and timing.",
    url: `${BRAND.siteUrl}/reception`,
    type: "website",
  },
};

export default function ReceptionPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reception" }]}
      h1="Reception Invitation Cards Online"
      introText="Invite esteemed guests to your wedding reception and celebratory dinner gala in style. Browse royal midnight navy, gold foil, and contemporary blush reception templates across Video, printable PDF, and interactive website formats featuring dinner timings, dress code recommendations, and direct Google Maps navigation."
      occasion="reception"
      defaultFormat="all"
      supportedFormats={["all", "website", "video", "pdf"]}
      faqs={[
        {
          q: "Can I mention the dress code on the reception card?",
          a: "Yes. Our cards prominently highlight your chosen dress code (e.g. Formal Indian Ethnic, Black Tie, or Traditional).",
        },
        {
          q: "Can I collect RSVPs to plan the dinner catering?",
          a: "Yes. Reception website invitations include 1-click attendance tracking so you have an accurate headcount for the banquet.",
        },
        {
          q: "How does the map button assist out-of-town guests?",
          a: "Guests tap the Google Maps button to open exact turn-by-turn driving directions to the hotel or banquet gate.",
        },
      ]}
      relatedOccasions={[
        { label: "Wedding Invitations", href: "/wedding" },
        { label: "Engagement Invitations", href: "/engagement" },
        { label: "Anniversary Invitations", href: "/anniversary" },
      ]}
    />
  );
}

