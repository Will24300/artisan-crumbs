import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const ATLAS_URI = "mongodb+srv://volonterwicha123_db_user:mugundar@artisan-crumbs.aqxt1ot.mongodb.net/artisan-crumbs?retryWrites=true&w=majority&appName=artisan-crumbs";
const LOCAL_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/artisan-crumbs";

async function syncAtlasToLocal() {
  console.log("Connecting to MongoDB Atlas...");
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log("Connected to MongoDB Atlas!");

  const atlasProducts = await atlasConn.collection("products").find({}).toArray();
  console.log(`Fetched ${atlasProducts.length} real products from MongoDB Atlas.`);

  await atlasConn.close();

  console.log(`Connecting to Local MongoDB (${LOCAL_URI})...`);
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log("Connected to Local MongoDB!");

  const localProductsColl = localConn.collection("products");

  console.log("Clearing local products collection...");
  await localProductsColl.deleteMany({});

  console.log("Copying real products with real images from Atlas to local MongoDB...");
  if (atlasProducts.length > 0) {
    await localProductsColl.insertMany(atlasProducts);
  }

  const finalCount = await localProductsColl.countDocuments();
  console.log(`✅ Success! Local database now has ${finalCount} real products with original MongoDB Atlas images.`);

  await localConn.close();
  process.exit(0);
}

syncAtlasToLocal().catch((err) => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});
