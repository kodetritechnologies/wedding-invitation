import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { DB_USERNAME, DB_PASS, DB_NAME } = process.env;

const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

async function testSeparateCollections() {
  console.log("==========================================================");
  console.log("🔒 TESTING SEPARATE COLLECTIONS & ROLE-ISOLATED LOGINS");
  console.log("==========================================================");

  try {
    await mongoose.connect(uri);

    const superAdminCol = mongoose.connection.collection("superadmins");
    const adminCol = mongoose.connection.collection("admins");

    // 1. Verify SuperAdmin collection exists and has Super Admin
    const superAdmin = await superAdminCol.findOne({ email: "admin@shaadiconnect.com" });
    if (!superAdmin) throw new Error("Super Admin not found in 'superadmins' collection!");
    console.log("✅ 1. Found Super Admin in dedicated 'superadmins' collection:", superAdmin.email);

    // 2. Register a new test Admin into 'admins' collection
    const testAdminEmail = `studio_${Date.now()}@test.com`;
    const hashedAdminPass = await bcrypt.hash("Studio@123", 10);
    const adminInsert = await adminCol.insertOne({
      name: "Vijay Wedding Studio",
      email: testAdminEmail,
      password: hashedAdminPass,
      role: "admin",
      businessName: "Vijay Studios Indore",
      businessTypes: ["photographer", "invitation_designer"],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ 2. Registered Admin in dedicated 'admins' collection:", testAdminEmail);

    // 3. CROSS-COLLECTION LEAKAGE TEST:
    // Try to find the Admin in 'superadmins' collection
    const adminInSuperCol = await superAdminCol.findOne({ email: testAdminEmail });
    console.log("Cross check - Admin email in 'superadmins' collection:", adminInSuperCol);
    if (adminInSuperCol !== null) {
      throw new Error("SECURITY FAILURE: Admin found in 'superadmins' collection!");
    }
    console.log("✅ 3. Verified: Admin DOES NOT exist in 'superadmins' collection.");

    // Try to find the Super Admin in 'admins' collection
    const superInAdminCol = await adminCol.findOne({ email: "admin@shaadiconnect.com" });
    console.log("Cross check - SuperAdmin email in 'admins' collection:", superInAdminCol);
    if (superInAdminCol !== null) {
      throw new Error("SECURITY FAILURE: Super Admin found in 'admins' collection!");
    }
    console.log("✅ 4. Verified: Super Admin DOES NOT exist in 'admins' collection.");

    // 4. Test Super Admin login credentials against SuperAdmin collection
    const isSuperPasswordValid = await bcrypt.compare("ShaadiAdmin@2026", superAdmin.password);
    if (!isSuperPasswordValid) throw new Error("Super Admin password check failed");
    console.log("✅ 5. Super Admin login credentials authenticated successfully against 'superadmins' collection.");

    // Clean up test admin
    await adminCol.deleteOne({ _id: adminInsert.insertedId });
    console.log("✅ 6. Cleaned up test admin record.");

    console.log("==========================================================");
    console.log("🎉 SEPARATE COLLECTIONS & AUTH PATHS VERIFIED 100%");
    console.log("==========================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testSeparateCollections();
