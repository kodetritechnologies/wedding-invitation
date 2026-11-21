import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";

export async function GET() {
  try {
    await dbConnect();

    // 1. Look for explicitly marked default template
    let template = await InvitationTemplate.findOne({ isDefault: true })
      .select("name slug description thumbnail category format price isDefault")
      .lean();

    // 2. If none marked, fallback to latest published template
    if (!template) {
      template = await InvitationTemplate.findOne({ status: "published" })
        .sort({ createdAt: -1 })
        .select("name slug description thumbnail category format price isDefault")
        .lean();
    }

    if (!template) {
      return NextResponse.json({
        success: true,
        defaultTemplate: null,
        previewUrl: "/w/aarav-diya",
      });
    }

    return NextResponse.json({
      success: true,
      defaultTemplate: template,
      previewUrl: `/api/public/templates/${template.slug}/preview`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch default template" },
      { status: 500 }
    );
  }
}
