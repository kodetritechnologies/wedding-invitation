import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Guest from "@/models/Guest";
import { getAuthUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string; guestId: string }>;
};

// PUT /api/admin/weddings/[id]/guests/[guestId] - Update guest or manual RSVP
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, guestId } = await context.params;
    const body = await req.json();

    await dbConnect();

    const guest = await Guest.findOne({
      _id: guestId,
      weddingId: id,
      adminId: auth.userId,
    });

    if (!guest) {
      return NextResponse.json(
        { success: false, error: "Guest not found or unauthorized" },
        { status: 404 }
      );
    }

    if (body.name) guest.name = body.name.trim();
    if (body.phone !== undefined) guest.phone = body.phone ? body.phone.trim() : undefined;
    if (body.email !== undefined) guest.email = body.email ? body.email.trim().toLowerCase() : undefined;
    if (Array.isArray(body.invitedEvents)) guest.invitedEvents = body.invitedEvents;
    if (Array.isArray(body.attendingEvents)) guest.attendingEvents = body.attendingEvents;
    if (body.rsvpStatus && ["pending", "attending", "declined"].includes(body.rsvpStatus)) {
      guest.rsvpStatus = body.rsvpStatus;
      guest.submittedAt = new Date();
    }
    if (typeof body.attendeeCount === "number") guest.attendeeCount = body.attendeeCount;
    if (body.guestMessage !== undefined) guest.guestMessage = body.guestMessage ? body.guestMessage.trim() : undefined;
    if (typeof body.invitationSent === "boolean") {
      guest.invitationSent = body.invitationSent;
      if (body.invitationSent) guest.invitationSentAt = new Date();
    }

    await guest.save();

    return NextResponse.json({
      success: true,
      message: "Guest updated successfully",
      guest,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update guest";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/admin/weddings/[id]/guests/[guestId] - Delete guest
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, guestId } = await context.params;
    await dbConnect();

    const result = await Guest.findOneAndDelete({
      _id: guestId,
      weddingId: id,
      adminId: auth.userId,
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Guest not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Guest removed successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete guest";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
