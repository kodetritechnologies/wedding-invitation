import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { DB_USERNAME, DB_PASS, DB_NAME, JWT_SECRET } = process.env;

const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

async function testAuth() {
  console.log("=== Testing Authentication & Role Management ===");
  try {
    await mongoose.connect(uri);
    const UserCollection = mongoose.connection.collection("users");

    // 1. Verify Super Admin exists
    const superAdmin = await UserCollection.findOne({ role: "super_admin" });
    if (!superAdmin) throw new Error("Super Admin not found");
    console.log("1. Super Admin verified:", superAdmin.email, "| Role:", superAdmin.role);

    // 2. Create test Admin with businessTypes
    const testAdminEmail = `designer_${Date.now()}@test.com`;
    const hashed = await bcrypt.hash("TestPass@123", 10);
    const newAdmin = {
      name: "Rohit Sharma Designs",
      email: testAdminEmail,
      password: hashed,
      role: "admin",
      businessName: "Rohit Studios Indore",
      businessTypes: ["invitation_designer", "photographer"],
      status: "active",
      subscription: {
        plan: "starter",
        status: "active",
        activeWeddingLimit: 3,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const inserted = await UserCollection.insertOne(newAdmin);
    console.log("2. Admin registered successfully! ID:", inserted.insertedId);

    // 3. Password Verification Test
    const foundAdmin = await UserCollection.findOne({ _id: inserted.insertedId });
    const isCorrect = await bcrypt.compare("TestPass@123", foundAdmin.password);
    const isWrong = await bcrypt.compare("WrongPassword", foundAdmin.password);
    console.log("3. Password verification - Correct password:", isCorrect, "| Wrong password:", isWrong);
    if (!isCorrect || isWrong) throw new Error("Password verification assertion failed");

    // 4. JWT Token Generation & Verification Test
    const token = jwt.sign(
      {
        userId: foundAdmin._id.toString(),
        email: foundAdmin.email,
        role: foundAdmin.role,
        name: foundAdmin.name,
      },
      JWT_SECRET || "vivahvaani_jwt_secret_dev_key",
      { expiresIn: "7d" }
    );
    const decoded = jwt.verify(token, JWT_SECRET || "vivahvaani_jwt_secret_dev_key");
    console.log("4. JWT Token verified. Payload:", {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    // Clean up test admin
    await UserCollection.deleteOne({ _id: inserted.insertedId });
    console.log("5. Cleaned up test admin record.");

    console.log("✅ All Auth & Role tests passed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Auth test failed:", error);
    process.exit(1);
  }
}

testAuth();
