import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import Wedding from "@/models/Wedding";
import Client from "@/models/Client";
import Guest from "@/models/Guest";
import { requireSuperAdmin } from "@/lib/api-guard";

export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const [totalAdmins, totalWeddings, totalClients, totalGuests, recentAdmins, recentWeddings] =
        await Promise.all([
          Admin.countDocuments(),
          Wedding.countDocuments(),
          Client.countDocuments(),
          Guest.countDocuments(),
          Admin.find().select("-password").sort({ createdAt: -1 }).limit(50),
          Wedding.find().sort({ createdAt: -1 }).limit(50).lean(),
        ]);

      return NextResponse.json({
        success: true,
        stats: {
          totalAdmins,
          totalWeddings,
          totalClients,
          totalGuests,
        },
        recentAdmins,
        recentWeddings,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load overview";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
