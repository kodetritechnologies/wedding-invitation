import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import SiteSettings from "@/models/SiteSettings";
import { requireSuperAdmin } from "@/lib/api-guard";

// GET Super Admin Site Settings
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();
      let settings = await SiteSettings.findOne().lean();

      if (!settings) {
        settings = await SiteSettings.create({});
      }

      return NextResponse.json({
        success: true,
        settings,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load settings";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// PUT / UPDATE Super Admin Site Settings
export async function PUT(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      const body = await req.json();

      await dbConnect();

      // Upsert the single settings document
      const updatedSettings = await SiteSettings.findOneAndUpdate(
        {},
        {
          $set: {
            siteName: body.siteName,
            siteTagline: body.siteTagline,
            logoUrl: body.logoUrl,
            logoText: body.logoText,
            faviconUrl: body.faviconUrl,
            address: {
              formattedAddress: body.address?.formattedAddress,
              city: body.address?.city,
              state: body.address?.state,
              pincode: body.address?.pincode,
              country: body.address?.country,
            },
            contact: {
              email: body.contact?.email,
              phone: body.contact?.phone,
              whatsapp: body.contact?.whatsapp,
              workingHours: body.contact?.workingHours,
            },
            socialLinks: {
              instagram: body.socialLinks?.instagram,
              facebook: body.socialLinks?.facebook,
              youtube: body.socialLinks?.youtube,
              twitter: body.socialLinks?.twitter,
            },
            footer: {
              copyrightText: body.footer?.copyrightText,
              tagline: body.footer?.tagline,
            },
            announcementBar: {
              enabled: body.announcementBar?.enabled ?? true,
              text: body.announcementBar?.text,
            },
          },
        },
        { new: true, upsert: true, runValidators: true }
      );

      return NextResponse.json({
        success: true,
        message: "Website settings updated successfully",
        settings: updatedSettings,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update settings";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
