import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import SuperAdmin from "@/models/SuperAdmin";
import { getAuthSuperAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthSuperAdmin(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Super Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();
    // Strictly queried against `superadmins` collection
    const superAdmin = await SuperAdmin.findById(auth.userId).select("-password");

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, error: "Super Admin record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      superAdmin: {
        id: superAdmin._id.toString(),
        name: superAdmin.name,
        email: superAdmin.email,
        role: "super_admin",
        lastLogin: superAdmin.lastLogin,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch Super Admin profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
