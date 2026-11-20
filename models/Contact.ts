import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  phone: string;
  email?: string;
  role?: string;
  eventDate?: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  email: { type: String, trim: true, maxlength: 120 },
  role: { type: String, trim: true, default: "couple" },
  eventDate: { type: String, trim: true },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  status: {
    type: String,
    enum: ["unread", "read", "replied"],
    default: "unread",
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

