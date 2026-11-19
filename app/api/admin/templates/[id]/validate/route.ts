import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";
import { validateTemplateZip, TemplateManager } from "@/lib/template-engine";

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
          { success: false, error: "No ZIP file provided" },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const validation = validateTemplateZip(buffer);

      let compatibility = null;
      if (validation.valid && validation.manifest && template.manifest) {
        compatibility = await TemplateManager.checkCompatibility(
          String(template._id),
          template.manifest,
          validation.manifest
        );
      }

      return NextResponse.json({
        success: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        manifest: validation.manifest,
        fileCount: validation.fileList.length,
        files: validation.fileList,
        compatibility,
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Validation failed" },
        { status: 400 }
      );
    }
  });
}
