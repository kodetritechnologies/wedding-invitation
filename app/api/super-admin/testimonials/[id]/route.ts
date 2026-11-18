import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";
import { requireSuperAdmin } from "@/lib/api-guard";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT update testimonial
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      const body = await req.json();

      await dbConnect();

      const updated = await Testimonial.findByIdAndUpdate(
        id,
        {
          $set: {
            name: body.name,
            role: body.role,
            city: body.city,
            rating: Number(body.rating) || 5,
            content: body.content,
            avatarUrl: body.avatarUrl,
            status: body.status,
            order: Number(body.order) || 0,
          },
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Testimonial not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Testimonial updated successfully",
        testimonial: updated,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update testimonial";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// DELETE testimonial
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;

      await dbConnect();

      const deleted = await Testimonial.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json(
          { success: false, error: "Testimonial not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Testimonial deleted successfully",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete testimonial";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
