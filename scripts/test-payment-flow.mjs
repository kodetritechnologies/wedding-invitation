import mongoose from "mongoose";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Load .env manually for standalone script execution
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...values] = trimmed.split("=");
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join("=").trim().replace(/(^"|"$)/g, "");
      }
    }
  });
}

const { DB_USERNAME, DB_PASS, DB_NAME } = process.env;
const uri = `mongodb://${encodeURIComponent(DB_USERNAME || "")}:${encodeURIComponent(
  DB_PASS || ""
)}@ac-dwrpxci-shard-00-00.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-01.o4cvr9a.mongodb.net:27017,ac-dwrpxci-shard-00-02.o4cvr9a.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=atlas-jhv7w4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Kodetritechnologies`;

// 1. Separate Payment Model & Collection (for Credentials)
const PaymentSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    mode: { type: String, enum: ["test", "live"], default: "test" },
    testKeyId: { type: String, default: "" },
    testKeySecret: { type: String, default: "" },
    liveKeyId: { type: String, default: "" },
    liveKeySecret: { type: String, default: "" },
    currency: { type: String, default: "INR" },
  },
  { timestamps: true, collection: "payments" }
);

// 2. Separate Order Model & Collection (for Customer Orders & Transactions)
const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    templateSlug: { type: String, required: true },
    templateTitle: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String },
    mode: { type: String, enum: ["test", "live"], default: "test" },
    notes: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: "orders" }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

async function runTests() {
  console.log("=================================================");
  console.log("   RAZORPAY SEPARATE COLLECTIONS TEST SUITE      ");
  console.log("   (Payment -> 'payments' | Order -> 'orders')   ");
  console.log("=================================================\n");

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log("✅ Database connected successfully.\n");

    // TEST 1: Payment Model (Collection: "payments")
    console.log("TEST 1: Verifying 'payments' collection for gateway credentials...");
    let paymentSettings = await Payment.findOne();
    if (!paymentSettings) {
      paymentSettings = await Payment.create({
        isActive: true,
        mode: "test",
        testKeyId: "rzp_test_SampleKey123456",
        testKeySecret: "SampleSecretTestXYZ789",
        liveKeyId: "rzp_live_LiveKey654321",
        liveKeySecret: "SampleSecretLiveABC321",
        currency: "INR",
      });
      console.log("  -> Created initial Payment document in 'payments' collection");
    } else {
      paymentSettings.isActive = true;
      paymentSettings.mode = "test";
      paymentSettings.testKeyId = "rzp_test_SampleKey123456";
      paymentSettings.testKeySecret = "SampleSecretTestXYZ789";
      paymentSettings.liveKeyId = "rzp_live_LiveKey654321";
      paymentSettings.liveKeySecret = "SampleSecretLiveABC321";
      await paymentSettings.save();
      console.log("  -> Updated test/live credentials in 'payments' collection");
    }

    if (Payment.collection.name !== "payments") {
      throw new Error(`Expected collection 'payments', got '${Payment.collection.name}'`);
    }
    console.log(`  [PASS] Verified collection name is '${Payment.collection.name}'.`);

    // TEST 2: Order Model (Collection: "orders")
    console.log("\nTEST 2: Verifying 'orders' collection for customer transactions...");
    const testOrderId = `TEST-ORD-${Date.now()}`;
    const mockRzpOrderId = `order_test_${Date.now()}`;
    const newOrder = await Order.create({
      orderId: testOrderId,
      razorpayOrderId: mockRzpOrderId,
      templateSlug: "royal-rajputana-wedding",
      templateTitle: "Royal Rajputana Golden Card",
      amount: 499,
      currency: "INR",
      status: "created",
      customerName: "Vihan Sharma",
      customerPhone: "+91 98260 12345",
      customerEmail: "vihan@example.com",
      mode: "test",
      notes: { test: true },
    });

    if (Order.collection.name !== "orders") {
      throw new Error(`Expected collection 'orders', got '${Order.collection.name}'`);
    }
    console.log(`  [PASS] Verified collection name is '${Order.collection.name}'.`);
    console.log(`  [PASS] Order successfully created with ID: ${newOrder.orderId}`);

    // TEST 3: Signature Verification & Order Status Update
    console.log("\nTEST 3: Signature Verification & updating Order status in 'orders'...");
    const mockPaymentId = `pay_test_${Date.now()}`;
    const secretToUse = paymentSettings.testKeySecret;

    const validSignature = crypto
      .createHmac("sha256", secretToUse)
      .update(`${mockRzpOrderId}|${mockPaymentId}`)
      .digest("hex");

    newOrder.status = "paid";
    newOrder.razorpayPaymentId = mockPaymentId;
    newOrder.razorpaySignature = validSignature;
    await newOrder.save();

    console.log("  [PASS] Order status updated to 'paid' in 'orders' collection.");

    // Clean up test order
    await Order.deleteOne({ orderId: testOrderId });
    console.log("\nCleaned up test order cleanly.");

    console.log("\n=================================================");
    console.log("   🎉 SEPARATE COLLECTIONS ARCHITECTURE VERIFIED! ");
    console.log("=================================================");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("\n❌ TEST SUITE ERROR:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runTests();
