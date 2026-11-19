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

// DELETE /api/admin/templates/[id]
export async function DELETE(
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

      const activeCount = await Wedding.countDocuments({
        templateId: template._id,
        status: { $ne: "archived" },
      });

      if (activeCount > 0) {
        // As per documentation section 12.5, if weddings are active, soft-archive instead of hard-delete
        template.status = "archived";
        await template.save();
        return NextResponse.json({
          success: true,
          message: `Template has ${activeCount} active wedding(s). Marked as archived instead of deleting to prevent breaking live customer websites.`,
          status: "archived",
        });
      }

      await InvitationTemplate.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: "Template deleted successfully.",
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to delete template" },
        { status: 500 }
      );
    }
  });
}
