import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db.js";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import adminRouter from "./routes/admin.js";
import ordersRouter from "./routes/orders.js";
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 5000;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", ordersRouter);
app.get("/api/status", (_req, res) => {
    res.json({ status: "ok", message: "Artisan Crumbs backend is running" });
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
});
connectDatabase()
    .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
});
