import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";
import fs from "fs/promises";
import path from "path";

// POST /api/admin/templates/[id]/thumbnail - Upload featured image/thumbnail for a template
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();
      const { id } = await params;

      const template = await InvitationTemplate.findById(id);
      if (!template) {
        return NextResponse.json(
          { success: false, error: "Template not found" },
          { status: 404 }
        );
      }

      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No image file provided in form data" },
          { status: 400 }
        );
      }

      const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"];
      const ext = path.extname(file.name).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid file type. Allowed: PNG, JPG, JPEG, WEBP, SVG, GIF, AVIF",
          },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Image file size exceeds 10MB limit" },
          { status: 400 }
        );
      }

      const uploadsDir = path.join(process.cwd(), "public", "uploads", "templates");
      await fs.mkdir(uploadsDir, { recursive: true });

      const safeSlug = template.slug.replace(/[^a-z0-9_-]/g, "-");
      const filename = `${safeSlug}-thumb-${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));

      const publicUrl = `/uploads/templates/${filename}`;
      template.thumbnail = publicUrl;
      await template.save();

      return NextResponse.json({
        success: true,
        message: "Thumbnail / Featured image uploaded successfully",
        thumbnail: publicUrl,
        template,
      });
    } catch (err: any) {
      console.error("Template thumbnail upload error:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Failed to upload thumbnail" },
        { status: 500 }
      );
    }
  });
}
