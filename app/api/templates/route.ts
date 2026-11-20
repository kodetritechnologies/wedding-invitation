import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";

// GET /api/templates - Get all published templates (optional ?category=wedding filter)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: Record<string, any> = { status: "published" };
    if (category && category !== "all") {
      const cat = category.toLowerCase().trim();
      if (cat === "wedding") {
        query.$or = [
          { category: "wedding" },
          { category: { $exists: false } },
          { category: "" },
        ];
      } else {
        query.category = cat;
      }
    }

    const templates = await InvitationTemplate.find(query)
      .select("name slug description thumbnail category manifest designSettings createdAt")
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
