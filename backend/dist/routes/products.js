import express from "express";
import Product from "../models/Product.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
const router = express.Router();
router.get("/", async (_req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});
router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
});
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description, price, category, image, tags } = req.body;
        const product = await Product.createProduct({
            name,
            description,
            price,
            category,
            image,
            tags: tags || [],
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to create product", details: error.message });
    }
});
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const product = await Product.updateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to update product", details: error.message });
    }
});
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true });
});
export default router;
