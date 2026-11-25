import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { requireSuperAdmin } from "@/lib/api-guard";

export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search")?.trim() || "";
      const plan = searchParams.get("plan") || "all";
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));

      const query: Record<string, any> = {};

      if (plan && plan !== "all") {
        query["subscription.plan"] = { $regex: new RegExp(`^${plan}$`, "i") };
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { businessName: { $regex: search, $options: "i" } },
        ];
      }

      const total = await Admin.countDocuments(query);
      const skip = (page - 1) * limit;

      const clients = await Admin.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        clients,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load clients";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
