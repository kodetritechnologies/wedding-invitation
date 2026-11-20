import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import { requireSuperAdmin } from "@/lib/api-guard";

// GET all contact enquiries for Super Admin
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status");
      const search = searchParams.get("search");

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

      const enquiries = await Contact.find(query)
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        enquiries,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load enquiries";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
