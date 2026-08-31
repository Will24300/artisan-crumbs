import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
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

    const {
      items,
      totalAmount,
      fulfillmentType,
      pickupTime,
      deliveryAddress,
      deliveryFee,
      paymentMethod,
      paymentStatus: requestedPaymentStatus,
      transactionId: requestedTransactionId,
    } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check stock availability for non-custom items
    for (const item of items) {
      if (String(item.productId).startsWith("custom-")) continue;
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

    // Deduct stock for non-custom items
    for (const item of items) {
      if (String(item.productId).startsWith("custom-")) continue;
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    const selectedMethod = paymentMethod || "card";
    const finalTransactionId =
      requestedTransactionId ||
      (selectedMethod !== "cash"
        ? `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        : "");

    const finalPaymentStatus =
      requestedPaymentStatus || (selectedMethod === "cash" ? "pending" : "paid");

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      status: "pending",
      fulfillmentType: fulfillmentType === "pickup" ? "pickup" : "delivery",
      pickupTime: pickupTime || "",
      deliveryAddress: deliveryAddress || "",
      deliveryFee: Number(deliveryFee) || 0,
      paymentMethod: selectedMethod,
      paymentStatus: finalPaymentStatus,
      transactionId: finalTransactionId,
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




























