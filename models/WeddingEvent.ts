import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type EventType =
  | "Haldi"
  | "Mehendi"
  | "Sangeet"
  | "Wedding"
  | "Reception"
  | "Engagement"
  | "Custom";

export interface IWeddingEvent extends Document {
  weddingId: Types.ObjectId;
  adminId: Types.ObjectId;
  eventType: EventType;
  title: string;
  date: Date;
  startTime: string;
  endTime?: string;
  venueName: string;
  venueAddress?: string;
  mapUrl?: string;
  description?: string;
  dressCode?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const WeddingEventSchema = new Schema<IWeddingEvent>(
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
    eventType: {
      type: String,
      enum: [
        "Haldi",
        "Mehendi",
        "Sangeet",
        "Wedding",
        "Reception",
        "Engagement",
        "Custom",
      ],
      default: "Custom",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },
    endTime: {
      type: String,
      trim: true,
    },
    venueName: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
    },
    venueAddress: {
      type: String,
      trim: true,
    },
    mapUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dressCode: {
      type: String,
      trim: true,
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

WeddingEventSchema.index({ weddingId: 1, order: 1 });

const WeddingEvent: Model<IWeddingEvent> =
  mongoose.models.WeddingEvent ||
  mongoose.model<IWeddingEvent>("WeddingEvent", WeddingEventSchema);

export default WeddingEvent;
