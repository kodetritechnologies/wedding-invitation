import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFaq extends Document {
  question: string;
  answer: string;
  category: string;
  status: "active" | "inactive";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "general",
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Faq: Model<IFaq> =
  mongoose.models.Faq || mongoose.model<IFaq>("Faq", FaqSchema);

export default Faq;
