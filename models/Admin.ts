import mongoose, { Schema, Document, Model } from "mongoose";

export type BusinessType =
  | "invitation_designer"
  | "wedding_planner"
  | "photographer"
  | "videographer"
  | "decorator"
  | "caterer"
  | "makeup_artist"
  | "venue_manager"
  | "other";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "admin";
  businessName?: string;
  businessTypes: BusinessType[];
  status: "active" | "inactive" | "suspended";
  subscription: {
    plan: "free" | "starter" | "professional" | "agency";
    status: "none" | "active" | "past_due" | "cancelled";
    expiresAt?: Date;
    activeWeddingLimit: number;
  };
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    businessTypes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      index: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "starter", "professional", "agency"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["none", "active", "past_due", "cancelled"],
        default: "none",
      },
      expiresAt: {
        type: Date,
      },
      activeWeddingLimit: {
        type: Number,
        default: 1,
      },
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "admins", // Explicit separate collection
  }
);

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
