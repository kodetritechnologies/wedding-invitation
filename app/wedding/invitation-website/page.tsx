import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Wedding Invitation Website with RSVP",
  description:
    "One wedding link with events, Google Maps and RSVP tracking. Includes a free PDF invitation.",
  alternates: {
    canonical: `${BRAND.siteUrl}/wedding/invitation-website`,
  },
  openGraph: {
    title: "Wedding Invitation Website with RSVP",
    description:
      "One wedding link with events, Google Maps and RSVP tracking. Includes a free PDF invitation.",
    url: `${BRAND.siteUrl}/wedding/invitation-website`,
    type: "website",
  },
};

export default function WeddingWebsitePage() {
  return (
    <OccasionTemplate
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Wedding", href: "/wedding" },
        { label: "Website Invitation" },
      ]}
      h1="Wedding Invitation Website with RSVP"
      introText="One link for every function: dates, venues, Google Maps and RSVP. Your guests open it in a browser, no app needed. A free PDF invitation is included."
      occasion="wedding"
      defaultFormat="website"
      supportedFormats={["website"]}
      faqs={[
        {
          q: "Do I get a PDF card if I choose the Website invitation?",
          a: "Yes. Every Website invitation includes a complimentary printable PDF invitation and an instant WhatsApp shareable link.",
        },
        {
          q: "How does the live RSVP headcount tracker work?",
          a: "Guests open the link, select attending/not attending, enter the number of guests in their party, and submit in one tap. Responses update in your private dashboard.",
        },
        {
          q: "Can outstation relatives navigate directly to the venue?",
          a: "Yes. Each ceremony card features a verified Google Maps GPS link providing turn-by-turn driving directions to the main gate.",
        },
      ]}
      relatedOccasions={[
        { label: "Wedding Invitation Video Maker", href: "/wedding/video" },
        { label: "PDF Wedding Cards", href: "/wedding/pdf" },
        { label: "Engagement Invitations", href: "/engagement" },
      ]}
    />
  );
}

