import express from "express";
import Order from "../models/Order.js";
import { authenticateToken } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, async (req: AuthRequest, res) => {
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

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: "Unable to place order", details: error.message });
  }
});

// Get user's own orders
router.get("/my-orders", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Unable to retrieve orders", details: error.message });
  }
});

export default router;
