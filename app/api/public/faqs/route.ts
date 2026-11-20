import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Faq from "@/models/Faq";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: Record<string, unknown> = { status: "active" };
    if (category && category !== "all") {
      query.category = category;
    }

    const faqs = await Faq.find(query)
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      faqs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load FAQs";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
