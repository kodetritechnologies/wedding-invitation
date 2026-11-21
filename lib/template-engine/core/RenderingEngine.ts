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
  let entryFilePath = path.join(/*turbopackIgnore: true*/ templateRootPath, entryFileName);

  let rawHtml: string;
  try {
    rawHtml = await fs.readFile(/*turbopackIgnore: true*/ entryFilePath, "utf-8");
  } catch {
    // Try fallback path in public/templates/<slug>
    const altPath = path.join(process.cwd(), "public", "templates", templateSlug, entryFileName);
    try {
      rawHtml = await fs.readFile(/*turbopackIgnore: true*/ altPath, "utf-8");
      entryFilePath = altPath;
    } catch {
      // Graceful fallback invitation HTML template
      rawHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>{{groomName}} &amp; {{brideName}} Wedding</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Yatra+One&display=swap" rel="stylesheet">
  <style>
    :root {
      --background-color: #3b0914;
      --primary-color: #d4af37;
      --text-color: #fbf8f2;
      --heading-font: 'Playfair Display', serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--background-color);
      color: var(--text-color);
      font-family: var(--heading-font);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }
    .card {
      border: 2px solid var(--primary-color);
      border-radius: 24px;
      padding: 32px 24px;
      max-width: 420px;
      width: 100%;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(8px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }
    .shlok { color: var(--primary-color); font-size: 13px; font-weight: bold; margin-bottom: 16px; letter-spacing: 2px; }
    .names { font-size: 28px; font-weight: bold; color: var(--text-color); margin-bottom: 12px; }
    .amp { color: var(--primary-color); font-family: 'Cinzel', serif; margin: 0 8px; }
    .details { font-size: 14px; opacity: 0.9; margin-top: 16px; line-height: 1.6; }
    .badge { display: inline-block; margin-top: 20px; padding: 6px 16px; border: 1px solid var(--primary-color); border-radius: 9999px; font-size: 12px; color: var(--primary-color); }
  </style>
</head>
<body>
  <div class="card">
    <div class="shlok">॥ श्री गणेशाय नमः ॥</div>
    <div class="names">{{groomName}}<span class="amp">&amp;</span>{{brideName}}</div>
    <div class="details">
      <p><strong>Date:</strong> {{weddingDate}}</p>
      <p><strong>Venue:</strong> {{venue}}, {{city}}</p>
      <p style="margin-top: 10px; font-style: italic;">{{familyMessage}}</p>
    </div>
    <div class="badge">Auspicious Wedding Invitation</div>
  </div>
</body>
</html>`;
    }
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

  // 5. Inject subtle sleek scrollbars so inside preview frames it never shows chunky 17px Windows default scrollbars
  const sleekScrollbarCss = `
  <style>
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.4); }
    * { scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; }
  </style>`;

  if (processedHtml.includes("</head>")) {
    processedHtml = processedHtml.replace("</head>", `${sleekScrollbarCss}\n</head>`);
  } else if (processedHtml.includes("<body")) {
    processedHtml = processedHtml.replace("<body", `${sleekScrollbarCss}\n<body`);
  }

  return processedHtml;
}
