import fs from "fs/promises";
import path from "path";
import { TemplateManifest } from "../types";
import { resolvePlaceholders } from "./PlaceholderResolver";
import { injectDesignSettingsIntoHtml } from "./DesignSettingsManager";

export interface RenderTemplateOptions {
  templateSlug: string;
  templateRootPath: string; // absolute directory path on disk
  manifest: TemplateManifest;
  designSettingsOverrides?: Record<string, any>;
  customerData: Record<string, any>;
  publicAssetPrefix?: string; // e.g. "/templates/royal-wedding"
  baseUrl?: string;
}

/**
 * Rewrites relative paths in HTML attributes (src, href, poster) to point to the public template asset path.
 * Leaves absolute URLs (http, https, //, /) and in-page hashes (#) untouched.
 */
export function rewriteAssetUrls(html: string, assetPrefix: string): string {
  if (!assetPrefix) return html;
  const cleanPrefix = assetPrefix.endsWith("/") ? assetPrefix.slice(0, -1) : assetPrefix;

  // 1. Handle href="..." and src="..."
  const rewritten = html.replace(
    /\b(href|src|poster)\s*=\s*(["'])(?!https?:\/\/|\/\/|\/|#|data:|mailto:|tel:)(.*?)\2/gi,
    (_match, attr, quote, relPath) => {
      const cleanRel = relPath.startsWith("./") ? relPath.substring(2) : relPath;
      return `${attr}=${quote}${cleanPrefix}/${cleanRel}${quote}`;
    }
  );

  // 2. Handle url('...') in inline styles
  return rewritten.replace(
    /url\(\s*(["']?)(?!https?:\/\/|\/\/|\/|#|data:)(.*?)\1\s*\)/gi,
    (_match, quote, relPath) => {
      const cleanRel = relPath.startsWith("./") ? relPath.substring(2) : relPath;
      return `url(${quote}${cleanPrefix}/${cleanRel}${quote})`;
    }
  );
}

/**
 * Core function that renders a personalized wedding template into standalone HTML.
 */
export async function renderTemplateHtml(options: RenderTemplateOptions): Promise<string> {
  const {
    templateSlug,
    templateRootPath,
    manifest,
    designSettingsOverrides = {},
    customerData,
    publicAssetPrefix = `/templates/${templateSlug}`,
  } = options;

  const entryFileName = manifest.entry || "index.html";
  const entryFilePath = path.join(/*turbopackIgnore: true*/ templateRootPath, entryFileName);

  let rawHtml: string;
  try {
    rawHtml = await fs.readFile(/*turbopackIgnore: true*/ entryFilePath, "utf-8");
  } catch (err: any) {
    throw new Error(`Failed to load entry HTML file at '${entryFilePath}': ${err?.message || "File not found"}`);
  }

  // 1. Rewrite relative asset URLs (css, js, images) to point to the public assets location
  let processedHtml = rewriteAssetUrls(rawHtml, publicAssetPrefix);

  // 2. Inject CSS Variables from active design settings into <head>
  processedHtml = injectDesignSettingsIntoHtml(
    processedHtml,
    manifest.designSettings || [],
    designSettingsOverrides
  );

  // 3. Resolve dynamic placeholders with customer-specific data
  processedHtml = resolvePlaceholders(processedHtml, customerData);

  // 4. Ensure viewport meta is present for perfect mobile responsiveness
  if (!processedHtml.includes("<meta name=\"viewport\"") && !processedHtml.includes("<meta name='viewport'")) {
    processedHtml = processedHtml.replace(
      "<head>",
      "<head>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\">"
    );
  }

  return processedHtml;
}
