import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "PDF Anniversary Invitation Cards",
  description: "Printable and digital PDF anniversary party cards with custom family invitation text.",
  alternates: { canonical: `${BRAND.siteUrl}/anniversary/pdf` },
};

export default function AnniversaryPdfPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Anniversary", href: "/anniversary" }, { label: "PDF" }]}
      h1="PDF Anniversary Invitation Cards"
      introText="A clean, printable invitation card you can send on WhatsApp or email, or take to a print shop."
      occasion="anniversary"
      defaultFormat="pdf"
      supportedFormats={["pdf"]}
      faqs={[
        { q: "Can I print this anniversary card on cardstock?", a: "Yes, our vector PDF is ready for high-grade physical printing." },
        { q: "Can we include the children's and grandchildren's names?", a: "Yes. All family host lines can be fully customized." },
        { q: "Is there a venue map on the PDF?", a: "Yes, we can include a scannable QR code linking directly to Google Maps." },
      ]}
      relatedOccasions={[{ label: "Video Anniversary Invitations", href: "/anniversary/video" }, { label: "Wedding PDF Cards", href: "/wedding/pdf" }]}
    />
  );
}

