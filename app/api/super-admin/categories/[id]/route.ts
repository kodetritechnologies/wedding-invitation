import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { requireSuperAdmin } from "@/lib/api-guard";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET single category
export async function GET(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      await dbConnect();

      const category = await Category.findById(id).lean();
      if (!category) {
        return NextResponse.json(
          { success: false, error: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        category,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch category";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// PUT update category
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      const body = await req.json();

      if (!body.name || !body.name.trim()) {
        return NextResponse.json(
          { success: false, error: "Category name cannot be empty" },
          { status: 400 }
        );
      }

      await dbConnect();

      const updateData: Record<string, unknown> = {
        name: body.name.trim(),
        order: Number(body.order) || 0,
      };

      if (body.slug !== undefined) {
        const slug = generateSlug(body.slug || body.name);
        // Check if slug taken by another category
        const duplicate = await Category.findOne({ slug, _id: { $ne: id } });
        if (duplicate) {
          return NextResponse.json(
            { success: false, error: `Slug '${slug}' is already used by another category` },
            { status: 400 }
          );
        }
        updateData.slug = slug;
      }

      if (body.subtitle !== undefined) {
        updateData.subtitle = String(body.subtitle).trim();
      }

      if (body.href !== undefined) {
        updateData.href = String(body.href).trim();
      }

      if (body.icon !== undefined) {
        updateData.icon = String(body.icon).trim();
      }

      if (body.imageUrl !== undefined) {
        updateData.imageUrl = String(body.imageUrl).trim();
      }

      if (body.status !== undefined) {
        updateData.status = body.status === "inactive" ? "inactive" : "active";
      }

      const updated = await Category.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Category updated successfully",
        category: updated,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update category";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// DELETE category
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return requireSuperAdmin(req, async () => {
    try {
      const { id } = await params;
      await dbConnect();

      const deleted = await Category.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json(
          { success: false, error: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
