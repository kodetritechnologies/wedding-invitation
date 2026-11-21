import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWishlist extends Document {
  templateSlug: string;
  userId?: string;
  identifier: string; // userId if authenticated, or persistent visitor UUID
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    templateSlug: {
      type: String,
      required: [true, "Template slug is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    userId: {
      type: String,
      trim: true,
      index: true,
    },
    identifier: {
      type: String,
      required: [true, "Identifier is required"],
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

WishlistSchema.index({ templateSlug: 1, identifier: 1 }, { unique: true });

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
