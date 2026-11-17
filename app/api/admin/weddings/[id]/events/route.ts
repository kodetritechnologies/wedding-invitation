import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import WeddingEvent from "@/models/WeddingEvent";
import { getAuthUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/weddings/[id]/events - List all events for a wedding
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await dbConnect();

    // Verify wedding ownership
    const wedding = await Wedding.findOne({ _id: id, adminId: auth.userId });
    if (!wedding) {
      return NextResponse.json(
        { success: false, error: "Wedding not found or unauthorized" },
        { status: 404 }
      );
    }

    const events = await WeddingEvent.find({ weddingId: id, adminId: auth.userId }).sort({
      order: 1,
      date: 1,
    });

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch events";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/admin/weddings/[id]/events - Add a new function/event
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const {
      eventType,
      title,
      date,
      startTime,
      endTime,
      venueName,
      venueAddress,
      mapUrl,
      description,
      dressCode,
      order,
    } = body;

    if (!title || !date || !startTime || !venueName) {
      return NextResponse.json(
        {
          success: false,
          error: "Event title, date, start time, and venue name are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify wedding ownership
    const wedding = await Wedding.findOne({ _id: id, adminId: auth.userId });
    if (!wedding) {
      return NextResponse.json(
        { success: false, error: "Wedding not found or unauthorized" },
        { status: 404 }
      );
    }

    const newEvent = await WeddingEvent.create({
      weddingId: id,
      adminId: auth.userId,
      eventType: eventType || "Custom",
      title: title.trim(),
      date: new Date(date),
      startTime: startTime.trim(),
      endTime: endTime?.trim() || undefined,
      venueName: venueName.trim(),
      venueAddress: venueAddress?.trim() || undefined,
      mapUrl: mapUrl?.trim() || undefined,
      description: description?.trim() || undefined,
      dressCode: dressCode?.trim() || undefined,
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Event added successfully",
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add event";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
