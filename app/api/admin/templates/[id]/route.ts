import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";
import Wedding from "@/models/Wedding";

// GET /api/admin/templates/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();
      const { id } = await params;

      const template = await InvitationTemplate.findById(id).lean();
      if (!template) {
        return NextResponse.json(
          { success: false, error: "Template not found" },
          { status: 404 }
        );
      }

      const affectedCount = await Wedding.countDocuments({
        templateId: template._id,
        status: { $ne: "archived" },
      });

      return NextResponse.json({
        success: true,
        template: {
          ...template,
          affectedWeddingsCount: affectedCount,
        },
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to load template" },
        { status: 500 }
      );
    }
  });
}

// PATCH /api/admin/templates/[id] - Update template metadata (name, description, category, thumbnail)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();
      const { id } = await params;
      const body = await req.json();

      const template = await InvitationTemplate.findById(id);
      if (!template) {
        return NextResponse.json(
          { success: false, error: "Template not found" },
          { status: 404 }
        );
      }

      if (body.name !== undefined) template.name = body.name.trim();
      if (body.description !== undefined) template.description = body.description.trim();
      if (body.thumbnail !== undefined) template.thumbnail = body.thumbnail.trim();
      if (body.category !== undefined) template.category = body.category.toLowerCase().trim();

      await template.save();

      return NextResponse.json({
        success: true,
        message: "Template details updated successfully.",
        template,
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to update template" },
        { status: 500 }
      );
    }
  });
}

// DELETE /api/admin/templates/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();
      const { id } = await params;
      const { searchParams } = new URL(req.url);
      const isForce = searchParams.get("force") === "true";

      const template = await InvitationTemplate.findById(id);
      if (!template) {
        return NextResponse.json(
          { success: false, error: "Template not found" },
          { status: 404 }
        );
      }

      const activeCount = await Wedding.countDocuments({
        templateId: template._id,
        status: { $ne: "archived" },
      });

      if (activeCount > 0 && !isForce) {
        // Soft-archive if active weddings exist and force is not specified
        template.status = "archived";
        await template.save();
        return NextResponse.json({
          success: true,
          action: "archived",
          message: `Template has ${activeCount} active wedding(s). Marked as archived to prevent breaking live customer cards. Use force=true to delete permanently.`,
          status: "archived",
        });
      }

      // Hard delete: Remove database record and clean disk directory
      await InvitationTemplate.findByIdAndDelete(id);

      // Unset templateId on any affected weddings to prevent orphan references
      await Wedding.updateMany({ templateId: id }, { $unset: { templateId: "" } });

      const fs = await import("fs/promises");
      const path = await import("path");

      try {
        const diskDir = path.join(process.cwd(), "public", "templates", template.slug);
        await fs.rm(diskDir, { recursive: true, force: true });

        const backupDir = path.join(process.cwd(), "storage", "template-backups", template.slug);
        await fs.rm(backupDir, { recursive: true, force: true });
      } catch (fileErr) {
        console.warn("Could not clean template files from disk:", fileErr);
      }

      return NextResponse.json({
        success: true,
        action: "deleted",
        message: `Template '${template.name}' and all its files were deleted successfully.`,
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to delete template" },
        { status: 500 }
      );
    }
  });
}
