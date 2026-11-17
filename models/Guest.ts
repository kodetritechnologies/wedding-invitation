import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type RsvpStatus = "pending" | "attending" | "declined";

export interface IGuest extends Document {
  weddingId: Types.ObjectId;
  adminId: Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  inviteCode: string;
  invitedEvents: Types.ObjectId[];
  rsvpStatus: RsvpStatus;
  attendeeCount: number;
  attendingEvents: Types.ObjectId[];
  guestMessage?: string;
  dietaryPreference?: string;
  invitationSent: boolean;
  invitationSentAt?: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    weddingId: {
      type: Schema.Types.ObjectId,
      ref: "Wedding",
      required: [true, "Wedding ID is required"],
      index: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Owner Admin ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    inviteCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    invitedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "WeddingEvent",
      },
    ],
    rsvpStatus: {
      type: String,
      enum: ["pending", "attending", "declined"],
      default: "pending",
      index: true,
    },
    attendeeCount: {
      type: Number,
      default: 1,
      min: 0,
    },
    attendingEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "WeddingEvent",
      },
    ],
    guestMessage: {
      type: String,
      trim: true,
    },
    dietaryPreference: {
      type: String,
      trim: true,
    },
    invitationSent: {
      type: Boolean,
      default: false,
    },
    invitationSentAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
GuestSchema.index({ weddingId: 1, inviteCode: 1 }, { unique: true });
GuestSchema.index({ weddingId: 1, rsvpStatus: 1 });

const Guest: Model<IGuest> =
  mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema);

export default Guest;
