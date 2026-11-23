import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { requireSuperAdmin } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      const body = await req.json();
      const { keyId, keySecret } = body;

      if (!keyId || !keySecret) {
        return NextResponse.json(
          { success: false, error: "Please enter both Key ID and Key Secret to test" },
          { status: 400 }
        );
      }

      const instance = new Razorpay({
        key_id: keyId.trim(),
        key_secret: keySecret.trim(),
      });

      // Attempt to fetch orders with count 1 to verify credentials
      await instance.orders.all({ count: 1 });

      return NextResponse.json({
        success: true,
        message: "Credentials verified successfully with Razorpay API!",
      });
    } catch (error: any) {
      const errorMsg =
        error?.error?.description ||
        error?.message ||
        "Failed to authenticate with Razorpay. Please check your Key ID and Secret.";
      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: 400 }
      );
    }
  });
}
