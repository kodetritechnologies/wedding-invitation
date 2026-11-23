import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderId: string; // Internal unique order identifier e.g. ORD-1732300000000
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  templateId?: mongoose.Types.ObjectId;
  templateSlug: string;
  templateTitle: string;
  amount: number; // in INR
  currency: string;
  status: "created" | "paid" | "failed";
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  mode: "test" | "live";
  notes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "InvitationTemplate",
    },
    templateSlug: {
      type: String,
      required: true,
    },
    templateTitle: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
    },
    customerPhone: {
      type: String,
      trim: true,
    },
    mode: {
      type: String,
      enum: ["test", "live"],
      default: "test",
    },
    notes: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
