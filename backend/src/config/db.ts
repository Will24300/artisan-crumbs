import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is required in environment variables");
  }
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  console.log("Connected to MongoDB");
}
