import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { DB_USERNAME, DB_PASS, DB_NAME } = process.env;

const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

async function seed() {
  await mongoose.connect(uri);
  const Admins = mongoose.connection.collection("admins");
  const hash = await bcrypt.hash("Client@2026", 10);

  const existing = await Admins.findOne({ email: "client@vivahvaani.kodetri.com" });
  if (!existing) {
    await Admins.insertOne({
      name: "Aarav Sharma",
      email: "client@vivahvaani.kodetri.com",
      password: hash,
      phone: "+91 98260 12345",
      role: "admin",
      status: "active",
      subscription: { plan: "free", status: "active", activeWeddingLimit: 5 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Demo Client created successfully!");
  } else {
    await Admins.updateOne({ email: "client@vivahvaani.kodetri.com" }, { $set: { password: hash } });
    console.log("✅ Demo Client password updated successfully!");
  }

  await mongoose.disconnect();
}

seed();
