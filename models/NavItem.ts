import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubNavItem {
  label: string;
  href: string;
  order?: number;
}

export interface INavItem extends Document {
  label: string;
  href: string;
  type: "link" | "dropdown";
  categorySlug?: string;
  dropdownItems?: ISubNavItem[];
  openInNewTab: boolean;
  order: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const SubNavItemSchema = new Schema<ISubNavItem>(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const NavItemSchema = new Schema<INavItem>(
  {
    label: {
      type: String,
      required: [true, "Navigation label is required"],
      trim: true,
    },
    href: {
      type: String,
      default: "/",
      trim: true,
    },
    type: {
      type: String,
      enum: ["link", "dropdown"],
      default: "link",
    },
    categorySlug: {
      type: String,
      default: "",
      trim: true,
    },
    dropdownItems: {
      type: [SubNavItemSchema],
      default: [],
    },
    openInNewTab: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const NavItem: Model<INavItem> =
  mongoose.models.NavItem || mongoose.model<INavItem>("NavItem", NavItemSchema);

export default NavItem;
