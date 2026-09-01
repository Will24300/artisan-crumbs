import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { createTransporter } from "./contact.js";

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get("/dashboard", async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    const products = await Product.find().select("-image").lean();
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get("host");
    const lightProducts = products.map((p) => ({
      ...p,
      image: `${protocol}://${host}/api/products/${p._id}/image`,
    }));

    res.json({
      users,
      products: lightProducts,
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

// Helper function to send order status change emails
async function sendOrderStatusEmail(order: any) {
  const user = order.user;
  if (!user || !user.email) {
    console.log(`[ORDER EMAIL] Skipping email notification: no user email found for order ${order._id}`);
    return;
  }

  const transporter = await createTransporter();
  if (!transporter) {
    console.log("[ORDER EMAIL] Skipping email notification: transporter not initialized");
    return;
  }

  const orderIdStr = String(order._id).slice(-8).toUpperCase();

  const statusMessages: Record<string, { subject: string; title: string; text: string }> = {
    pending: {
      subject: `Order #${orderIdStr} is Pending Review ⏳`,
      title: "Order Received",
      text: "We have received your order. Our team will review and accept it shortly.",
    },
    accepted: {
      subject: `Order #${orderIdStr} has been Accepted! 🥖`,
      title: "Order Accepted",
      text: "Great news! Your order has been accepted by our bakery team.",
    },
    preparing: {
      subject: `Order #${orderIdStr} is in the Oven! 🧑‍🍳`,
      title: "Preparing & Baking",
      text: "Your delicious bakes are currently in the oven and being prepared fresh.",
    },
    ready_for_pickup: {
      subject: `Order #${orderIdStr} is Ready for Pickup! 📦`,
      title: "Ready for Pickup",
      text: "Your fresh bakes are ready! Please head to our shop to collect your order.",
    },
    completed: {
      subject: `Order #${orderIdStr} Completed ✅`,
      title: "Order Completed",
      text: "Your order is complete. We hope you enjoy your freshly baked treats!",
    },
    declined: {
      subject: `Order #${orderIdStr} Update: Declined ❌`,
      title: "Order Declined",
      text: "We regret to inform you that your order has been declined. Any payment has been voided/refunded.",
    },
  };

  const currentMsg = statusMessages[order.status] || {
    subject: `Order #${orderIdStr} Status Updated`,
    title: "Order Status Update",
    text: `Your order status has been updated to: ${order.status}.`,
  };

  const emailSubject = `[Artisan Crumbs] ${currentMsg.subject}`;

  // Build items list
  const itemsHtml = order.items
    .map(
      (item: any) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 8px; text-align: left; color: #334155; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px 8px; text-align: center; color: #334155; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; color: #334155; font-size: 14px; font-family: monospace;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #fcfbf9;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #D46211; font-family: Georgia, serif; margin: 0; font-size: 28px;">Artisan Crumbs</h1>
        <p style="color: #64748b; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Handcrafted Daily</p>
      </div>
      
      <div style="background-color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <h2 style="color: #1e293b; font-size: 20px; margin-top: 0; font-weight: bold;">${currentMsg.title}</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
          Hi ${user.name || "Customer"},<br/>
          ${currentMsg.text}
        </p>

        <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 8px; text-align: left; color: #64748b; font-size: 11px; text-transform: uppercase;">Item</th>
                <th style="padding: 8px; text-align: center; color: #64748b; font-size: 11px; text-transform: uppercase;">Qty</th>
                <th style="padding: 8px; text-align: right; color: #64748b; font-size: 11px; text-transform: uppercase;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="2" style="padding: 16px 8px 8px 8px; text-align: left; font-weight: bold; color: #1e293b; font-size: 14px;">Total Amount (incl. tax)</td>
                <td style="padding: 16px 8px 8px 8px; text-align: right; font-weight: bold; color: #D46211; font-size: 16px; font-family: monospace;">$${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
          Order Reference: <span style="font-family: monospace; font-weight: bold;">#${order._id}</span>
        </div>
      </div>

      <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8;">
        <p>Thank you for choosing Artisan Crumbs!</p>
        <p style="margin-top: 8px;">This is an automated order status update. Please do not reply directly to this email.</p>
      </div>
    </div>
  `;

  console.log(`\n======================================================`);
  console.log(`[ORDER EMAIL] Sending status update to: ${user.email}`);
  console.log(`Order ID: ${order._id}`);
  console.log(`New Status: ${order.status}`);
  console.log(`Subject: ${emailSubject}`);
  console.log(`======================================================\n`);

  const nodemailerLib = await import("nodemailer");
  const info = await transporter.sendMail({
    from: `"Artisan Crumbs Orders" <${process.env.SMTP_USER || "no-reply@artisancrumbs.com"}>`,
    to: user.email,
    subject: emailSubject,
    text: `${currentMsg.text}\n\nOrder Total: $${order.totalAmount.toFixed(2)}\nOrder Reference: #${order._id}`,
    html: emailHtml,
  });

  const previewUrl = nodemailerLib.default.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[ORDER EMAIL] Test Email Preview URL: ${previewUrl}`);
  }
}

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "accepted", "preparing", "ready_for_pickup", "completed", "declined"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Restore stock if the order is being declined
    if (existingOrder.status !== "declined" && status === "declined") {
      for (const item of existingOrder.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
      }
    } 
    // Deduct stock if a declined order is being accepted/reverted
    else if (existingOrder.status === "declined" && status !== "declined") {
      for (const item of existingOrder.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
      }
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (order && existingOrder.status !== status) {
      sendOrderStatusEmail(order).catch((err) => {
        console.error(`[ORDER EMAIL] Failed to send email for order ${order._id}:`, err.message);
      });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: "Unable to update order status", details: error.message });
  }
});

export default router;
