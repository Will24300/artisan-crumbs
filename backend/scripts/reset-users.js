import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI environment variable not found.");
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function main() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Delete all existing users
    const deleteResult = await User.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} user(s) from database.`);

    // Create a new Admin user with known password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@artisancrumbs.com",
      passwordHash,
      role: "admin",
    });

    console.log("\nCreated fresh Admin account:");
    console.log("----------------------------");
    console.log(`Email:    admin@artisancrumbs.com`);
    console.log(`Password: password123`);
    console.log(`Role:     ${admin.role}`);
    console.log("----------------------------\n");

  } catch (err) {
    console.error("Error resetting users:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

main();
