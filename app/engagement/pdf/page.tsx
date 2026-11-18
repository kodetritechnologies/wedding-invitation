import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "PDF Engagement Invitation Cards",
  description: "Printable and instant WhatsApp shareable PDF cards for Sagai and Ring ceremonies.",
  alternates: { canonical: `${BRAND.siteUrl}/engagement/pdf` },
};

export default function EngagementPdfPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Engagement", href: "/engagement" }, { label: "PDF" }]}
      h1="PDF Engagement Invitation Cards"
      introText="A clean, printable invitation card you can send on WhatsApp or email, or take to a print shop."
      occasion="engagement"
      defaultFormat="pdf"
      supportedFormats={["pdf"]}
      faqs={[
        { q: "Can I print this card locally?", a: "Yes. Our engagement PDFs are provided in print-ready vector resolution." },
        { q: "Can both family names be displayed?", a: "Yes. Both the bride and groom families and invitation lines can be customized." },
        { q: "How quickly can I download the PDF?", a: "PDF invitations are prepared and delivered within hours on WhatsApp." },
      ]}
      relatedOccasions={[{ label: "Video Engagement Invitations", href: "/engagement/video" }, { label: "Wedding PDF Cards", href: "/wedding/pdf" }]}
    />
  );
}

