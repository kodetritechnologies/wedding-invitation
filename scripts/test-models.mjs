import mongoose from "mongoose";

const { DB_USERNAME, DB_PASS, DB_NAME } = process.env;

const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

async function testModels() {
  console.log("Connecting to MongoDB Atlas to test schemas & collection access...");
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(
      "Existing collections in weddinginvitation db:",
      collections.map((c) => c.name)
    );

    console.log("✅ Models and Database access verified successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testModels();
