import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Admin, { BusinessType } from "@/models/Admin";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, businessName, businessTypes } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An Admin account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const validBusinessTypes: BusinessType[] = Array.isArray(businessTypes)
      ? (businessTypes.filter((bt) =>
          [
            "invitation_designer",
            "wedding_planner",
            "photographer",
            "videographer",
            "decorator",
            "caterer",
            "makeup_artist",
            "venue_manager",
            "other",
          ].includes(bt)
        ) as BusinessType[])
      : [];

    const newAdmin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim() || undefined,
      role: "admin",
      businessName: businessName?.trim() || undefined,
      businessTypes: validBusinessTypes,
      status: "active",
      subscription: {
        plan: "free",
        status: "active",
        activeWeddingLimit: 1,
      },
    });

    const token = signToken({
      userId: newAdmin._id.toString(),
      email: newAdmin.email,
      role: "admin",
      name: newAdmin.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Admin account registered successfully",
        admin: {
          id: newAdmin._id.toString(),
          name: newAdmin.name,
          email: newAdmin.email,
          role: "admin",
          businessName: newAdmin.businessName,
          businessTypes: newAdmin.businessTypes,
          subscription: newAdmin.subscription,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Also set auth_token for legacy compatibility
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Admin Register Error:", error);
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
