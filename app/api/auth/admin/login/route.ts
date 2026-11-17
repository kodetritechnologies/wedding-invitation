import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Admin from "@/models/Admin";
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
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid Admin email or password" },
        { status: 401 }
      );
    }

    if (admin.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: "Your Admin account is inactive or suspended.",
        },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid Admin email or password" },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = signToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: "admin",
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: "admin",
        businessName: admin.businessName,
        businessTypes: admin.businessTypes,
        subscription: admin.subscription,
      },
      token,
    });

    const isHttps = req.nextUrl.protocol === "https:";

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Admin Login Error:", error);
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
