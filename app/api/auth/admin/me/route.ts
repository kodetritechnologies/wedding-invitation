import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { getAuthAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthAdmin(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const admin = await Admin.findById(auth.userId).select("-password");

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: "admin",
        businessName: admin.businessName,
        businessTypes: admin.businessTypes,
        subscription: admin.subscription,
        createdAt: admin.createdAt,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch admin profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
