import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay verification parameters" },
        { status: 400 }
      );
    }

    await dbConnect();
    const settings = await Payment.findOne().lean();

    if (!settings) {
      return NextResponse.json(
        { success: false, error: "Payment gateway configuration not found" },
        { status: 500 }
      );
    }

    const isLive = settings.mode === "live";
    const keySecret = isLive ? settings.liveKeySecret : settings.testKeySecret;

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Secret key not configured for signature verification" },
        { status: 500 }
      );
    }

    // Verify HMAC-SHA256 signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret.trim())
      .update(text)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Mark as failed if order is found
      if (dbOrderId) {
        await Order.findByIdAndUpdate(dbOrderId, {
          status: "failed",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        });
      }

      return NextResponse.json(
        { success: false, error: "Payment verification failed: Invalid digital signature." },
        { status: 400 }
      );
    }

    // Update order status to paid
    const updatedOrder = await Order.findOneAndUpdate(
      {
        $or: [
          { razorpayOrderId: razorpay_order_id },
          ...(dbOrderId ? [{ _id: dbOrderId }] : []),
        ],
      },
      {
        $set: {
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and completed!",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Razorpay Verify Error:", error);
    const message = error?.message || "Failed to verify Razorpay payment";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
