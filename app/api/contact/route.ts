import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, role, eventDate, message, honeypot } = body;

    // Honeypot spam protection: if filled, silently succeed
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Thank you for contacting us." });
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    await dbConnect();

    const newContact = await Contact.create({
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 20),
      email: email ? String(email).trim().slice(0, 120) : undefined,
      role: role ? String(role).trim().slice(0, 50) : "couple",
      eventDate: eventDate ? String(eventDate).trim().slice(0, 50) : undefined,
      message: message.trim().slice(0, 2000),
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received! We will get in touch shortly.",
      id: newContact._id,
    });
  } catch (error: unknown) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit message. Please try again." },
      { status: 500 }
    );
  }
}

