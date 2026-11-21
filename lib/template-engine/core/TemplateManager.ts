import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";
import { validateTemplateZip } from "../validators/ZipValidator";
import { renderTemplateHtml } from "./RenderingEngine";
import { TemplateManifest, CompatibilityCheckResult } from "../types";
import { checkManifestCompatibility } from "../validators/ManifestValidator";
import Wedding from "@/models/Wedding";

const PUBLIC_TEMPLATES_DIR = path.join(process.cwd(), "public", "templates");
const BACKUP_STORAGE_DIR = path.join(process.cwd(), "storage", "template-backups");

export class TemplateManager {
  /**
   * Ensures necessary base directories exist.
   */
  private static async ensureDirectories(slug: string) {
    const targetDir = path.join(PUBLIC_TEMPLATES_DIR, slug);
    const backupDir = path.join(BACKUP_STORAGE_DIR, slug);
    await fs.mkdir(targetDir, { recursive: true });
    await fs.mkdir(backupDir, { recursive: true });
    return { targetDir, backupDir };
  }

  /**
   * Generates a zip backup of the currently active template package on disk.
   */
  public static async backupCurrentPackage(slug: string): Promise<string | null> {
    const sourceDir = path.join(PUBLIC_TEMPLATES_DIR, slug);
    try {
      await fs.access(sourceDir);
    } catch {
      // Directory doesn't exist yet, nothing to backup
      return null;
    }

    const { backupDir } = await this.ensureDirectories(slug);
    const timestamp = Date.now();
    const backupZipPath = path.join(backupDir, `backup-${timestamp}.zip`);

    try {
      const zip = new AdmZip();
      zip.addLocalFolder(sourceDir);
      await zip.writeZipPromise(backupZipPath);
      return backupZipPath;
    } catch (err) {
      console.error(`Failed to create backup for template '${slug}':`, err);
      return null;
    }
  }

  /**
   * Restores a previously saved ZIP package back to public/templates/[slug].
   */
  public static async restorePackageFromZip(slug: string, backupZipPath: string): Promise<boolean> {
    try {
      const targetDir = path.join(PUBLIC_TEMPLATES_DIR, slug);
      const zip = new AdmZip(backupZipPath);

      // Clean existing target dir
      await fs.rm(targetDir, { recursive: true, force: true });
      await fs.mkdir(targetDir, { recursive: true });

      zip.extractAllTo(targetDir, true);
      return true;
    } catch (err) {
      console.error(`Failed to restore backup for template '${slug}':`, err);
      return false;
    }
  }

  /**
   * Safely extracts a ZIP package buffer into public/templates/[slug].
   * Handles root directory flattening if the ZIP was zipped as a single outer folder.
   */
  public static async extractAndDeployZip(
    slug: string,
    buffer: Buffer
  ): Promise<{
    success: boolean;
    manifest: TemplateManifest;
    targetDir: string;
    backupZipPath: string | null;
  }> {
    // 1. Validate ZIP archive and manifest schema
    const validation = validateTemplateZip(buffer);
    if (!validation.valid || !validation.manifest) {
      throw new Error(`Template ZIP validation failed:\n- ${validation.errors.join("\n- ")}`);
    }

    // 2. Backup existing package if already deployed
    const backupZipPath = await this.backupCurrentPackage(slug);

    // 3. Ensure target directory exists and is clear
    const { targetDir } = await this.ensureDirectories(slug);
    await fs.rm(targetDir, { recursive: true, force: true });
    await fs.mkdir(targetDir, { recursive: true });

    // 4. Extract files safely (preventing ZIP slip)
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    // Check if everything is wrapped in a single root folder (e.g. "my-theme/...")
    let commonPrefix = "";
    const firstSlashIdx = entries[0]?.entryName.indexOf("/");
    if (firstSlashIdx !== -1) {
      const potentialPrefix = entries[0].entryName.substring(0, firstSlashIdx + 1);
      const allSharePrefix = entries.every(
        (e) => e.entryName.startsWith(potentialPrefix) || e.entryName === potentialPrefix.slice(0, -1)
      );
      if (allSharePrefix) {
        commonPrefix = potentialPrefix;
      }
    }

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      let relativePath = entry.entryName.replace(/\\/g, "/");
      if (commonPrefix && relativePath.startsWith(commonPrefix)) {
        relativePath = relativePath.substring(commonPrefix.length);
      }

      const normalized = path.posix.normalize(relativePath);
      if (normalized.startsWith("../") || path.isAbsolute(normalized)) {
        throw new Error(`Security violation: Malicious path '${entry.entryName}'`);
      }

      const fullDestPath = path.join(targetDir, normalized);
      await fs.mkdir(path.dirname(fullDestPath), { recursive: true });
      await fs.writeFile(fullDestPath, entry.getData());
    }

