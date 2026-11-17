import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import Guest from "@/models/Guest";
import { getAuthUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function generateInviteCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// GET /api/admin/weddings/[id]/guests - List guests with search and RSVP filter
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const rsvpStatus = searchParams.get("rsvpStatus");

    const query: Record<string, unknown> = {
      weddingId: id,
      adminId: auth.userId,
    };

    if (rsvpStatus && rsvpStatus !== "all") {
      query.rsvpStatus = rsvpStatus;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const guests = await Guest.find(query)
      .populate("invitedEvents", "title eventType date")
      .populate("attendingEvents", "title eventType date")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: guests.length,
      guests,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch guests";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/admin/weddings/[id]/guests - Add guest
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { name, phone, email, invitedEvents, attendeeCount } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Guest name is required" },
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

    // Generate unique invite code for this wedding
    let inviteCode = generateInviteCode();
    while (await Guest.exists({ weddingId: id, inviteCode })) {
      inviteCode = generateInviteCode();
    }

    const newGuest = await Guest.create({
      weddingId: id,
      adminId: auth.userId,
      name: name.trim(),
      phone: phone?.trim() || undefined,
      email: email?.trim().toLowerCase() || undefined,
      inviteCode,
      invitedEvents: Array.isArray(invitedEvents) ? invitedEvents : [],
      attendeeCount: typeof attendeeCount === "number" && attendeeCount > 0 ? attendeeCount : 1,
      rsvpStatus: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Guest added successfully",
        guest: newGuest,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add guest";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
