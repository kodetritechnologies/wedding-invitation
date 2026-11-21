import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import NavItem from "@/models/NavItem";

export async function GET() {
  try {
    await dbConnect();

    const navItems = await NavItem.find({ status: "active" })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      navItems,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load navigation items";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
