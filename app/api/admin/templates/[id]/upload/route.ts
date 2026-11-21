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

      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No ZIP file provided in form data" },
          { status: 400 }
        );
      }

      if (!file.name.toLowerCase().endsWith(".zip")) {
        return NextResponse.json(
          { success: false, error: "Only .zip archive packages are allowed" },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract and deploy safely
      const deployResult = await TemplateManager.extractAndDeployZip(
        template.slug,
        buffer
      );

      // Check compatibility with previous manifest if already published
      let compatibilityInfo = null;
      if (template.manifest && template.manifest.customerFields?.length > 0) {
        compatibilityInfo = await TemplateManager.checkCompatibility(
          String(template._id),
          template.manifest,
          deployResult.manifest
        );
      }

      // Update database record
      const format = formData.get("format") as string | null;
      if (format && ["website", "video", "pdf"].includes(format.toLowerCase().trim())) {
        template.format = format.toLowerCase().trim() as any;
      }
      template.manifest = deployResult.manifest;
      template.packagePath = `templates/${template.slug}`;
      if (deployResult.backupZipPath) {
        template.backupZipPath = deployResult.backupZipPath;
      }

      // Initialize default design settings if not set
      if (!template.designSettings || Object.keys(template.designSettings).length === 0) {
        const defaults: Record<string, any> = {};
        for (const setting of deployResult.manifest.designSettings || []) {
          if (setting.default !== undefined) {
            defaults[setting.key] = setting.default;
          }
        }
        template.designSettings = defaults;
      }

      const isDefaultVal = formData.get("isDefault");
      if (isDefaultVal === "true" || isDefaultVal === "1") {
        await InvitationTemplate.updateMany({ _id: { $ne: template._id } }, { isDefault: false });
        template.isDefault = true;
      }

      await template.save();

      return NextResponse.json({
        success: true,
        message: "Template ZIP uploaded, validated, and extracted successfully.",
        manifest: deployResult.manifest,
        compatibility: compatibilityInfo,
      });
    } catch (err: any) {
      console.error("ZIP upload error:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Failed to process template ZIP" },
        { status: 400 }
      );
    }
  });
}
