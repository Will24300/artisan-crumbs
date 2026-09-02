import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authenticateToken } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// ── Available time slots ──────────────────────────────────────────────────────
// GET /api/orders/available-slots?date=YYYY-MM-DD
// Returns an array of slots with slot label, total capacity, and remaining bookings.
const DAILY_SLOTS = [
  { id: "morning-early", label: "08:00 AM – 09:30 AM", emoji: "🌅", name: "Fresh Morning Batch", capacity: 8 },
  { id: "morning-mid", label: "10:00 AM – 11:30 AM", emoji: "☀️", name: "Mid-Morning Batch", capacity: 8 },
  { id: "afternoon", label: "02:00 PM – 03:30 PM", emoji: "🌇", name: "Afternoon Fresh", capacity: 8 },
  { id: "evening", label: "04:30 PM – 06:00 PM", emoji: "🌆", name: "Evening Batch", capacity: 8 },
];

router.get("/available-slots", async (req, res) => {
  try {
    const { date } = req.query as { date?: string };
    if (!date) {
      return res.status(400).json({ error: "date query param required (YYYY-MM-DD)" });
    }

    // Count how many orders are already booked for each slot on this date
    const existingOrders = await Order.find({ scheduledDate: date });

    const slots = DAILY_SLOTS.map((slot) => {
      const booked = existingOrders.filter((o) => o.timeSlot === slot.label).length;
      return {
        ...slot,
        booked,
        remaining: Math.max(0, slot.capacity - booked),
        available: booked < slot.capacity,
      };
    });

    res.json({ date, slots });
  } catch (error: any) {
    res.status(500).json({ error: "Unable to retrieve slots", details: error.message });
  }
});

// ── Place order ───────────────────────────────────────────────────────────────
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
      scheduledDate,
      timeSlot,
      paymentMethod,
      paymentStatus: requestedPaymentStatus,
      transactionId: requestedTransactionId,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate slot still available when a slot is chosen
    if (scheduledDate && timeSlot) {
      const existingForSlot = await Order.countDocuments({ scheduledDate, timeSlot });
      const slot = DAILY_SLOTS.find((s) => s.label === timeSlot);
      if (slot && existingForSlot >= slot.capacity) {
        return res.status(409).json({ error: `The ${timeSlot} slot is now fully booked. Please choose another slot.` });
      }
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
          error: `Insufficient stock for ${item.name}. Only ${product.stock} available.`,
        });
      }
    }

    // Deduct stock for non-custom items
    for (const item of items) {
      if (String(item.productId).startsWith("custom-")) continue;
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    const selectedMethod = paymentMethod || "card";
    const finalTransactionId =
      requestedTransactionId ||
      (selectedMethod !== "cash" ? `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : "");

    const finalPaymentStatus = requestedPaymentStatus || (selectedMethod === "cash" ? "pending" : "paid");

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      status: "pending",
      fulfillmentType: fulfillmentType === "pickup" ? "pickup" : "delivery",
      pickupTime: pickupTime || "",
      deliveryAddress: deliveryAddress || "",
      deliveryFee: Number(deliveryFee) || 0,
      scheduledDate: scheduledDate || "",
      timeSlot: timeSlot || "",
      paymentMethod: selectedMethod,
      paymentStatus: finalPaymentStatus,
      transactionId: finalTransactionId,
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: "Unable to place order", details: error.message });
  }
});

// ── My orders ────────────────────────────────────────────────────────────────
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
