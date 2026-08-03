import express from "express";
import { getOrCreateSettings } from "../models/Settings.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
const router = express.Router();
// GET /api/settings - Public route to retrieve store settings
router.get("/", async (_req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch settings", details: error.message });
    }
});
// PUT /api/settings - Admin route to update store settings
router.put("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { storeName, storeEmail, storePhone, storeAddress, paypalEnabled, stripeEnabled, cashEnabled, freeDelivery, deliveryFee, } = req.body;
        let settings = await getOrCreateSettings();
        if (storeName !== undefined)
            settings.storeName = storeName;
        if (storeEmail !== undefined)
            settings.storeEmail = storeEmail;
        if (storePhone !== undefined)
            settings.storePhone = storePhone;
        if (storeAddress !== undefined)
            settings.storeAddress = storeAddress;
        if (paypalEnabled !== undefined)
            settings.paypalEnabled = Boolean(paypalEnabled);
        if (stripeEnabled !== undefined)
            settings.stripeEnabled = Boolean(stripeEnabled);
        if (cashEnabled !== undefined)
            settings.cashEnabled = Boolean(cashEnabled);
        if (freeDelivery !== undefined)
            settings.freeDelivery = Boolean(freeDelivery);
        if (deliveryFee !== undefined)
            settings.deliveryFee = Number(deliveryFee) || 0;
        await settings.save();
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update settings", details: error.message });
    }
});
export default router;
