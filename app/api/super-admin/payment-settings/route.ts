import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireSuperAdmin } from "@/lib/api-guard";

// GET Super Admin Payment Gateway Settings
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();
      let settings = await Payment.findOne().lean();

      if (!settings) {
        settings = await Payment.create({
          isActive: true,
          mode: "test",
          testKeyId: "",
          testKeySecret: "",
          liveKeyId: "",
          liveKeySecret: "",
          currency: "INR",
        });
      }

      return NextResponse.json({
        success: true,
        settings,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load payment settings";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// PUT / UPDATE Super Admin Payment Gateway Settings
export async function PUT(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      const body = await req.json();
      await dbConnect();

      const {
        isActive,
        mode,
        testKeyId,
        testKeySecret,
        liveKeyId,
        liveKeySecret,
        currency,
      } = body;

      const updated = await Payment.findOneAndUpdate(
        {},
        {
          $set: {
            isActive: typeof isActive === "boolean" ? isActive : true,
            mode: mode === "live" ? "live" : "test",
            testKeyId: (testKeyId || "").trim(),
            testKeySecret: (testKeySecret || "").trim(),
            liveKeyId: (liveKeyId || "").trim(),
            liveKeySecret: (liveKeySecret || "").trim(),
            currency: (currency || "INR").trim().toUpperCase(),
          },
        },
        { new: true, upsert: true, runValidators: true }
      );

      return NextResponse.json({
        success: true,
        message: "Razorpay payment settings updated successfully",
        settings: updated,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update payment settings";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
