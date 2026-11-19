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

      template.status = "unpublished";
      await template.save();

      const affectedCount = await Wedding.countDocuments({
        templateId: template._id,
        status: { $ne: "archived" },
      });

      return NextResponse.json({
        success: true,
        message: `Template has been unpublished. New customers cannot select it, but ${affectedCount} existing live wedding(s) will continue to render normally.`,
        affectedWeddingsCount: affectedCount,
        status: "unpublished",
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to unpublish template" },
        { status: 500 }
      );
    }
  });
}
