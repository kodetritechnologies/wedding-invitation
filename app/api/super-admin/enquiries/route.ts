import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import { requireSuperAdmin } from "@/lib/api-guard";

// GET contact enquiries for Super Admin with pagination
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status");
      const search = searchParams.get("search");
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));

      const query: Record<string, unknown> = {};

      if (status && status !== "all") {
        query.status = status;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
          { name: regex },
          { phone: regex },
          { email: regex },
          { message: regex },
          { role: regex },
        ];
      }

      const total = await Contact.countDocuments(query);
      const totalCount = await Contact.countDocuments();
      const unreadCount = await Contact.countDocuments({ status: "unread" });
      const repliedCount = await Contact.countDocuments({ status: "replied" });
      const skip = (page - 1) * limit;

      const enquiries = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        enquiries,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
        counts: {
          total: totalCount,
          unread: unreadCount,
          replied: repliedCount,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load enquiries";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
