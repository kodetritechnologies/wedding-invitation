import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const categories = await Category.find({ status: "active" })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load categories";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
