import express from "express";
import Settings, { getOrCreateSettings } from "../models/Settings.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/settings - Public route to retrieve store settings
router.get("/", async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch settings", details: error.message });
  }
});

// PUT /api/settings - Admin route to update store settings
router.put("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      storeName,
      storeEmail,
      storePhone,
      storeAddress,
      businessTagline,
      paypalEnabled,
      stripeEnabled,
      cashEnabled,
      freeDelivery,
      deliveryFee,
      minOrderAmount,
      taxRate,
      currency,
      currencySymbol,
      maintenanceMode,
      orderNotificationEmail,
      enableLowStockAlerts,
    } = req.body;

    let settings = await getOrCreateSettings();

    if (storeName !== undefined) settings.storeName = String(storeName).trim();
    if (storeEmail !== undefined) settings.storeEmail = String(storeEmail).trim();
    if (storePhone !== undefined) settings.storePhone = String(storePhone).trim();
    if (storeAddress !== undefined) settings.storeAddress = String(storeAddress).trim();
    if (businessTagline !== undefined) settings.businessTagline = String(businessTagline).trim();

    if (paypalEnabled !== undefined) settings.paypalEnabled = Boolean(paypalEnabled);
    if (stripeEnabled !== undefined) settings.stripeEnabled = Boolean(stripeEnabled);
    if (cashEnabled !== undefined) settings.cashEnabled = Boolean(cashEnabled);
    if (freeDelivery !== undefined) settings.freeDelivery = Boolean(freeDelivery);

    if (deliveryFee !== undefined) settings.deliveryFee = Math.max(0, Number(deliveryFee) || 0);
    if (minOrderAmount !== undefined) settings.minOrderAmount = Math.max(0, Number(minOrderAmount) || 0);
    if (taxRate !== undefined) settings.taxRate = Math.max(0, Number(taxRate) || 0);

    if (currency !== undefined) settings.currency = String(currency).trim();
    if (currencySymbol !== undefined) settings.currencySymbol = String(currencySymbol).trim();

    if (maintenanceMode !== undefined) settings.maintenanceMode = Boolean(maintenanceMode);
    if (orderNotificationEmail !== undefined) settings.orderNotificationEmail = String(orderNotificationEmail).trim();
    if (enableLowStockAlerts !== undefined) settings.enableLowStockAlerts = Boolean(enableLowStockAlerts);

    await settings.save();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update settings", details: error.message });
  }
});

export default router;
