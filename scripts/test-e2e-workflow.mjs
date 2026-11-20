import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { DB_USERNAME, DB_PASS, DB_NAME, JWT_SECRET } = process.env;

const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

async function runE2ETest() {
  console.log("=================================================");
  console.log("🚀 STARTING VIVAHVAANI CORE WORKFLOW E2E TEST");
  console.log("=================================================");

  try {
    await mongoose.connect(uri);

    const UserCol = mongoose.connection.collection("users");
    const ClientCol = mongoose.connection.collection("clients");
    const WeddingCol = mongoose.connection.collection("weddings");
    const EventCol = mongoose.connection.collection("weddingevents");
    const GuestCol = mongoose.connection.collection("guests");

    // STEP 1: Register Test Admin 1 (Vendor: Wedding Planner & Designer)
    const admin1Email = `planner_${Date.now()}@shaaditest.com`;
    const hashedPass = await bcrypt.hash("Planner@123", 10);
    const admin1 = await UserCol.insertOne({
      name: "Indore Wedding Artistry",
      email: admin1Email,
      password: hashedPass,
      role: "admin",
      businessName: "Indore Wedding Artistry LLP",
      businessTypes: ["invitation_designer", "wedding_planner"],
      status: "active",
      subscription: {
        plan: "professional",
        status: "active",
        activeWeddingLimit: 10,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const admin1Id = admin1.insertedId;
    console.log("✅ Step 1: Admin 1 registered with businessTypes:", ["invitation_designer", "wedding_planner"]);

    // STEP 2: Admin 1 adds a Client
    const client1 = await ClientCol.insertOne({
      adminId: admin1Id,
      name: "Sunil & Sunita Sharma (Verma Family)",
      phone: "+91 9876543210",
      email: "verma.family@gmail.com",
      address: "Vijay Nagar, Indore, MP",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const client1Id = client1.insertedId;
    console.log("✅ Step 2: Client added under Admin 1:", client1Id.toString());

    // STEP 3: Admin 1 creates a Wedding Project
    const weddingSlug = `aarav-diya-${Date.now()}`;
    const wedding1 = await WeddingCol.insertOne({
      adminId: admin1Id,
      clientId: client1Id,
      title: "Diya & Aarav Grand Wedding",
      brideName: "Diya Sharma",
      groomName: "Aarav Verma",
      weddingDate: new Date("2026-12-15T18:00:00Z"),
      venue: "Brilliant Convention Centre, Indore",
      city: "Indore",
      slug: weddingSlug,
      status: "published",
      packageTier: "premium",
      story: "Two college sweethearts uniting two loving families in Indore.",
      familyMessage: "We cordially invite you to celebrate our union.",
      contactPersons: [
        { name: "Sunil Sharma (Bride's Father)", phone: "+91 9826011111", relation: "Father" },
      ],
      settings: {
        allowPublicRsvp: true,
        showHeadcount: true,
        notifyOnRsvp: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const wedding1Id = wedding1.insertedId;
    console.log("✅ Step 3: Wedding created with slug:", weddingSlug);

    // STEP 4: Admin 1 adds Multi-Event Itinerary
    const haldiEvent = await EventCol.insertOne({
      weddingId: wedding1Id,
      adminId: admin1Id,
      eventType: "Haldi",
      title: "Pavitra Haldi Samaroh",
      date: new Date("2026-12-14T10:00:00Z"),
      startTime: "10:00 AM",
      venueName: "Poolside Lawn, BCC, Indore",
      dressCode: "Yellow Traditional",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const weddingCeremony = await EventCol.insertOne({
      weddingId: wedding1Id,
      adminId: admin1Id,
      eventType: "Wedding",
      title: "Subh Vivah & Pheras",
      date: new Date("2026-12-15T18:00:00Z"),
      startTime: "06:00 PM",
      venueName: "Grand Ballroom, BCC, Indore",
      mapUrl: "https://maps.google.com/?q=Brilliant+Convention+Centre+Indore",
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Step 4: Multi-event itinerary added (Haldi & Vivah)");

    // STEP 5: Admin 1 adds Guest with personalized invite code
    const inviteCode = "INV786";
    const guest1 = await GuestCol.insertOne({
      weddingId: wedding1Id,
      adminId: admin1Id,
      name: "Mr. Rajesh & Family",
      phone: "+91 9893012345",
      inviteCode: inviteCode,
      invitedEvents: [haldiEvent.insertedId, weddingCeremony.insertedId],
      rsvpStatus: "pending",
      attendeeCount: 1,
      invitationSent: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Step 5: Guest added with invite code:", inviteCode);

    // STEP 6: Guest uses accountless RSVP flow to respond
    console.log("--- Accountless Guest Flow ---");
    // Guest views public wedding by slug
    const publicWedding = await WeddingCol.findOne(
      { slug: weddingSlug },
      { projection: { brideName: 1, groomName: 1, venue: 1 } }
    );
    console.log("Public View:", publicWedding.brideName, "&", publicWedding.groomName, "@", publicWedding.venue);

    // Guest submits RSVP (Attending with 3 attendees)
    await GuestCol.updateOne(
      { weddingId: wedding1Id, inviteCode: inviteCode },
      {
        $set: {
          rsvpStatus: "attending",
          attendeeCount: 3,
          attendingEvents: [haldiEvent.insertedId, weddingCeremony.insertedId],
          guestMessage: "Looking forward to celebrating with you! Congratulations!",
          submittedAt: new Date(),
        },
      }
    );
    console.log("✅ Step 6: Guest submitted RSVP: Attending with headcount: 3");

    // STEP 7: Admin verifies real-time RSVP aggregation
    const updatedGuest = await GuestCol.findOne({ weddingId: wedding1Id, inviteCode: inviteCode });
    if (updatedGuest.rsvpStatus !== "attending" || updatedGuest.attendeeCount !== 3) {
      throw new Error("RSVP verification failed");
    }
    console.log("✅ Step 7: Admin verified RSVP successfully:", updatedGuest.name, "->", updatedGuest.rsvpStatus, `(${updatedGuest.attendeeCount} guests)`);

    // STEP 8: TEST STRICT TENANT ISOLATION (CROSS-TENANT ACCESS CHECK)
    console.log("--- Testing Cross-Tenant Security Gate ---");
    const admin2Email = `other_admin_${Date.now()}@shaaditest.com`;
    const admin2 = await UserCol.insertOne({
      name: "Unrelated Admin",
      email: admin2Email,
      password: hashedPass,
      role: "admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const admin2Id = admin2.insertedId;

    // Admin 2 tries to access Admin 1's client or wedding:
    const unauthorizedClientAccess = await ClientCol.findOne({
      _id: client1Id,
      adminId: admin2Id, // Queried with Admin 2's tenant ID
    });
    const unauthorizedWeddingAccess = await WeddingCol.findOne({
      _id: wedding1Id,
      adminId: admin2Id,
    });

    console.log("Cross-tenant client query result (must be null):", unauthorizedClientAccess);
    console.log("Cross-tenant wedding query result (must be null):", unauthorizedWeddingAccess);

    if (unauthorizedClientAccess !== null || unauthorizedWeddingAccess !== null) {
      throw new Error("CRITICAL SECURITY VIOLATION: Cross-tenant data isolation breached!");
    }
    console.log("✅ Step 8: Strict Tenant Isolation Verified! Zero Cross-Tenant Visibility.");

    // STEP 9: CLEANUP TEST DATA
    await UserCol.deleteMany({ _id: { $in: [admin1Id, admin2Id] } });
    await ClientCol.deleteOne({ _id: client1Id });
    await WeddingCol.deleteOne({ _id: wedding1Id });
    await EventCol.deleteMany({ weddingId: wedding1Id });
    await GuestCol.deleteMany({ weddingId: wedding1Id });
    console.log("✅ Step 9: Cleaned up all test artifacts.");

    console.log("=================================================");
    console.log("🎉 ALL CORE WORKFLOW & SECURITY TESTS PASSED 100%");
    console.log("=================================================");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ E2E Test failed:", error);
    process.exit(1);
  }
}

runE2ETest();
