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
    } = req.body;
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
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      status: "pending",
      fulfillmentType: fulfillmentType === "pickup" ? "pickup" : "delivery",
      pickupTime: pickupTime || "",
      deliveryAddress: deliveryAddress || "",
      deliveryFee: Number(deliveryFee) || 0,
      paymentMethod: paymentMethod || "card",
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




























export default router; 

import dotenv from "dotenv"; 

dotenv.config(); 

import express from "express"; 

import jwt from "jsonwebtoken"; 

import crypto from "crypto"; 

import bcrypt from "bcryptjs"; 

import User from "../models/User.js"; 

 

const router = express.Router(); 

const secret = process.env.JWT_SECRET; 

const tokenExpiration = process.env.TOKEN_EXPIRATION || "1d"; 

 

if (!secret) { 

throw new Error("JWT_SECRET is required in environment variables"); 

} 

 

router.post("/register", async (req, res) => { 

try { 

const { name, email, password } = req.body; 

if (!name || !email || !password) { 

return res.status(400).json({ error: "Name, email and password are required" }); 

} 

 

const existingUser = await User.findByEmail(email); 

if (existingUser) { 

return res.status(400).json({ error: "Email already registered" }); 

} 

 

const totalUsers = await User.countDocuments(); 

const role = totalUsers === 0 ? "admin" : "customer"; 

const user = await User.createUser(name, email, password, role); 

 

const token = jwt.sign({ userId: user.id }, secret, { 

expiresIn: tokenExpiration as any, 

}); 

 

res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }); 

} catch (error: any) { 

res.status(500).json({ error: "Failed to register user", details: error.message }); 

} 

}); 

 

router.post("/login", async (req, res) => { 

try { 

const { email, password } = req.body; 

if (!email || !password) { 

return res.status(400).json({ error: "Email and password are required" }); 

} 

 

const user = await User.findByEmail(email); 

if (!user) { 

return res.status(401).json({ error: "Invalid email or password" }); 

} 

 

const validPassword = await user.comparePassword(password); 

if (!validPassword) { 

return res.status(401).json({ error: "Invalid email or password" }); 

} 

 

const token = jwt.sign({ userId: user.id }, secret, { 

expiresIn: tokenExpiration as any, 

}); 

 

res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }); 

} catch (error: any) { 

res.status(500).json({ error: "Login failed", details: error.message }); 

} 

}); 

export default router; 