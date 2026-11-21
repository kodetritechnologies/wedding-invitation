import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import InvitationTemplate from "@/models/InvitationTemplate";
import { TemplateManager } from "@/lib/template-engine";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

// GET /api/public/wedding/[slug]/render - Return rendered HTML for the dynamic wedding template
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    await dbConnect();

    const wedding = await Wedding.findOne({
      slug: slug.toLowerCase(),
      status: { $in: ["published", "draft"] },
    });

    if (!wedding) {
      return new NextResponse("Wedding not found", { status: 404 });
    }

    let template = null;
    if (wedding.templateId) {
      template = await InvitationTemplate.findById(wedding.templateId);
    }

    // If no template assigned, try finding the default royal-wedding template
    if (!template) {
      template = await InvitationTemplate.findOne({
        slug: "royal-wedding",
        status: "published",
      });
    }

    if (!template) {
      return new NextResponse("No template assigned or available", { status: 404 });
    }

    const html = await TemplateManager.renderWeddingWebsite(wedding, template);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (err: any) {
    console.error("Template rendering error:", err);
    return new NextResponse(`Rendering error: ${err.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
