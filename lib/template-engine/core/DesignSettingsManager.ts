import { DesignSettingDefinition } from "../types";

/**
 * Converts camelCase or snake_case key to CSS custom property name:
 * e.g. "backgroundColor" -> "--background-color"
 *      "primaryColor" -> "--primary-color"
 *      "headingFont" -> "--heading-font"
 */
export function keyToCssVarName(key: string): string {
  if (key.startsWith("--")) return key;
  const kebab = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return `--${kebab}`;
}

/**
 * Compiles a dictionary of design settings into a CSS :root block.
 */
export function compileDesignSettingsCss(
  definitions: DesignSettingDefinition[],
  overrides: Record<string, any> = {}
): string {
  const cssLines: string[] = [];

  for (const def of definitions) {
    const rawVal = overrides[def.key] !== undefined ? overrides[def.key] : def.default;
    if (rawVal === undefined || rawVal === null || rawVal === "") continue;

    const varName = keyToCssVarName(def.key);

    if (def.type === "font") {
      // Font family quotes if needed
      const fontVal = String(rawVal).includes(" ") ? `"${rawVal}", serif` : `${rawVal}, sans-serif`;
      cssLines.push(`  ${varName}: ${fontVal};`);
    } else if (def.type === "image") {
      // Background image url
      cssLines.push(`  ${varName}: url('${rawVal}');`);
    } else {
      cssLines.push(`  ${varName}: ${rawVal};`);
    }
  }

  if (cssLines.length === 0) return "";

  return `:root {\n${cssLines.join("\n")}\n}`;
}

/**
 * Injects the compiled CSS into the HTML <head> block.
 */
export function injectDesignSettingsIntoHtml(
  html: string,
  definitions: DesignSettingDefinition[],
  overrides: Record<string, any> = {}
): string {
  const css = compileDesignSettingsCss(definitions, overrides);
  if (!css) return html;

  const styleTag = `\n  <style id="vv-dynamic-design-settings">\n${css}\n  </style>\n`;

  if (html.includes("</head>")) {
    return html.replace("</head>", `${styleTag}</head>`);
  }

  return `${styleTag}${html}`;
}
