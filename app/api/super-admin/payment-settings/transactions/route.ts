import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";
import { requireSuperAdmin } from "@/lib/api-guard";

export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const searchParams = req.nextUrl.searchParams;
      const status = searchParams.get("status");
      const limit = parseInt(searchParams.get("limit") || "20", 10);

      const filter: Record<string, any> = {};
      if (status && status !== "all") {
        filter.status = status;
      }

      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .limit(Math.min(limit, 100))
        .lean();

      const totalPaid = await Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const totalRevenue = totalPaid.length > 0 ? totalPaid[0].total : 0;
      const paidOrdersCount = await Order.countDocuments({ status: "paid" });
      const totalOrdersCount = await Order.countDocuments();

      return NextResponse.json({
        success: true,
        orders,
        stats: {
          totalRevenue,
          paidOrdersCount,
          totalOrdersCount,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load transactions";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
