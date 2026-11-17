import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { DB_USERNAME, DB_PASS, DB_NAME } = process.env;

const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

async function seedSuperAdmin() {
  console.log("Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(uri);

    // Explicit separate collection `superadmins`
    const SuperAdminCollection = mongoose.connection.collection("superadmins");

    const superAdminEmail = "admin@shaadiconnect.com";
    const existing = await SuperAdminCollection.findOne({ email: superAdminEmail });

    if (existing) {
      console.log(`ℹ️ Super Admin already exists in 'superadmins' collection: ${superAdminEmail}`);
    } else {
      const passwordHash = await bcrypt.hash("ShaadiAdmin@2026", 10);
      const superAdminUser = {
        name: "ShaadiConnect Super Admin",
        email: superAdminEmail,
        password: passwordHash,
        role: "super_admin",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await SuperAdminCollection.insertOne(superAdminUser);
      console.log("✅ Super Admin created in separate 'superadmins' collection! ID:", result.insertedId);
      console.log("Email: admin@shaadiconnect.com");
      console.log("Password: ShaadiAdmin@2026");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seedSuperAdmin();
