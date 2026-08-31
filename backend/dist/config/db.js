import mongoose from "mongoose";
export async function connectDatabase() {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/artisan-crumbs";
    try {
        await mongoose.connect(uri, { autoIndex: true });
        console.log("Connected to MongoDB:", uri.includes("@") ? "Remote Cluster" : uri);
    }
    catch (error) {
        const fallbackUri = "mongodb://127.0.0.1:27017/artisan-crumbs";
        if (uri !== fallbackUri) {
            console.warn(`Failed to connect to primary MONGO_URI (${error.message}). Trying fallback local MongoDB...`);
            await mongoose.connect(fallbackUri, { autoIndex: true });
            console.log("Connected to fallback local MongoDB");
        }
        else {
            throw error;
        }
    }
}
