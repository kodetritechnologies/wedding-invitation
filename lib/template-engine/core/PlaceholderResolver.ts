/**
 * Safe HTML escape function to prevent XSS / script injection attacks.
 */
export function escapeHtml(str: any): string {
  if (str === null || str === undefined) return "";
  const s = String(str);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Resolves dot-notated keys from an object (e.g. "venue.city" -> data.venue.city).
 */
function getValueByPath(obj: any, path: string): any {
  if (!obj || typeof obj !== "object") return undefined;
  const parts = path.split(".");
  let curr = obj;
  for (const part of parts) {
    if (curr === null || curr === undefined) return undefined;
    curr = curr[part];
  }
  return curr;
}

/**
 * Formats dates nicely if value is an ISO date string or Date object.
 */
function formatDisplayValue(val: any): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "boolean") return val ? "Yes" : "No";

  // Check if string is a valid ISO date
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      // If it looks like a pure date
      if (val.length <= 10) {
        return d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
  }

  if (val instanceof Date && !isNaN(val.getTime())) {
    return val.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (typeof val === "object") {
    return JSON.stringify(val);
  }

  return String(val);
}

/**
 * Resolves template placeholders in the format {{variableName}}
 * Example:
 *   <h1>{{groomName}}</h1> -> <h1>Rahul</h1>
 *
 * Supports:
 * - Simple: {{key}}
 * - Dot-notation: {{contact.phone}}
 * - Safe HTML escaping by default.
 * - Raw HTML escaping bypass ONLY if explicitly written as {{{rawHtmlKey}}} (used with utmost caution).
 */
export function resolvePlaceholders(
  html: string,
  data: Record<string, any>,
  options: { escape?: boolean; fallbacks?: Record<string, string> } = {}
): string {
  const shouldEscape = options.escape !== false;
  const fallbacks = options.fallbacks || {};

  // 1. First replace {{{rawKey}}} (unescaped if explicitly requested, but sanitized)
  let result = html.replace(/\{\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}\}/g, (_match, key) => {
    const rawVal = getValueByPath(data, key);
    if (rawVal !== undefined && rawVal !== null) {
      // Basic sanitize to strip <script> tags even for raw
      return String(rawVal).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    }
    return fallbacks[key] !== undefined ? fallbacks[key] : "";
  });

  // 2. Replace standard {{key}} placeholders with HTML escaping
  result = result.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_match, key) => {
    const val = getValueByPath(data, key);
    if (val !== undefined && val !== null) {
      const formatted = formatDisplayValue(val);
      return shouldEscape ? escapeHtml(formatted) : formatted;
    }
    return fallbacks[key] !== undefined
      ? shouldEscape
        ? escapeHtml(fallbacks[key])
        : fallbacks[key]
      : "";
  });

  return result;
}

/**
 * Extracts all placeholder keys present in an HTML string.
 * Useful for validating if a template HTML references unknown placeholders.
 */
export function extractPlaceholders(html: string): string[] {
  const matches = html.match(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g) || [];
  const keys = new Set<string>();
  for (const match of matches) {
    const key = match.replace(/\{\{\s*/, "").replace(/\s*\}\}/, "").trim();
    if (key) keys.add(key);
  }
  return Array.from(keys);
}
