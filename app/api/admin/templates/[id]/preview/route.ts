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

      let sampleOverrides = {};
      try {
        const body = await req.json();
        sampleOverrides = body.sampleData || {};
      } catch {
        // No body or empty
      }

      const html = await TemplateManager.generatePreviewHtml(template, sampleOverrides);

      return NextResponse.json({
        success: true,
        html,
      });
    } catch (err: any) {
      console.error("Preview generation error:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Failed to generate preview" },
        { status: 500 }
      );
    }
  });
}
