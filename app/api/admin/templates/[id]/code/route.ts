import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { dbConnect } from "@/lib/dbConnect";
import InvitationTemplate from "@/models/InvitationTemplate";
import fs from "fs/promises";
import path from "path";

const PUBLIC_TEMPLATES_ROOT = path.join(process.cwd(), "public", "templates");

const ALLOWED_EDITABLE_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".js",
  ".json",
  ".svg",
  ".txt",
]);

// Helper to recursively list files
async function listTemplateFiles(dir: string, baseDir: string): Promise<Array<{ path: string; name: string; size: number; ext: string }>> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: Array<{ path: string; name: string; size: number; ext: string }> = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await listTemplateFiles(fullPath, baseDir);
      files.push(...subFiles);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      const stat = await fs.stat(fullPath);
      files.push({
        path: relPath,
        name: entry.name,
        size: stat.size,
        ext,
      });
    }
  }

  return files;
}

// GET /api/admin/templates/[id]/code - List files or get file content
export async function GET(
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

      const templateDir = path.join(PUBLIC_TEMPLATES_ROOT, template.slug);

      // Check if folder exists
      try {
        await fs.access(templateDir);
      } catch {
        return NextResponse.json(
          { success: false, error: `Template folder 'public/templates/${template.slug}' not found on disk.` },
          { status: 404 }
        );
      }

      const { searchParams } = new URL(req.url);
      const requestedFile = searchParams.get("file");

      // 1. If a specific file is requested, read its content
      if (requestedFile) {
        const cleanRelPath = path.normalize(requestedFile).replace(/^(\.\.(\/|\\|$))+/, "");
        const fullFilePath = path.join(templateDir, cleanRelPath);

        // Security traversal check
        if (!fullFilePath.startsWith(templateDir)) {
          return NextResponse.json(
            { success: false, error: "Unauthorized path traversal detected" },
            { status: 403 }
          );
        }

        const ext = path.extname(fullFilePath).toLowerCase();
        if (!ALLOWED_EDITABLE_EXTENSIONS.has(ext)) {
          return NextResponse.json(
            { success: false, error: `Editing file type '${ext}' is not supported.` },
            { status: 400 }
          );
        }

        const content = await fs.readFile(fullFilePath, "utf-8");
        return NextResponse.json({
          success: true,
          filePath: cleanRelPath.replace(/\\/g, "/"),
          content,
        });
      }

      // 2. Otherwise list all template files
      const allFiles = await listTemplateFiles(templateDir, templateDir);

      return NextResponse.json({
        success: true,
        template: {
          _id: template._id,
          name: template.name,
          slug: template.slug,
        },
        files: allFiles,
      });
    } catch (err: any) {
      console.error("GET /api/admin/templates/[id]/code error:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Failed to retrieve code" },
        { status: 500 }
      );
    }
  });
}

// PUT /api/admin/templates/[id]/code - Save file content to disk
export async function PUT(
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
      const { filePath, content } = body;

      if (!filePath || content === undefined) {
        return NextResponse.json(
          { success: false, error: "Both filePath and content are required" },
          { status: 400 }
        );
      }

      const templateDir = path.join(PUBLIC_TEMPLATES_ROOT, template.slug);
      const cleanRelPath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "");
      const fullFilePath = path.join(templateDir, cleanRelPath);

      // Security check: Must remain within templateDir
      if (!fullFilePath.startsWith(templateDir)) {
        return NextResponse.json(
          { success: false, error: "Security violation: Path traversal detected" },
          { status: 403 }
        );
      }

      const ext = path.extname(fullFilePath).toLowerCase();
      if (!ALLOWED_EDITABLE_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, error: `Writing to '${ext}' files is not permitted.` },
          { status: 400 }
        );
      }

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullFilePath), { recursive: true });

      // Save file content to disk
      await fs.writeFile(fullFilePath, content, "utf-8");

      // If manifest.json was modified, sync it with MongoDB document
      if (cleanRelPath.replace(/\\/g, "/") === "manifest.json") {
        try {
          const parsedManifest = JSON.parse(content);
          template.manifest = parsedManifest;
          if (parsedManifest.name) {
            template.name = parsedManifest.name;
          }
          if (parsedManifest.description) {
            template.description = parsedManifest.description;
          }
          await template.save();
        } catch (jsonErr: any) {
          console.warn("Could not sync manifest.json to DB:", jsonErr.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: `File '${cleanRelPath.replace(/\\/g, "/")}' saved successfully!`,
      });
    } catch (err: any) {
      console.error("PUT /api/admin/templates/[id]/code error:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Failed to save file content" },
        { status: 500 }
      );
    }
  });
}
