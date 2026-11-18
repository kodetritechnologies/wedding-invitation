import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "PDF Wedding Invitation Cards",
  description:
    "Printable and shareable PDF wedding invitation designs. Customize names, date and venue online.",
  alternates: {
    canonical: `${BRAND.siteUrl}/wedding/pdf`,
  },
  openGraph: {
    title: "PDF Wedding Invitation Cards",
    description:
      "Printable and shareable PDF wedding invitation designs. Customize names, date and venue online.",
    url: `${BRAND.siteUrl}/wedding/pdf`,
    type: "website",
  },
};

export default function WeddingPdfPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Wedding", href: "/wedding" },
        { label: "PDF Invitation" },
      ]}
      h1="PDF Wedding Invitation Cards"
      introText="A clean, printable invitation card you can send on WhatsApp or email, or take to a print shop."
      occasion="wedding"
      defaultFormat="pdf"
      supportedFormats={["pdf"]}
      faqs={[
        {
          q: "Can I print this PDF at a local printing shop?",
          a: "Yes. Our PDF files are rendered in high-resolution CMYK/RGB vector quality, ideal for both digital WhatsApp distribution and physical printing.",
        },
        {
          q: "Can I edit the family names and wedding venue later?",
          a: "Yes. You can update any text details with our support team before finalizing your print or distribution copy.",
        },
        {
          q: "Does the PDF support multiple event pages?",
          a: "Yes. Multi-page PDF booklets covering Haldi, Mehendi, Sangeet and Vivah are available across all classic templates.",
        },
      ]}
      relatedOccasions={[
        { label: "Website Invitation with RSVP", href: "/wedding/invitation-website" },
        { label: "Wedding Invitation Video Maker", href: "/wedding/video" },
        { label: "Engagement PDF Cards", href: "/engagement/pdf" },
      ]}
    />
  );
}

