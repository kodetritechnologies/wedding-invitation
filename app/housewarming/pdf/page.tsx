import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "PDF Griha Pravesh Invitation Cards",
  description: "Printable and digital PDF invitation cards for Griha Pravesh and Vastu Shanti puja.",
  alternates: { canonical: `${BRAND.siteUrl}/housewarming/pdf` },
};

export default function HousewarmingPdfPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "House Warming", href: "/housewarming" }, { label: "PDF" }]}
      h1="PDF Griha Pravesh Invitation Cards"
      introText="A clean, printable invitation card you can send on WhatsApp or email, or take to a print shop."
      occasion="housewarming"
      defaultFormat="pdf"
      supportedFormats={["pdf"]}
      faqs={[
        { q: "Is the PDF card printable at standard dimensions?", a: "Yes. Cards are created in high-res A5 or 5x7 vector format for crisp paper prints." },
        { q: "Can I add Sanskrit shloks on the PDF?", a: "Yes. All auspicious shloks and Vedic blessings can be personalized." },
        { q: "Can we include the new full postal address?", a: "Yes. The complete address, landmark, and optional QR code can be printed on the card." },
      ]}
      relatedOccasions={[{ label: "Video Griha Pravesh Invitations", href: "/housewarming/video" }, { label: "Wedding PDF Cards", href: "/wedding/pdf" }]}
    />
  );
}

