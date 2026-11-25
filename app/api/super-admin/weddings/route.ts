import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import { requireSuperAdmin } from "@/lib/api-guard";

export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search")?.trim() || "";
      const status = searchParams.get("status") || "all";
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));

      const query: Record<string, any> = {};

      if (status && status !== "all") {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { brideName: { $regex: search, $options: "i" } },
          { groomName: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
        ];
      }

      const total = await Wedding.countDocuments(query);
      const skip = (page - 1) * limit;

      const weddings = await Wedding.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        weddings,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load weddings";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
