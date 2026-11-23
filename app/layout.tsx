import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vivahvaani.kodetri.com"),
  title: "VivahVaani — Har Shaadi Ki Shuruaat, Ek Khoobsurat Nimantran",
  description:
    "VivahVaani by Kodetri Technologies — Royal interactive digital wedding patrika with Google Maps navigation, live RSVP headcount tracking, and 1-click WhatsApp distribution.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hi"
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased text-stone-700 bg-white selection:bg-[#720E16] selection:text-white">
        {children}
        <Suspense fallback={null}>
          <FloatingWhatsApp />
        </Suspense>
      </body>
    </html>
  );
}
