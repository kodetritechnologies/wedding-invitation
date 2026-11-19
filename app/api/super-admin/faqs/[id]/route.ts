import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Faq from "@/models/Faq";
import { requireSuperAdmin } from "@/lib/api-guard";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single FAQ
export async function GET(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      await dbConnect();

      const faq = await Faq.findById(id).lean();
      if (!faq) {
        return NextResponse.json(
          { success: false, error: "FAQ not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        faq,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch FAQ";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// PUT update FAQ
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      const body = await req.json();

      if (!body.question || !body.question.trim()) {
        return NextResponse.json(
          { success: false, error: "Question cannot be empty" },
          { status: 400 }
        );
      }

      if (!body.answer || !body.answer.trim()) {
        return NextResponse.json(
          { success: false, error: "Answer cannot be empty" },
          { status: 400 }
        );
      }

      await dbConnect();

      const updateData: Record<string, unknown> = {
        question: body.question.trim(),
        answer: body.answer.trim(),
        order: Number(body.order) || 0,
      };

      if (body.category !== undefined) {
        updateData.category = String(body.category).trim().toLowerCase();
      }

      if (body.status !== undefined) {
        updateData.status = body.status === "inactive" ? "inactive" : "active";
      }

      const updated = await Faq.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, error: "FAQ not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "FAQ updated successfully",
        faq: updated,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update FAQ";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// DELETE FAQ
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      await dbConnect();

      const deleted = await Faq.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json(
          { success: false, error: "FAQ not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "FAQ deleted successfully",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete FAQ";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
