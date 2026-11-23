import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await dbConnect();
    const settings = await Payment.findOne().lean();

    if (!settings || !settings.isActive) {
      return NextResponse.json({
        success: true,
        isActive: false,
        mode: "test",
        keyId: "",
        currency: "INR",
      });
    }

    const isLive = settings.mode === "live";
    const keyId = isLive ? settings.liveKeyId : settings.testKeyId;

    return NextResponse.json({
      success: true,
      isActive: settings.isActive && Boolean(keyId),
      mode: settings.mode,
      keyId: keyId || "",
      currency: settings.currency || "INR",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load payment config";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
