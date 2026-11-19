import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Faq from "@/models/Faq";
import { requireSuperAdmin } from "@/lib/api-guard";

// GET all FAQs (both active and inactive) for Super Admin
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const category = searchParams.get("category");

      const query: Record<string, unknown> = {};
      if (category && category !== "all") {
        query.category = category;
      }

      const faqs = await Faq.find(query)
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        faqs,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load FAQs";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// POST create new FAQ
export async function POST(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      const body = await req.json();
      const { question, answer, category, status, order } = body;

      if (!question || !question.trim()) {
        return NextResponse.json(
          { success: false, error: "Question is required" },
          { status: 400 }
        );
      }

      if (!answer || !answer.trim()) {
        return NextResponse.json(
          { success: false, error: "Answer is required" },
          { status: 400 }
        );
      }

      await dbConnect();

      const faq = await Faq.create({
        question: question.trim(),
        answer: answer.trim(),
        category: (category || "general").trim().toLowerCase(),
        status: status === "inactive" ? "inactive" : "active",
        order: Number(order) || 0,
      });

      return NextResponse.json({
        success: true,
        message: "FAQ created successfully",
        faq,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create FAQ";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
