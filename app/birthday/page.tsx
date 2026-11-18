import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Birthday Invitation Cards Online",
  description:
    "Fun birthday invitation videos and cards for kids and adults. Add photos, music and party details.",
  alternates: {
    canonical: `${BRAND.siteUrl}/birthday`,
  },
  openGraph: {
    title: "Birthday Invitation Cards Online",
    description:
      "Fun birthday invitation videos and cards for kids and adults. Add photos, music and party details.",
    url: `${BRAND.siteUrl}/birthday`,
    type: "website",
  },
};

export default function BirthdayPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Birthday" }]}
      h1="Birthday Invitation Cards Online"
      introText="Make every birthday celebration extraordinary with fun, creative digital invitations. From 1st birthday milestone themes to 50th and 60th milestone celebrations, choose from cheerful animated video invites, printable PDFs, or party websites with Google Maps venue directions and RSVP headcount."
      occasion="birthday"
      defaultFormat="all"
      supportedFormats={["all", "video", "website", "pdf"]}
      faqs={[
        {
          q: "Are designs available for kids' first birthday celebrations?",
          a: "Yes. We feature delightful baby milestone designs with soft pastels, balloons, and baby photo carousels.",
        },
        {
          q: "Can I collect RSVPs to know how many kids and adults are attending?",
          a: "Yes. Website invitations include live RSVP headcount so you can coordinate games, cake, and catering accurately.",
        },
        {
          q: "Can I include a party dress code or theme?",
          a: "Yes. You can specify superhero, princess, retro, or casual dress codes clearly in the event card.",
        },
      ]}
      relatedOccasions={[
        { label: "Anniversary Invitations", href: "/anniversary" },
        { label: "Engagement Invitations", href: "/engagement" },
        { label: "House Warming Invitations", href: "/housewarming" },
      ]}
    />
  );
}

