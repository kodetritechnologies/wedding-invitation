import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";

// GET /api/templates/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    const template = await InvitationTemplate.findOne({
      slug,
      status: { $in: ["published", "unpublished"] }, // Allow existing weddings to access manifest even if unpublished
    })
      .select("name slug description thumbnail manifest designSettings price format category likesCount isDefault")
      .lean();

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load template" },
      { status: 500 }
    );
  }
}
