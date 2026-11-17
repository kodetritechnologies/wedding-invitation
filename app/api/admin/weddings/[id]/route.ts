import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import WeddingEvent from "@/models/WeddingEvent";
import Guest from "@/models/Guest";
import { getAuthUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/weddings/[id] - Get single wedding with analytics/RSVP breakdown
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const wedding = await Wedding.findOne({ _id: id, adminId: auth.userId }).populate(
      "clientId",
      "name phone email"
    );

    if (!wedding) {
      return NextResponse.json(
        { success: false, error: "Wedding not found or unauthorized" },
        { status: 404 }
      );
    }

    // Fetch related events
    const events = await WeddingEvent.find({ weddingId: id, adminId: auth.userId }).sort({
      order: 1,
      date: 1,
    });

    // Aggregate RSVP statistics
    const guests = await Guest.find({ weddingId: id, adminId: auth.userId });
    const rsvpStats = {
      totalGuests: guests.length,
      attending: guests.filter((g) => g.rsvpStatus === "attending").length,
      declined: guests.filter((g) => g.rsvpStatus === "declined").length,
      pending: guests.filter((g) => g.rsvpStatus === "pending").length,
      totalExpectedAttendees: guests
        .filter((g) => g.rsvpStatus === "attending")
        .reduce((sum, g) => sum + (g.attendeeCount || 1), 0),
    };

    return NextResponse.json({
      success: true,
      wedding,
      events,
      rsvpStats,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch wedding";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT /api/admin/weddings/[id] - Update wedding
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    await dbConnect();

    const wedding = await Wedding.findOne({ _id: id, adminId: auth.userId });
    if (!wedding) {
      return NextResponse.json(
        { success: false, error: "Wedding not found or unauthorized" },
        { status: 404 }
      );
    }

    const allowedFields = [
      "clientId",
      "title",
      "brideName",
      "groomName",
      "weddingDate",
      "venue",
      "city",
      "coverPhoto",
      "status",
      "packageTier",
      "story",
      "familyMessage",
      "contactPersons",
      "rsvpDeadline",
      "settings",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        // @ts-expect-error dynamic assign
        wedding[field] = body[field];
      }
    });

    await wedding.save();

    return NextResponse.json({
      success: true,
      message: "Wedding updated successfully",
      wedding,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update wedding";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/admin/weddings/[id] - Archive wedding
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    const wedding = await Wedding.findOne({ _id: id, adminId: auth.userId });
    if (!wedding) {
      return NextResponse.json(
        { success: false, error: "Wedding not found or unauthorized" },
        { status: 404 }
      );
    }

    wedding.status = "archived";
    await wedding.save();

    return NextResponse.json({
      success: true,
      message: "Wedding archived successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to archive wedding";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
