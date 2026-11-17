import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import Guest from "@/models/Guest";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function generateInviteCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// POST /api/public/wedding/[slug]/rsvp - Accountless RSVP submission
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await req.json();
    const {
      guestCode,
      name,
      phone,
      rsvpStatus,
      attendeeCount,
      attendingEvents,
      guestMessage,
      dietaryPreference,
    } = body;

    if (!rsvpStatus || !["attending", "declined"].includes(rsvpStatus)) {
      return NextResponse.json(
        { success: false, error: "Please indicate if you are attending or declined" },
        { status: 400 }
      );
    }

    await dbConnect();

    const wedding = await Wedding.findOne({
      slug: slug.toLowerCase(),
      status: { $in: ["published", "draft"] },
    });

    if (!wedding) {
      return NextResponse.json(
        { success: false, error: "Wedding invitation not found" },
        { status: 404 }
      );
    }

    // 1. Personalized invite code flow
    if (guestCode) {
      const guest = await Guest.findOne({
        weddingId: wedding._id,
        inviteCode: guestCode.toUpperCase().trim(),
      });

      if (!guest) {
        return NextResponse.json(
          { success: false, error: "Invalid invitation code" },
          { status: 404 }
        );
      }

      guest.rsvpStatus = rsvpStatus;
      guest.attendeeCount =
        rsvpStatus === "attending"
          ? typeof attendeeCount === "number" && attendeeCount > 0
            ? attendeeCount
            : 1
          : 0;
      if (Array.isArray(attendingEvents)) guest.attendingEvents = attendingEvents;
      if (guestMessage !== undefined) guest.guestMessage = guestMessage.trim();
      if (dietaryPreference !== undefined) guest.dietaryPreference = dietaryPreference.trim();
      guest.submittedAt = new Date();

      await guest.save();

      return NextResponse.json({
        success: true,
        message: "Thank you! Your RSVP response has been received.",
        rsvp: {
          guestName: guest.name,
          rsvpStatus: guest.rsvpStatus,
          attendeeCount: guest.attendeeCount,
        },
      });
    }

    // 2. Open public RSVP flow (if allowed in wedding settings)
    if (!wedding.settings.allowPublicRsvp) {
      return NextResponse.json(
        {
          success: false,
          error: "Online open RSVP is disabled for this wedding. Please use your personal invite link.",
        },
        { status: 403 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Your name is required to submit RSVP" },
        { status: 400 }
      );
    }

    // Generate unique code for this new guest entry
    let code = generateInviteCode();
    while (await Guest.exists({ weddingId: wedding._id, inviteCode: code })) {
      code = generateInviteCode();
    }

    const newGuestRsvp = await Guest.create({
      weddingId: wedding._id,
      adminId: wedding.adminId,
      name: name.trim(),
      phone: phone?.trim() || undefined,
      inviteCode: code,
      rsvpStatus,
      attendeeCount:
        rsvpStatus === "attending"
          ? typeof attendeeCount === "number" && attendeeCount > 0
            ? attendeeCount
            : 1
          : 0,
      attendingEvents: Array.isArray(attendingEvents) ? attendingEvents : [],
      guestMessage: guestMessage?.trim() || undefined,
      dietaryPreference: dietaryPreference?.trim() || undefined,
      submittedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your RSVP response has been recorded.",
      rsvp: {
        guestName: newGuestRsvp.name,
        rsvpStatus: newGuestRsvp.rsvpStatus,
        attendeeCount: newGuestRsvp.attendeeCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record RSVP";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
