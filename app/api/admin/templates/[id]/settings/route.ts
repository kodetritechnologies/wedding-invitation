import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";

export async function PATCH(
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

      const body = await req.json();
      const { designSettings } = body;

      if (!designSettings || typeof designSettings !== "object") {
        return NextResponse.json(
          { success: false, error: "designSettings must be an object" },
          { status: 400 }
        );
      }

      // Restrict to keys defined in manifest designSettings
      const allowedKeys = new Set(
        (template.manifest?.designSettings || []).map((s) => s.key)
      );

      const sanitizedSettings: Record<string, any> = {
        ...(template.designSettings || {}),
      };

      for (const [key, val] of Object.entries(designSettings)) {
        if (allowedKeys.has(key)) {
          sanitizedSettings[key] = val;
        }
      }

      template.designSettings = sanitizedSettings;
      await template.save();

      return NextResponse.json({
        success: true,
        message: "Visual design settings updated successfully. Applied globally to all linked websites.",
        designSettings: template.designSettings,
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to update design settings" },
        { status: 500 }
      );
    }
  });
}
