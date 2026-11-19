import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Faq from "@/models/Faq";

const defaultFaqs = [
  // General / Homepage FAQs
  {
    question: "What is a digital wedding invitation?",
    answer:
      "An online invitation shared as a video, PDF or web link on WhatsApp, so you do not need to print or deliver physical cards door-to-door.",
    category: "general",
    status: "active",
    order: 1,
  },
  {
    question: "What is the difference between Video, PDF and Website invitations?",
    answer:
      "Video is an animated clip with music, ideal for WhatsApp Status and Reels. PDF is a clean printable card. Website is an interactive single link with all events, Google Maps navigation and live RSVP headcount.",
    category: "general",
    status: "active",
    order: 2,
  },
  {
    question: "Do I get a PDF if I choose the Website invitation?",
    answer:
      "Yes. The Website invitation includes a free downloadable PDF and a shareable web link. Video is a separate animated product.",
    category: "general",
    status: "active",
    order: 3,
  },
  {
    question: "Do guests need to install an app?",
    answer:
      "No. The invitation link opens instantly in any smartphone browser (Chrome, Safari, WhatsApp in-app browser).",
    category: "general",
    status: "active",
    order: 4,
  },
  {
    question: "Can I add Haldi, Mehndi, Sangeet, Wedding and Reception in one invitation?",
    answer:
      "Yes. On the Website invitation you can add every ceremony with its own shubh muhurat time, venue address, and 1-click Google Maps GPS link.",
    category: "general",
    status: "active",
    order: 5,
  },
  {
    question: "Can guests see the venue location?",
    answer:
      "Yes. Every ceremony card features a direct Google Maps button for turn-by-turn driving navigation.",
    category: "general",
    status: "active",
    order: 6,
  },
  {
    question: "Can I track who is coming?",
    answer:
      "Yes. Website invitations include built-in RSVP tracking with real-time guest headcount submission.",
    category: "general",
    status: "active",
    order: 7,
  },
  {
    question: "Can I make invitations for birthdays and other occasions?",
    answer:
      "Yes. In addition to weddings, we offer dedicated designs for Engagement, Birthday, Anniversary, Griha Pravesh (House Warming), and Reception.",
    category: "general",
    status: "active",
    order: 8,
  },

  // Pricing FAQs
  {
    question: "Agar shaadi ka muhurat ya venue aage peeche hua to kya naya card khareedna padega?",
    answer:
      "Bilkul nahi! Printed card me ek baar galti ho gayi to re-printing me hazaron rupaye lagte hain. VivahVaani me aap apne login dashboard se 1 second me naya time ya naya address save kar sakte hain — live link open karte hi sabhi mehmaano ko updated details dikhegi.",
    category: "pricing",
    status: "active",
    order: 1,
  },
  {
    question: "Bade buzurg aur gaon ke rishtedaar isko aasani se dekh payenge?",
    answer:
      "Ji haan! Hamara 'Grandfather Test' certified hai. Mehmaan ko na to koi app download karni hai, na password dalna hai aur na OTP. WhatsApp par aayi link par bas 1 tap karte hi card bina kisi rukawat ke open ho jata hai.",
    category: "pricing",
    status: "active",
    order: 2,
  },
  {
    question: "Payment kaise karna hota hai?",
    answer:
      "Hum sabhi standard Indian payment methods support karte hain — UPI (GPay, PhonePe, Paytm), NetBanking, Debit/Credit Cards. One-time packages me koi hidden recurring charges nahi hote.",
    category: "pricing",
    status: "active",
    order: 3,
  },
  {
    question: "Kya hamara guest list aur phone numbers private rahenge?",
    answer:
      "100% Guaranteed. VivahVaani par privacy hamara pehla niyam hai. Aapke mehmaano ka data ya phone number kisi bhi third party ko share ya advertise nahi kiya jata.",
    category: "pricing",
    status: "active",
    order: 4,
  },
];

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Check if any FAQ exists; if not, seed defaults
    const totalCount = await Faq.countDocuments();
    if (totalCount === 0) {
      await Faq.insertMany(defaultFaqs);
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: Record<string, unknown> = { status: "active" };
    if (category && category !== "all") {
      query.category = category;
    }

    const faqs = await Faq.find(query)
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      faqs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load FAQs";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
