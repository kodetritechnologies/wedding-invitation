import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";

// GET /api/templates - Get all published templates (optional ?category=wedding filter)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const format = searchParams.get("format");

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

    if (format && format !== "all") {
      const fmt = format.toLowerCase().trim();
      if (fmt === "website") {
        const websiteCond = {
          $or: [
            { format: "website" },
            { format: { $exists: false } },
            { format: "" },
            { format: null },
          ],
        };
        if (query.$or) {
          query.$and = [{ $or: query.$or }, websiteCond];
          delete query.$or;
        } else {
          query.$or = websiteCond.$or;
        }
      } else {
        query.format = fmt;
      }
    }

    const templates = await InvitationTemplate.find(query)
      .select("name slug description thumbnail category format price likesCount isDefault manifest designSettings createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Find the current default template for live demo showcase
    const defaultTemplate =
      templates.find((t: any) => t.isDefault) ||
      (await InvitationTemplate.findOne({ isDefault: true }).select("name slug description thumbnail category format price isDefault").lean()) ||
      templates[0] ||
      null;

    return NextResponse.json({
      success: true,
      templates,
      defaultTemplate,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
