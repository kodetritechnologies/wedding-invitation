import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { DB_USERNAME, DB_PASS, DB_NAME } = process.env;

const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

async function reseedCleanDb() {
  console.log("Connecting to MongoDB Atlas database:", DB_NAME);
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // 1. Drop unused 'clients' collection if present
  try {
    const existingCols = await db.listCollections().toArray();
    const colNames = existingCols.map((c) => c.name);

    if (colNames.includes("clients")) {
      await db.collection("clients").drop();
      console.log("🗑️ Dropped unused collection: 'clients'");
    }
  } catch (err) {
    console.log("ℹ️ No 'clients' collection to drop");
  }

  // 2. Clean and create collections
  const superAdminCol = db.collection("superadmins");
  const adminCol = db.collection("admins");
  const weddingsCol = db.collection("weddings");
  const eventsCol = db.collection("weddingevents");
  const guestsCol = db.collection("guests");

  await superAdminCol.deleteMany({});
  await adminCol.deleteMany({});
  await weddingsCol.deleteMany({});
  await eventsCol.deleteMany({});
  await guestsCol.deleteMany({});

  console.log("🧹 Cleaned collections in database:", DB_NAME);

  // 3. Seed Super Admin
  const superAdminHash = await bcrypt.hash("ShaadiAdmin@2026", 10);
  const superAdminRes = await superAdminCol.insertOne({
    name: "VivahVaani Super Admin",
    email: "admin@vivahvaani.kodetri.com",
    password: superAdminHash,
    role: "super_admin",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("👑 Super Admin created with ID:", superAdminRes.insertedId);

  // 4. Seed Client Admin
  const clientHash = await bcrypt.hash("Client@2026", 10);
  const clientRes = await adminCol.insertOne({
    name: "Aarav Sharma",
    email: "client@vivahvaani.kodetri.com",
    password: clientHash,
    phone: "+91 98260 12345",
    role: "admin",
    status: "active",
    subscription: {
      plan: "free",
      status: "active",
      activeWeddingLimit: 5,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const clientId = clientRes.insertedId;
  console.log("👰 Client Admin created with ID:", clientId);

  // 5. Seed Sample Wedding for this Client (slug: aarav-diya)
  const weddingRes = await weddingsCol.insertOne({
    adminId: clientId,
    title: "Diya & Aarav's Royal Wedding",
    brideName: "Diya",
    groomName: "Aarav",
    weddingDate: new Date("2026-12-15T00:00:00.000Z"),
    venue: "Brilliant Convention Centre",
    city: "Indore",
    slug: "aarav-diya",
    status: "published",
    story: "Two hearts, two families, coming together in the heart of Malwa to begin a lifetime of joy and togetherness.",
    familyMessage: "Hum dono parivaron ki taraf se aapko aur aapke poore parivar ko Diya aur Aarav ke shubh vivah samaroh me aadar sahit aamantrit karte hain.",
    contactPersons: [
      { name: "Rajesh Sharma", phone: "+91 98260 11111", relation: "Father of Groom" },
      { name: "Vikram Verma", phone: "+91 98260 22222", relation: "Father of Bride" },
    ],
    settings: {
      allowPublicRsvp: true,
      showHeadcount: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const weddingId = weddingRes.insertedId;
  console.log("💍 Sample Wedding created with ID:", weddingId, "Slug: aarav-diya");

  // 6. Seed 4 Wedding Events (Haldi, Sangeet, Vivah, Reception)
  const events = [
    {
      weddingId,
      adminId: clientId,
      eventType: "Haldi",
      title: "Pavitra Haldi Samaroh",
      date: new Date("2026-12-14T00:00:00.000Z"),
      startTime: "10:30 AM",
      endTime: "02:00 PM",
      venueName: "Poolside Lawn, Brilliant Convention Centre",
      venueAddress: "Vijay Nagar, Scheme 78, Indore, MP 452010",
      mapUrl: "https://maps.google.com/?q=Brilliant+Convention+Centre+Indore",
      dressCode: "Haldi Peela / Yellow Ethnic",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      weddingId,
      adminId: clientId,
      eventType: "Sangeet",
      title: "Sur & Sangeet Night",
      date: new Date("2026-12-14T00:00:00.000Z"),
      startTime: "07:00 PM",
      endTime: "11:30 PM",
      venueName: "Grand Crystal Ballroom, BCC",
      venueAddress: "Vijay Nagar, Indore, MP 452010",
      mapUrl: "https://maps.google.com/?q=Brilliant+Convention+Centre+Indore",
      dressCode: "Indo-Western Glamour & Shimmer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      weddingId,
      adminId: clientId,
      eventType: "Vivah",
      title: "Shubh Vivah & Pheras",
      date: new Date("2026-12-15T00:00:00.000Z"),
      startTime: "06:30 PM",
      endTime: "11:00 PM",
      venueName: "Royal Mandap Lawn, BCC",
      venueAddress: "Vijay Nagar, Indore, MP 452010",
      mapUrl: "https://maps.google.com/?q=Brilliant+Convention+Centre+Indore",
      dressCode: "Traditional Regal & Silk Sarees / Kurta",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      weddingId,
      adminId: clientId,
      eventType: "Reception",
      title: "Grand Wedding Reception",
      date: new Date("2026-12-16T00:00:00.000Z"),
      startTime: "07:30 PM",
      endTime: "11:30 PM",
      venueName: "The Grand Banquet, Bypass Road",
      venueAddress: "Bypass Road, Near Phoenix Citadel, Indore, MP",
      mapUrl: "https://maps.google.com/?q=Brilliant+Convention+Centre+Indore",
      dressCode: "Formal Ethnic & Western Suits",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await eventsCol.insertMany(events);
  console.log("📅 4 Wedding Ceremonies created!");

  // 7. Seed Sample VIP Guests & Live RSVPs
  const sampleGuests = [
    {
      weddingId,
      adminId: clientId,
      name: "Mr. Rajesh Sharma & Family",
      phone: "+91 98260 99991",
      inviteCode: "SHARMA2026",
      rsvpStatus: "attending",
      attendeeCount: 3,
      guestMessage: "Diya aur Aarav ko dher saara aashirvaad aur badhaiyaan!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      weddingId,
      adminId: clientId,
      name: "Mr. Sunil Verma & Family",
      phone: "+91 98260 99992",
      inviteCode: "VERMA2026",
      rsvpStatus: "attending",
      attendeeCount: 4,
      guestMessage: "Hum sab zaroor aayenge, bohot shubhkaamnayein!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      weddingId,
      adminId: clientId,
      name: "Dr. Alok Gupta & Family",
      phone: "+91 98260 99993",
      inviteCode: "GUPTA2026",
      rsvpStatus: "pending",
      attendeeCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await guestsCol.insertMany(sampleGuests);
  console.log("💌 3 Sample Guests & RSVPs created!");

  // 8. Verify Collections List
  const finalCols = await db.listCollections().toArray();
  console.log("\n✅ Clean Active Collections in", DB_NAME, ":");
  finalCols.forEach((c) => console.log(`   - ${c.name}`));

  await mongoose.disconnect();
  console.log("\n🚀 All done! Super Admin & Client ready with live sample wedding!");
}

reseedCleanDb().catch((err) => {
  console.error("❌ Reseed error:", err);
  process.exit(1);
});
