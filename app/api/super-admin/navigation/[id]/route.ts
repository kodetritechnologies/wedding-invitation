import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import NavItem from "@/models/NavItem";
import { requireSuperAdmin } from "@/lib/api-guard";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single navigation item
export async function GET(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      await dbConnect();

      const navItem = await NavItem.findById(id).lean();
      if (!navItem) {
        return NextResponse.json(
          { success: false, error: "Navigation item not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        navItem,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch navigation item";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// PUT update navigation item
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      const body = await req.json();

      if (!body.label || !body.label.trim()) {
        return NextResponse.json(
          { success: false, error: "Navigation label cannot be empty" },
          { status: 400 }
        );
      }

      await dbConnect();

      const updateData: Record<string, unknown> = {
        label: body.label.trim(),
        order: Number(body.order) || 0,
      };

      if (body.href !== undefined) {
        updateData.href = String(body.href).trim();
      }

      if (body.type !== undefined) {
        updateData.type = body.type === "dropdown" ? "dropdown" : "link";
      }

      if (body.categorySlug !== undefined) {
        updateData.categorySlug = String(body.categorySlug).trim();
      }

      if (body.dropdownItems !== undefined) {
        updateData.dropdownItems = Array.isArray(body.dropdownItems)
          ? body.dropdownItems.map((item: { label: string; href: string; order?: number }) => ({
              label: (item.label || "").trim(),
              href: (item.href || "").trim(),
              order: Number(item.order) || 0,
            }))
          : [];
      }

      if (body.openInNewTab !== undefined) {
        updateData.openInNewTab = Boolean(body.openInNewTab);
      }

      if (body.status !== undefined) {
        updateData.status = body.status === "inactive" ? "inactive" : "active";
      }

      const updated = await NavItem.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Navigation item not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Navigation item updated successfully",
        navItem: updated,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update navigation item";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// DELETE navigation item
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      await dbConnect();

      const deleted = await NavItem.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json(
          { success: false, error: "Navigation item not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Navigation item deleted successfully",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete navigation item";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
