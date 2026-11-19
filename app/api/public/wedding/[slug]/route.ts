import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import WeddingEvent from "@/models/WeddingEvent";
import Guest from "@/models/Guest";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

// GET /api/public/wedding/[slug] - Public accountless invitation view
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    await dbConnect();

    // Only fetch published or active weddings for public view
    const wedding = await Wedding.findOne({
      slug: slug.toLowerCase(),
      status: { $in: ["published", "draft"] }, // draft permitted in dev preview
    })
      .populate("templateId", "name slug description thumbnail manifest designSettings")
      .select(
        "title brideName groomName weddingDate venue city coverPhoto story familyMessage contactPersons rsvpDeadline settings status templateId templateContent"
      );

    if (!wedding) {
      return NextResponse.json(
        { success: false, error: "Wedding invitation not found or not published" },
        { status: 404 }
      );
    }

    // Fetch public events/functions
    const events = await WeddingEvent.find({ weddingId: wedding._id })
      .select("eventType title date startTime endTime venueName venueAddress mapUrl description dressCode order")
      .sort({ order: 1, date: 1 });

    // Check if a personalized guest inviteCode is passed
    const { searchParams } = new URL(req.url);
    const guestCode = searchParams.get("guest");
    let personalGuestInfo = null;

    if (guestCode) {
      const guest = await Guest.findOne({
        weddingId: wedding._id,
        inviteCode: guestCode.toUpperCase().trim(),
      }).select("name rsvpStatus attendeeCount attendingEvents invitedEvents guestMessage");

      if (guest) {
        personalGuestInfo = {
          name: guest.name,
          rsvpStatus: guest.rsvpStatus,
          attendeeCount: guest.attendeeCount,
          attendingEvents: guest.attendingEvents,
          invitedEvents: guest.invitedEvents,
          guestMessage: guest.guestMessage,
        };
      }
    }

    return NextResponse.json({
      success: true,
      wedding,
      events,
      guest: personalGuestInfo,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load invitation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
