import {
  TemplateManifest,
  CustomerFieldDefinition,
  DesignSettingDefinition,
  CustomerFieldType,
  DesignSettingType,
  ValidationResult,
  CompatibilityCheckResult,
} from "../types";

const VALID_FIELD_TYPES: Set<CustomerFieldType> = new Set([
  "text",
  "textarea",
  "date",
  "time",
  "number",
  "email",
  "phone",
  "url",
  "image",
  "gallery",
  "audio",
  "boolean",
  "select",
  "multi-select",
  "repeater",
]);

const VALID_DESIGN_TYPES: Set<DesignSettingType> = new Set([
  "color",
  "font",
  "text",
  "image",
  "select",
  "number",
]);

const VALID_KEY_REGEX = /^[a-zA-Z0-9_-]+$/;

export function validateManifestSchema(json: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!json || typeof json !== "object") {
    return {
      valid: false,
      errors: ["Manifest must be a valid JSON object"],
      warnings: [],
    };
  }

  // 1. Validate 'name'
  if (!json.name || typeof json.name !== "string" || !json.name.trim()) {
    errors.push("Manifest requires a non-empty 'name' string.");
  }

  // 2. Validate 'entry'
  const entry = json.entry || "index.html";
  if (typeof entry !== "string") {
    errors.push("Manifest 'entry' must be a string path (e.g., 'index.html').");
  }

  // 3. Validate 'customerFields'
  const customerFields: CustomerFieldDefinition[] = [];
  if (json.customerFields !== undefined) {
    if (!Array.isArray(json.customerFields)) {
      errors.push("Manifest 'customerFields' must be an array.");
    } else {
      const fieldKeys = new Set<string>();
      json.customerFields.forEach((field: any, idx: number) => {
        if (!field || typeof field !== "object") {
          errors.push(`customerFields[${idx}] must be an object.`);
          return;
        }

        if (!field.key || typeof field.key !== "string" || !VALID_KEY_REGEX.test(field.key)) {
          errors.push(`customerFields[${idx}] has an invalid 'key'. Must be alphanumeric.`);
        } else if (fieldKeys.has(field.key)) {
          errors.push(`Duplicate customer field key '${field.key}' at index ${idx}.`);
        } else {
          fieldKeys.add(field.key);
        }

        if (!field.label || typeof field.label !== "string") {
          errors.push(`customerFields[${idx}] requires a valid 'label' string.`);
        }

        if (!field.type || !VALID_FIELD_TYPES.has(field.type)) {
          errors.push(
            `customerFields[${idx}] has invalid or unsupported type '${field.type}'. Allowed: ${Array.from(VALID_FIELD_TYPES).join(", ")}`
          );
        }

        if (field.type === "repeater" && (!field.subFields || !Array.isArray(field.subFields))) {
          warnings.push(`customerField '${field.key}' of type 'repeater' should specify a 'subFields' array.`);
        }

        customerFields.push({
          key: field.key,
          label: field.label,
          type: field.type,
          required: Boolean(field.required),
          placeholder: field.placeholder || "",
          defaultValue: field.defaultValue,
          options: Array.isArray(field.options) ? field.options : [],
          subFields: Array.isArray(field.subFields) ? field.subFields : [],
        });
      });
    }
  }

  // 4. Validate 'designSettings'
  const designSettings: DesignSettingDefinition[] = [];
  if (json.designSettings !== undefined) {
    if (!Array.isArray(json.designSettings)) {
      errors.push("Manifest 'designSettings' must be an array.");
    } else {
      const settingKeys = new Set<string>();
      json.designSettings.forEach((setting: any, idx: number) => {
        if (!setting || typeof setting !== "object") {
          errors.push(`designSettings[${idx}] must be an object.`);
          return;
        }

        if (!setting.key || typeof setting.key !== "string" || !VALID_KEY_REGEX.test(setting.key)) {
          errors.push(`designSettings[${idx}] has an invalid 'key'. Must be alphanumeric.`);
        } else if (settingKeys.has(setting.key)) {
          errors.push(`Duplicate design setting key '${setting.key}' at index ${idx}.`);
        } else {
          settingKeys.add(setting.key);
        }

        if (!setting.label || typeof setting.label !== "string") {
          errors.push(`designSettings[${idx}] requires a valid 'label' string.`);
        }

        if (!setting.type || !VALID_DESIGN_TYPES.has(setting.type)) {
          errors.push(
            `designSettings[${idx}] has invalid type '${setting.type}'. Allowed: ${Array.from(VALID_DESIGN_TYPES).join(", ")}`
          );
        }

        designSettings.push({
          key: setting.key,
          label: setting.label,
          type: setting.type,
          default: setting.default,
          options: Array.isArray(setting.options) ? setting.options : [],
        });
      });
    }
  }

  const manifest: TemplateManifest = {
    name: json.name ? String(json.name).trim() : "",
    description: json.description ? String(json.description).trim() : "",
    entry: typeof entry === "string" ? entry.trim() : "index.html",
    version: json.version ? String(json.version).trim() : "1.0.0",
    customerFields,
    designSettings,
  };

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    manifest: errors.length === 0 ? manifest : undefined,
  };
}

/**
 * Checks compatibility between an existing active manifest and a candidate update manifest.
 * Ensures existing customer websites won't break if the master template is globally updated.
 */
export function checkManifestCompatibility(
  oldManifest: TemplateManifest,
  newManifest: TemplateManifest,
  affectedWeddingsCount: number
): CompatibilityCheckResult {
  const breakingChanges: string[] = [];
  const safeChanges: string[] = [];

  const oldFieldMap = new Map(oldManifest.customerFields.map((f) => [f.key, f]));
  const newFieldMap = new Map(newManifest.customerFields.map((f) => [f.key, f]));

  // 1. Check for removed required fields
  for (const [key, oldField] of oldFieldMap) {
    if (!newFieldMap.has(key)) {
      if (oldField.required) {
        breakingChanges.push(`Previously required field '${oldField.label}' (${key}) was removed from new manifest.`);
      } else {
        safeChanges.push(`Optional field '${oldField.label}' (${key}) was removed.`);
      }
    }
  }

  // 2. Check for newly introduced required fields that have NO default value
  for (const [key, newField] of newFieldMap) {
    if (!oldFieldMap.has(key)) {
      if (newField.required && (newField.defaultValue === undefined || newField.defaultValue === null || newField.defaultValue === "")) {
        breakingChanges.push(
          `New required field '${newField.label}' (${key}) added without a fallback default value. Existing weddings cannot resolve this field.`
        );
      } else {
        safeChanges.push(`New field '${newField.label}' (${key}) added.`);
      }
    }
  }

  return {
    compatible: breakingChanges.length === 0,
    breakingChanges,
    safeChanges,
    affectedWeddingsCount,
  };
}
