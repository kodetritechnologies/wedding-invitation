import AdmZip from "adm-zip";
import path from "path";
import { ValidationResult, TemplateManifest } from "../types";
import { validateManifestSchema } from "./ManifestValidator";

const ALLOWED_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".js",
  ".json",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".gif",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
  ".mp3",
  ".wav",
  ".ogg",
  ".mp4",
  ".webm",
]);

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_SINGLE_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_FILE_COUNT = 200;
const MAX_DIRECTORY_DEPTH = 5;

export interface ZipValidationOutput extends ValidationResult {
  manifest?: TemplateManifest;
  fileList: string[];
}

export function validateTemplateZip(buffer: Buffer): ZipValidationOutput {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fileList: string[] = [];

  let zip: AdmZip;
  try {
    zip = new AdmZip(buffer);
  } catch (err: any) {
    return {
      valid: false,
      errors: [`Invalid ZIP package or corrupt archive: ${err?.message || "unreadable"}`],
      warnings: [],
      fileList: [],
    };
  }

  const entries = zip.getEntries();

  if (!entries || entries.length === 0) {
    return {
      valid: false,
      errors: ["ZIP package is completely empty"],
      warnings: [],
      fileList: [],
    };
  }

  if (entries.length > MAX_FILE_COUNT) {
    errors.push(`ZIP contains too many files (${entries.length}). Allowed limit is ${MAX_FILE_COUNT}.`);
  }

  let totalSize = 0;
  let manifestEntry: AdmZip.IZipEntry | null = null;
  let foundEntryHtml = false;

  for (const entry of entries) {
    const rawName = entry.entryName.replace(/\\/g, "/");

    // 1. Directory traversal / ZIP Slip check
    const normalized = path.posix.normalize(rawName);
    if (
      normalized.startsWith("../") ||
      normalized.startsWith("..") ||
      path.isAbsolute(normalized)
    ) {
      errors.push(`Security violation: Malicious path traversal detected in file '${rawName}'`);
      continue;
    }

    // 2. Directory depth check
    const segments = normalized.split("/").filter(Boolean);
    if (segments.length > MAX_DIRECTORY_DEPTH + (entry.isDirectory ? 0 : 1)) {
      errors.push(`File path '${rawName}' exceeds maximum directory depth of ${MAX_DIRECTORY_DEPTH}`);
    }

    if (entry.isDirectory) {
      continue;
    }

    fileList.push(normalized);

    // 3. File size check
    const size = entry.header.size;
    totalSize += size;
    if (size > MAX_SINGLE_FILE_SIZE) {
      errors.push(`File '${rawName}' exceeds maximum allowed single file size (15MB).`);
    }

    // 4. File extension allowlist check
    const ext = path.posix.extname(normalized).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      errors.push(`Disallowed file extension '${ext}' for file '${rawName}'. Only standard web assets are permitted.`);
    }

    // Locate manifest.json and index.html
    const baseName = path.posix.basename(normalized);
    if (baseName.toLowerCase() === "manifest.json" && (segments.length === 1 || segments.length === 2)) {
      // either at root or inside top-level folder
      if (!manifestEntry || segments.length < manifestEntry.entryName.split("/").length) {
        manifestEntry = entry;
      }
    }

    if (baseName.toLowerCase() === "index.html") {
      foundEntryHtml = true;
    }
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    errors.push(`Total uncompressed ZIP size (${(totalSize / 1024 / 1024).toFixed(1)}MB) exceeds limit of 50MB.`);
  }

  // 5. Verify presence of manifest.json
  if (!manifestEntry) {
    errors.push("Missing required 'manifest.json' configuration file in ZIP package.");
  }

  // 6. Verify presence of index.html
  if (!foundEntryHtml) {
    errors.push("Missing required entry point 'index.html' in ZIP package.");
  }

  let parsedManifest: TemplateManifest | undefined;

  if (manifestEntry) {
    try {
      const manifestContent = manifestEntry.getData().toString("utf-8");
      const manifestJson = JSON.parse(manifestContent);
      const manifestValidation = validateManifestSchema(manifestJson);

      if (!manifestValidation.valid) {
        errors.push(...manifestValidation.errors);
      }
      warnings.push(...manifestValidation.warnings);
      parsedManifest = manifestValidation.manifest;
    } catch (err: any) {
      errors.push(`Failed to parse 'manifest.json': ${err?.message || "Invalid JSON syntax"}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    manifest: parsedManifest,
    fileList,
  };
}