    return {
      success: true,
      manifest: validation.manifest,
      targetDir,
      backupZipPath,
    };
  }

  /**
   * Generates a preview HTML string with sample/dummy data.
   */
  public static async generatePreviewHtml(
    template: {
      slug: string;
      packagePath?: string;
      manifest: TemplateManifest;
      designSettings?: Record<string, any>;
    },
    sampleOverrides: Record<string, any> = {}
  ): Promise<string> {
    const pkgPath = (template as any).packagePath;
    const templateRootPath = pkgPath
      ? path.join(process.cwd(), "public", pkgPath)
      : path.join(PUBLIC_TEMPLATES_DIR, template.slug);

    // Build sample dummy data matching manifest customerFields
    const sampleData: Record<string, any> = {
      groomName: "Rahul Sharma",
      brideName: "Priya Verma",
      weddingDate: "2027-02-14",
      venue: "Grand Heritage Palace",
      city: "Indore",
      story: "Two hearts united in friendship, blessed by families and destiny.",
      familyMessage: "With heartfelt joy, we invite you and your family to celebrate our special day with us.",
      ...sampleOverrides,
    };

    if (template.manifest.customerFields) {
      for (const field of template.manifest.customerFields) {
        if (sampleData[field.key] === undefined) {
          sampleData[field.key] = field.defaultValue || field.placeholder || `[${field.label}]`;
        }
      }
    }

    return renderTemplateHtml({
      templateSlug: template.slug,
      templateRootPath,
      manifest: template.manifest,
      designSettingsOverrides: template.designSettings || {},
      customerData: sampleData,
      publicAssetPrefix: `/templates/${template.slug}`,
    });
  }

  /**
   * Renders the complete personalized website for an actual wedding document.
   */
  public static async renderWeddingWebsite(
    wedding: any,
    template: {
      slug: string;
      manifest: TemplateManifest;
      designSettings?: Record<string, any>;
    }
  ): Promise<string> {
    const templateRootPath = path.join(PUBLIC_TEMPLATES_DIR, template.slug);

    // Merge wedding core fields with custom templateContent
    const customerData: Record<string, any> = {
      title: wedding.title || `${wedding.brideName} & ${wedding.groomName}'s Wedding`,
      groomName: wedding.groomName || "",
      brideName: wedding.brideName || "",
      weddingDate: wedding.weddingDate ? new Date(wedding.weddingDate).toISOString().split("T")[0] : "",
      venue: wedding.venue || "",
      city: wedding.city || "Indore",
      coverPhoto: wedding.coverPhoto || "",
      story: wedding.story || "",
      familyMessage: wedding.familyMessage || "",
      slug: wedding.slug,
      ...(wedding.templateContent || {}),
    };

    return renderTemplateHtml({
      templateSlug: template.slug,
      templateRootPath,
      manifest: template.manifest,
      designSettingsOverrides: template.designSettings || {},
      customerData,
      publicAssetPrefix: `/templates/${template.slug}`,
    });
  }

  /**
   * Checks compatibility between old and new manifest, including counting affected weddings.
   */
  public static async checkCompatibility(
    templateId: string,
    oldManifest: TemplateManifest,
    newManifest: TemplateManifest
  ): Promise<CompatibilityCheckResult> {
    const affectedWeddingsCount = await Wedding.countDocuments({
      templateId,
      status: { $ne: "archived" },
    });

    return checkManifestCompatibility(oldManifest, newManifest, affectedWeddingsCount);
  }
}
