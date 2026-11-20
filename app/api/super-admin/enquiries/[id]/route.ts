import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import { requireSuperAdmin } from "@/lib/api-guard";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single enquiry
export async function GET(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      await dbConnect();

      const enquiry = await Contact.findById(id).lean();
      if (!enquiry) {
        return NextResponse.json(
          { success: false, error: "Enquiry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        enquiry,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch enquiry";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// PUT update enquiry status
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      const body = await req.json();

      await dbConnect();

      const updateData: Record<string, unknown> = {};
      if (body.status && ["unread", "read", "replied"].includes(body.status)) {
        updateData.status = body.status;
      }

      const updated = await Contact.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Enquiry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Enquiry updated successfully",
        enquiry: updated,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update enquiry";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// DELETE enquiry
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      await dbConnect();

      const deleted = await Contact.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json(
          { success: false, error: "Enquiry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Enquiry deleted successfully",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete enquiry";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
