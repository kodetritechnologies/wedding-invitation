import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";
import Wedding from "@/models/Wedding";

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

      if (!template.manifest || !template.manifest.name) {
        return NextResponse.json(
          {
            success: false,
            error: "Cannot publish template: manifest is missing or invalid. Please upload a valid template ZIP first.",
          },
          { status: 400 }
        );
      }

      template.status = "published";
      await template.save();

      const affectedCount = await Wedding.countDocuments({
        templateId: template._id,
        status: { $ne: "archived" },
      });

      return NextResponse.json({
        success: true,
        message: `Template '${template.name}' is now published and available to all customers.`,
        affectedWeddingsCount: affectedCount,
        status: "published",
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to publish template" },
        { status: 500 }
      );
    }
  });
}
