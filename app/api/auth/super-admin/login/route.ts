import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import SuperAdmin from "@/models/SuperAdmin";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    // Strictly queried against the dedicated `superadmins` collection
    const superAdmin = await SuperAdmin.findOne({ email: normalizedEmail });

    if (!superAdmin) {
      return NextResponse.json(
        { success: false, error: "Invalid Super Admin credentials" },
        { status: 401 }
      );
    }

    if (superAdmin.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Super Admin account is deactivated" },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, superAdmin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid Super Admin credentials" },
        { status: 401 }
      );
    }

    // Update last login
    superAdmin.lastLogin = new Date();
    await superAdmin.save();

    const token = signToken({
      userId: superAdmin._id.toString(),
      email: superAdmin.email,
      role: "super_admin",
      name: superAdmin.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Super Admin authenticated successfully",
      superAdmin: {
        id: superAdmin._id.toString(),
        name: superAdmin.name,
        email: superAdmin.email,
        role: "super_admin",
      },
      token,
    });

    const isHttps = req.nextUrl.protocol === "https:";

    // Dedicated Super Admin Cookie
    response.cookies.set("super_admin_token", token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Super Admin Login Error:", error);
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
