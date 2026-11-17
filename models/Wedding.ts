import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IContactPerson {
  name: string;
  phone: string;
  relation: string;
}

export interface IWedding extends Document {
  adminId: Types.ObjectId;
  clientId?: Types.ObjectId;
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: Date;
  venue: string;
  city: string;
  slug: string;
  coverPhoto?: string;
  status: "draft" | "published" | "archived";
  packageTier: "basic" | "premium" | "royal" | "subscription";
  hostingExpiresAt?: Date;
  story?: string;
  familyMessage?: string;
  contactPersons: IContactPerson[];
  rsvpDeadline?: Date;
  settings: {
    allowPublicRsvp: boolean;
    showHeadcount: boolean;
    notifyOnRsvp: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ContactPersonSchema = new Schema<IContactPerson>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const WeddingSchema = new Schema<IWedding>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Owner Admin ID is required"],
      index: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      index: true,
    },
    title: {
      type: String,
      required: [true, "Wedding title is required"],
      trim: true,
    },
    brideName: {
      type: String,
      required: [true, "Bride name is required"],
      trim: true,
    },
    groomName: {
      type: String,
      required: [true, "Groom name is required"],
      trim: true,
    },
    weddingDate: {
      type: Date,
      required: [true, "Wedding date is required"],
      index: true,
    },
    venue: {
      type: String,
      required: [true, "Wedding venue is required"],
      trim: true,
    },
    city: {
      type: String,
      default: "Indore",
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Unique slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    coverPhoto: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    packageTier: {
      type: String,
      enum: ["basic", "premium", "royal", "subscription"],
      default: "basic",
    },
    hostingExpiresAt: {
      type: Date,
    },
    story: {
      type: String,
      trim: true,
    },
    familyMessage: {
      type: String,
      trim: true,
    },
    contactPersons: {
      type: [ContactPersonSchema],
      default: [],
    },
    rsvpDeadline: {
      type: Date,
    },
    settings: {
      allowPublicRsvp: {
        type: Boolean,
        default: true,
      },
      showHeadcount: {
        type: Boolean,
        default: true,
      },
      notifyOnRsvp: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

WeddingSchema.index({ adminId: 1, status: 1 });
WeddingSchema.index({ slug: 1, status: 1 });

const Wedding: Model<IWedding> =
  mongoose.models.Wedding || mongoose.model<IWedding>("Wedding", WeddingSchema);

export default Wedding;
