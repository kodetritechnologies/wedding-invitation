import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      templateSlug,
      templateTitle,
      amount,
      customerName,
      customerEmail,
      customerPhone,
    } = body;

    if (!templateSlug || !amount || !customerName) {
      return NextResponse.json(
        { success: false, error: "Template slug, amount, and customer name are required" },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount specified" },
        { status: 400 }
      );
    }

    await dbConnect();
    const settings = await Payment.findOne().lean();

    if (!settings || !settings.isActive) {
      return NextResponse.json(
        { success: false, error: "Payment gateway is currently disabled by administrator" },
        { status: 400 }
      );
    }

    const isLive = settings.mode === "live";
    const keyId = isLive ? settings.liveKeyId : settings.testKeyId;
    const keySecret = isLive ? settings.liveKeySecret : settings.testKeySecret;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: `Razorpay ${settings.mode.toUpperCase()} credentials (Key ID and Secret) are not configured in Super Admin.`,
        },
        { status: 400 }
      );
    }

    // Initialize Razorpay instance with active mode credentials
    const razorpay = new Razorpay({
      key_id: keyId.trim(),
      key_secret: keySecret.trim(),
    });

    const receiptId = `rcpt_${Date.now()}`.slice(0, 40);
    const amountInPaise = Math.round(numericAmount * 100);

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: settings.currency || "INR",
      receipt: receiptId,
      notes: {
        templateSlug: String(templateSlug),
        templateTitle: String(templateTitle || templateSlug),
        customerName: String(customerName),
        customerPhone: String(customerPhone || ""),
        mode: settings.mode,
      },
    });

    const internalOrderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentOrder = await Order.create({
      orderId: internalOrderId,
      razorpayOrderId: rzpOrder.id,
      templateSlug,
      templateTitle: templateTitle || templateSlug,
      amount: numericAmount,
      currency: settings.currency || "INR",
      status: "created",
      customerName,
      customerEmail: customerEmail || "",
      customerPhone: customerPhone || "",
      mode: settings.mode,
      notes: {
        receiptId,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId,
      dbOrderId: paymentOrder._id,
      internalOrderId,
      mode: settings.mode,
    });
  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    const errorMsg =
      error?.error?.description ||
      error?.message ||
      "Failed to create Razorpay payment order. Check gateway credentials.";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
