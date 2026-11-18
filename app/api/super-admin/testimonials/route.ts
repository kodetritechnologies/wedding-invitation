import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";
import { requireSuperAdmin } from "@/lib/api-guard";

// GET all testimonials (both active and inactive) for Super Admin
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();
      const testimonials = await Testimonial.find()
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        testimonials,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load testimonials";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}

// POST create new testimonial
export async function POST(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      const body = await req.json();
      const { name, role, city, rating, content, avatarUrl, status, order } = body;

      if (!name || !content) {
        return NextResponse.json(
          { success: false, error: "Name and testimonial content are required" },
          { status: 400 }
        );
      }

      await dbConnect();

      const testimonial = await Testimonial.create({
        name,
        role: role || "Happy Couple",
        city: city || "Indore, MP",
        rating: Number(rating) || 5,
        content,
        avatarUrl: avatarUrl || "",
        status: status || "active",
        order: Number(order) || 0,
      });

      return NextResponse.json({
        success: true,
        message: "Testimonial created successfully",
        testimonial,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create testimonial";
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  });
}
