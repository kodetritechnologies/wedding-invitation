import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await dbConnect();

    let testimonials = await Testimonial.find({ status: "active" })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Seed defaults if empty
    if (!testimonials || testimonials.length === 0) {
      const defaultTestimonials = [
        {
          name: "Rajesh & Sunita Verma",
          role: "Bride's Parents",
          city: "Vijay Nagar, Indore",
          rating: 5,
          content:
            "Beti ki shaadi me sabse badi tension thi ki outstation rishtedaar BCC convention centre kaise pahuchenge. ShaadiConnect ke Google Maps button se sab log bina kisi call ke seedha gate par pahunch gaye!",
          status: "active",
          order: 1,
        },
        {
          name: "Mayank Soni",
          role: "Wedding Planner",
          city: "Shubh Lagan Events, Indore",
          rating: 5,
          content:
            "Main pichhle 8 saal se Indore mein wedding planning kar raha hoon. ShaadiConnect ke RSVP dashboard se hume catering ka exact headcount mil gaya. Client ke lagbhag ₹45,000 khane ki wastage me bach gaye.",
          status: "active",
          order: 2,
        },
        {
          name: "Kunal & Team",
          role: "Studio Director",
          city: "Kunal Studios, Bhopal",
          rating: 5,
          content:
            "Hum apne studio ke har wedding package ke sath ek digital patrika gift karte hain. Clients itne khush hote hain ki unhe traditional cards print karane ki zaroorat hi nahi lagti.",
          status: "active",
          order: 3,
        },
      ];

      await Testimonial.insertMany(defaultTestimonials);
      testimonials = await Testimonial.find({ status: "active" })
        .sort({ order: 1, createdAt: -1 })
        .lean();
    }

    return NextResponse.json({
      success: true,
      testimonials,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load testimonials";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
