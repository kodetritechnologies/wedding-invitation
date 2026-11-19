export type CustomerFieldType =
  | "text"
  | "textarea"
  | "date"
  | "time"
  | "number"
  | "email"
  | "phone"
  | "url"
  | "image"
  | "gallery"
  | "audio"
  | "boolean"
  | "select"
  | "multi-select"
  | "repeater";

export interface CustomerFieldDefinition {
  key: string;
  label: string;
  type: CustomerFieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: string[];
  subFields?: CustomerFieldDefinition[];
  allowedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

export type DesignSettingType =
  | "color"
  | "font"
  | "text"
  | "image"
  | "select"
  | "number";

export interface DesignSettingDefinition {
  key: string;
  label: string;
  type: DesignSettingType;
  default?: any;
  options?: string[];
}

export interface TemplateManifest {
  name: string;
  description?: string;
  entry: string; // usually "index.html"
  version?: string;
  customerFields: CustomerFieldDefinition[];
  designSettings: DesignSettingDefinition[];
}

export interface ValidationIssue {
  field?: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  manifest?: TemplateManifest;
}

export interface CompatibilityCheckResult {
  compatible: boolean;
  breakingChanges: string[];
  safeChanges: string[];
  affectedWeddingsCount: number;
}
