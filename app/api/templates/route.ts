import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";

// GET /api/templates - Get all published templates for wedding creators
export async function GET() {
  try {
    await dbConnect();

    const templates = await InvitationTemplate.find({ status: "published" })
      .select("name slug description thumbnail manifest designSettings createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
