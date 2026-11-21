import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import NavItem from "@/models/NavItem";
import Category from "@/models/Category";
import { requireSuperAdmin } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const activeCategories = await Category.find({ status: "active" })
        .sort({ order: 1 })
        .lean();

      const existingNavItems = await NavItem.find().lean();
      let highestOrder = existingNavItems.reduce(
        (max, item) => Math.max(max, item.order || 0),
        0
      );

      let createdCount = 0;

      for (const cat of activeCategories) {
        const targetHref =
          cat.href && cat.href.startsWith("/templates")
            ? cat.href
            : `/templates?category=${cat.slug}`;
        // Check if matching nav item exists by href or categorySlug
        const exists = existingNavItems.some(
          (n) =>
            n.categorySlug === cat.slug ||
            n.href.toLowerCase() === targetHref.toLowerCase() ||
            n.label.toLowerCase() === cat.name.toLowerCase()
        );

        if (!exists) {
          highestOrder += 1;
          await NavItem.create({
            label: cat.name,
            href: targetHref,
            type: "link",
            categorySlug: cat.slug,
            dropdownItems: [],
            order: highestOrder,
            status: "active",
          });
          createdCount += 1;
        }
      }

      const allNavItems = await NavItem.find()
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        message:
          createdCount > 0
            ? `Successfully synced ${createdCount} categories to navigation!`
            : "All active categories are already present in navigation.",
        createdCount,
        navItems: allNavItems,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to sync categories";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
