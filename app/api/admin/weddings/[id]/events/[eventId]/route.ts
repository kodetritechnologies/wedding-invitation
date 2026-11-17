import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import WeddingEvent from "@/models/WeddingEvent";
import { getAuthUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string; eventId: string }>;
};

// PUT /api/admin/weddings/[id]/events/[eventId] - Update event
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, eventId } = await context.params;
    const body = await req.json();

    await dbConnect();

    const event = await WeddingEvent.findOne({
      _id: eventId,
      weddingId: id,
      adminId: auth.userId,
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    if (body.eventType) event.eventType = body.eventType;
    if (body.title) event.title = body.title.trim();
    if (body.date) event.date = new Date(body.date);
    if (body.startTime) event.startTime = body.startTime.trim();
    if (body.endTime !== undefined) event.endTime = body.endTime ? body.endTime.trim() : undefined;
    if (body.venueName) event.venueName = body.venueName.trim();
    if (body.venueAddress !== undefined) event.venueAddress = body.venueAddress ? body.venueAddress.trim() : undefined;
    if (body.mapUrl !== undefined) event.mapUrl = body.mapUrl ? body.mapUrl.trim() : undefined;
    if (body.description !== undefined) event.description = body.description ? body.description.trim() : undefined;
    if (body.dressCode !== undefined) event.dressCode = body.dressCode ? body.dressCode.trim() : undefined;
    if (typeof body.order === "number") event.order = body.order;

    await event.save();

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update event";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/admin/weddings/[id]/events/[eventId] - Delete event
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, eventId } = await context.params;
    await dbConnect();

    const result = await WeddingEvent.findOneAndDelete({
      _id: eventId,
      weddingId: id,
      adminId: auth.userId,
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete event";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
