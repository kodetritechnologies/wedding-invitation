import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";
import { requireSuperAdmin } from "@/lib/api-guard";

export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const searchParams = req.nextUrl.searchParams;
      const search = searchParams.get("search")?.trim() || "";
      const status = searchParams.get("status") || "all";
      const mode = searchParams.get("mode") || "all";
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));

      const filter: Record<string, any> = {};

      if (status && status !== "all") {
        filter.status = status;
      }

      if (mode && mode !== "all") {
        filter.mode = mode;
      }

      if (search) {
        filter.$or = [
          { orderId: { $regex: search, $options: "i" } },
          { razorpayOrderId: { $regex: search, $options: "i" } },
          { razorpayPaymentId: { $regex: search, $options: "i" } },
          { customerName: { $regex: search, $options: "i" } },
          { customerPhone: { $regex: search, $options: "i" } },
          { customerEmail: { $regex: search, $options: "i" } },
          { templateTitle: { $regex: search, $options: "i" } },
        ];
      }

      const total = await Order.countDocuments(filter);
      const skip = (page - 1) * limit;

      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Aggregate statistics
      const totalPaid = await Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const totalRevenue = totalPaid.length > 0 ? totalPaid[0].total : 0;
      const paidOrdersCount = await Order.countDocuments({ status: "paid" });
      const pendingOrdersCount = await Order.countDocuments({ status: "created" });
      const failedOrdersCount = await Order.countDocuments({ status: "failed" });
      const totalOrdersCount = await Order.countDocuments();

      return NextResponse.json({
        success: true,
        orders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
        stats: {
          totalRevenue,
          paidOrdersCount,
          pendingOrdersCount,
          failedOrdersCount,
          totalOrdersCount,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load orders";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
