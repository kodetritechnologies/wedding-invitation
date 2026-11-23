import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  isActive: boolean;
  mode: "test" | "live";
  testKeyId: string;
  testKeySecret: string;
  liveKeyId: string;
  liveKeySecret: string;
  currency: string;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String,
      enum: ["test", "live"],
      default: "test",
    },
    testKeyId: {
      type: String,
      default: "",
      trim: true,
    },
    testKeySecret: {
      type: String,
      default: "",
      trim: true,
    },
    liveKeyId: {
      type: String,
      default: "",
      trim: true,
    },
    liveKeySecret: {
      type: String,
      default: "",
      trim: true,
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "payments",
  }
);

// Prevent Mongoose model overwrite in development
const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
