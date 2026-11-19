import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";
import { TemplateManager } from "@/lib/template-engine";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    const template = await InvitationTemplate.findOne({ slug });
    if (!template) {
      return new NextResponse("Template not found", { status: 404 });
    }

    const html = await TemplateManager.generatePreviewHtml(template);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (err: any) {
    return new NextResponse(`Error rendering preview: ${err.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
