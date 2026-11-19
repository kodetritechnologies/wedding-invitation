import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";
import Wedding from "@/models/Wedding";
import fs from "fs/promises";
import path from "path";

// GET /api/admin/templates - List all master templates
export async function GET(req: NextRequest) {
  return requireSuperAdmin(req, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status");
      const search = searchParams.get("search");

      const query: Record<string, any> = {};
      if (status && status !== "all") {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Check if we need to auto-seed default "royal-wedding" if collection is empty
      const totalCount = await InvitationTemplate.countDocuments();
      if (totalCount === 0) {
        try {
          const starterManifestPath = path.join(
            process.cwd(),
            "public",
            "templates",
            "royal-wedding",
            "manifest.json"
          );
          const manifestContent = await fs.readFile(starterManifestPath, "utf-8");
          const manifestJson = JSON.parse(manifestContent);

          await InvitationTemplate.create({
            name: manifestJson.name || "Royal Wedding Heritage",
            slug: "royal-wedding",
            description: manifestJson.description || "Palace wedding theme with gold accents",
            packagePath: "templates/royal-wedding",
            zipPath: "templates/royal-wedding.zip",
            manifest: manifestJson,
            designSettings: {
              backgroundColor: "#3b0914",
              primaryColor: "#d4af37",
              textColor: "#fbf8f2",
              headingFont: "Playfair Display",
            },
            status: "published",
          });
        } catch (seedErr) {
          console.warn("Could not auto-seed starter template:", seedErr);
        }
      }

      const templates = await InvitationTemplate.find(query).sort({ createdAt: -1 }).lean();

      // Enrich with count of weddings using each template
      const enrichedTemplates = await Promise.all(
        templates.map(async (tmpl) => {
          const affectedCount = await Wedding.countDocuments({
            templateId: tmpl._id,
            status: { $ne: "archived" },
          });
          return {
            ...tmpl,
            affectedWeddingsCount: affectedCount,
          };
        })
      );

      return NextResponse.json({
        success: true,
        templates: enrichedTemplates,
        total: enrichedTemplates.length,
      });
    } catch (err: any) {
      console.error("GET /api/admin/templates error:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Failed to fetch templates" },
        { status: 500 }
      );
    }
  });
}

// POST /api/admin/templates - Create new template metadata
export async function POST(req: NextRequest) {
  return requireSuperAdmin(req, async (_req, ctx) => {
    try {
      await dbConnect();
      const body = await req.json();

      const { name, slug, description, thumbnail } = body;

      if (!name || !slug) {
        return NextResponse.json(
          { success: false, error: "Both name and slug are required" },
          { status: 400 }
        );
      }

      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_-]/g, "-");

      const existing = await InvitationTemplate.findOne({ slug: cleanSlug });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `A template with slug '${cleanSlug}' already exists.` },
          { status: 409 }
        );
      }

      const newTemplate = await InvitationTemplate.create({
        name: name.trim(),
        slug: cleanSlug,
        description: description?.trim() || "",
        thumbnail: thumbnail?.trim() || "",
        packagePath: `templates/${cleanSlug}`,
        manifest: {
          name: name.trim(),
          description: description?.trim() || "",
          entry: "index.html",
          version: "1.0.0",
          customerFields: [],
          designSettings: [],
        },
        designSettings: {},
        status: "draft",
        createdBy: ctx.user.userId,
      });

      return NextResponse.json({
        success: true,
        message: "Template created successfully. Please upload the template ZIP package.",
        template: newTemplate,
      });
    } catch (err: any) {
      console.error("POST /api/admin/templates error:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Failed to create template" },
        { status: 500 }
      );
    }
  });
}
