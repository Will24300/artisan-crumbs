import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();
router.post("/", authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (req.user.role === "admin") {
            return res.status(403).json({ error: "Administrators cannot place orders." });
        }
        const { items, totalAmount } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }
        // Check stock availability for all items
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${item.name}. Only ${product.stock} available.`
                });
            }
        }
        // Deduct stock for each item
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }
        const order = await Order.create({
            user: req.user.id,
            items,
            totalAmount,
            status: "pending",
        });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to place order", details: error.message });
    }
});
// Get user's own orders
router.get("/my-orders", authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to retrieve orders", details: error.message });
    }
});
export default router;
