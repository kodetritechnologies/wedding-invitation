import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await dbConnect();

    const testimonials = await Testimonial.find({ status: "active" })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      testimonials,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load testimonials";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
