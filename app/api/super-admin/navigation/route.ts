import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import NavItem from "@/models/NavItem";
import { requireSuperAdmin } from "@/lib/api-guard";

// GET all navigation items for Super Admin
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const navItems = await NavItem.find()
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        navItems,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load navigation items";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// POST create new navigation item
export async function POST(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      const body = await req.json();
      const {
        label,
        href,
        type,
        categorySlug,
        dropdownItems,
        openInNewTab,
        status,
        order,
      } = body;

      if (!label || !label.trim()) {
        return NextResponse.json(
          { success: false, error: "Navigation label is required" },
          { status: 400 }
        );
      }

      await dbConnect();

      const navItem = await NavItem.create({
        label: label.trim(),
        href: href ? href.trim() : "/",
        type: type === "dropdown" ? "dropdown" : "link",
        categorySlug: categorySlug ? categorySlug.trim() : "",
        dropdownItems: Array.isArray(dropdownItems)
          ? dropdownItems.map((item: { label: string; href: string; order?: number }) => ({
              label: (item.label || "").trim(),
              href: (item.href || "").trim(),
              order: Number(item.order) || 0,
            }))
          : [],
        openInNewTab: Boolean(openInNewTab),
        status: status === "inactive" ? "inactive" : "active",
        order: Number(order) || 0,
      });

      return NextResponse.json({
        success: true,
        message: "Navigation item created successfully",
        navItem,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create navigation item";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
