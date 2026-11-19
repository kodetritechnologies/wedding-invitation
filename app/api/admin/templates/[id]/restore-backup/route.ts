import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";
import { TemplateManager } from "@/lib/template-engine";

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

      if (!template.backupZipPath) {
        return NextResponse.json(
          { success: false, error: "No previous backup found for this template." },
          { status: 400 }
        );
      }

      const restored = await TemplateManager.restorePackageFromZip(
        template.slug,
        template.backupZipPath
      );

      if (!restored) {
        return NextResponse.json(
          { success: false, error: "Failed to restore backup archive." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Successfully rolled back to the previous working template package.",
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to restore backup" },
        { status: 500 }
      );
    }
  });
}
