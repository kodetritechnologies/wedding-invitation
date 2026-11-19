import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICustomerField {
  key: string;
  label: string;
  type:
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
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: string[];
  subFields?: ICustomerField[];
}

export interface IDesignSetting {
  key: string;
  label: string;
  type: "color" | "font" | "text" | "image" | "select" | "number";
  default?: any;
  options?: string[];
}

export interface ITemplateManifest {
  name: string;
  description?: string;
  entry: string; // e.g. "index.html"
  version?: string;
  customerFields: ICustomerField[];
  designSettings: IDesignSetting[];
}

export interface IInvitationTemplate extends Document {
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  packagePath: string; // folder relative to public, e.g. "templates/royal-wedding"
  zipPath?: string;    // path to active ZIP package
  backupZipPath?: string; // path to previous working ZIP (operational rollback)
  manifest: ITemplateManifest;
  designSettings: Record<string, any>; // active visual settings overrides
  status: "draft" | "published" | "unpublished" | "archived";
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerFieldSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
    required: { type: Boolean, default: false },
    placeholder: { type: String, trim: true },
    defaultValue: { type: Schema.Types.Mixed },
    options: { type: [String], default: [] },
    subFields: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const DesignSettingSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["color", "font", "text", "image", "select", "number"],
    },
    default: { type: Schema.Types.Mixed },
    options: { type: [String], default: [] },
  },
  { _id: false }
);

const ManifestSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    entry: { type: String, default: "index.html", trim: true },
    version: { type: String, default: "1.0.0", trim: true },
    customerFields: { type: [CustomerFieldSchema], default: [] },
    designSettings: { type: [DesignSettingSchema], default: [] },
  },
  { _id: false }
);

const InvitationTemplateSchema = new Schema<IInvitationTemplate>(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Template slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    packagePath: {
      type: String,
      required: [true, "Package extraction path is required"],
      trim: true,
    },
    zipPath: {
      type: String,
      trim: true,
    },
    backupZipPath: {
      type: String,
      trim: true,
    },
    manifest: {
      type: ManifestSchema,
      required: true,
    },
    designSettings: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["draft", "published", "unpublished", "archived"],
      default: "draft",
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
  },
  {
    timestamps: true,
  }
);

InvitationTemplateSchema.index({ slug: 1, status: 1 });

const InvitationTemplate: Model<IInvitationTemplate> =
  mongoose.models.InvitationTemplate ||
  mongoose.model<IInvitationTemplate>(
    "InvitationTemplate",
    InvitationTemplateSchema
  );

export default InvitationTemplate;
