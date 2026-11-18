import { Metadata } from "next";
import OccasionTemplate from "@/components/public/OccasionTemplate";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "PDF Birthday Invitation Cards",
  description: "Printable and digital PDF birthday invitation cards with party time, address and theme details.",
  alternates: { canonical: `${BRAND.siteUrl}/birthday/pdf` },
};

export default function BirthdayPdfPage() {
  return (
    <OccasionTemplate
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Birthday", href: "/birthday" }, { label: "PDF" }]}
      h1="PDF Birthday Invitation Cards"
      introText="A clean, printable invitation card you can send on WhatsApp or email, or take to a print shop."
      occasion="birthday"
      defaultFormat="pdf"
      supportedFormats={["pdf"]}
      faqs={[
        { q: "Can I print this at home or a local photo lab?", a: "Yes. Our birthday PDF cards are formatted in standard 5x7 or A5 print dimensions." },
        { q: "Can I customize the wording for an adult milestone party?", a: "Yes. All headers and messages are completely customizable." },
        { q: "Can I get a WhatsApp link with the PDF?", a: "Yes, you can also upgrade to an interactive celebration website." },
      ]}
      relatedOccasions={[{ label: "Video Birthday Invitations", href: "/birthday/video" }, { label: "Wedding PDF Cards", href: "/wedding/pdf" }]}
    />
  );
}

