import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get("/dashboard", async (_req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    const products = await Product.find().select("name category price description image tags createdAt");
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({
      users,
      products,
      orders,
      totals: {
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load dashboard data", details: error.message });
  }
});

router.get("/users", async (_req, res) => {
  const users = await User.find().select("name email role createdAt");
  res.json(users);
});

router.delete("/users/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ success: true });
});

router.patch("/users/:id", async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("name email role createdAt");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.delete("/products/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ success: true });
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: "Unable to update order status", details: error.message });
  }
});

export default router;
