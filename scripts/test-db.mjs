import mongoose from "mongoose";

const { DB_USERNAME, DB_PASS, DB_NAME } = process.env;

const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

async function testConnection() {
  console.log("Testing connection to MongoDB Atlas...");
  console.log("Target Database:", DB_NAME);
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("Connection state:", conn.connection.readyState); // 1 = connected
    const adminDb = conn.connection.db?.admin();
    const pingResult = await adminDb?.ping();
    console.log("Ping Result:", pingResult);
    console.log("✅ Database connected and verified successfully!");
    await mongoose.disconnect();
    console.log("Disconnected cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  }
}

testConnection();
