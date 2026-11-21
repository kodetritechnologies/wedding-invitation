import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await dbConnect();

    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      // Seed default settings on initial call
      settings = await SiteSettings.create({
        siteName: "VivahVaani",
        siteTagline: "Royal Digital Wedding Patrika & Multi-Client SaaS",
        logoUrl: "",
        logoText: "VivahVaani",
        faviconUrl: "/favicon.ico",
        address: {
          formattedAddress: "Vijay Nagar, Indore, Madhya Pradesh • 452010",
          city: "Indore",
          state: "Madhya Pradesh",
          pincode: "452010",
          country: "India",
        },
        contact: {
          email: "namaste@vivahvaani.kodetri.com",
          phone: "+91 98260 12345",
          whatsapp: "919826012345",
          workingHours: "Mon - Sun: 10:00 AM - 7:00 PM IST",
        },
        socialLinks: {
          instagram: "",
          facebook: "",
          youtube: "",
          twitter: "",
        },
        footer: {
          copyrightText:
            "© 2026 VivahVaani. Partner by Kodetri Technologies.",
          tagline:
            "“Kalyanam, Mangalyam, Shubham.” Reimagining Indian wedding invitations into timeless, interactive digital patrika experiences.",
        },
        announcementBar: {
          enabled: true,
          text: "✦ शुभ विवाह • Royal Digital Wedding Patrika & Guest Management ✦",
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load site settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
