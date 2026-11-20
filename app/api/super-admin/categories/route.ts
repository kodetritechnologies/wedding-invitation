import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { requireSuperAdmin } from "@/lib/api-guard";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET all categories (active & inactive) for Super Admin
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const categories = await Category.find()
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        categories,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load categories";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// POST create new category
export async function POST(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      const body = await req.json();
      const { name, slug, subtitle, href, icon, imageUrl, status, order } = body;

      if (!name || !name.trim()) {
        return NextResponse.json(
          { success: false, error: "Category name is required" },
          { status: 400 }
        );
      }

      await dbConnect();

      const finalSlug = (slug && slug.trim()) ? generateSlug(slug) : generateSlug(name);
      if (!finalSlug) {
        return NextResponse.json(
          { success: false, error: "A valid slug is required" },
          { status: 400 }
        );
      }

      // Check for duplicate slug
      const existing = await Category.findOne({ slug: finalSlug });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `A category with slug '${finalSlug}' already exists` },
          { status: 400 }
        );
      }

      const finalHref = href && href.trim() ? href.trim() : `/${finalSlug}`;

      const category = await Category.create({
        name: name.trim(),
        slug: finalSlug,
        subtitle: subtitle ? subtitle.trim() : "",
        href: finalHref,
        icon: icon ? icon.trim() : "sparkles",
        imageUrl: imageUrl ? imageUrl.trim() : "",
        status: status === "inactive" ? "inactive" : "active",
        order: Number(order) || 0,
      });

      return NextResponse.json({
        success: true,
        message: "Category created successfully",
        category,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create category";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
