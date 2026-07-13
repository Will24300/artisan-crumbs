import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
const router = express.Router();
router.get("/", async (_req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});
router.get("/top-selling", async (_req, res) => {
    try {
        const allProducts = await Product.find();
        if (allProducts.length === 0) {
            return res.json([]);
        }
        const sales = await Order.aggregate([
            { $match: { status: { $ne: "declined" } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    quantitySold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { quantitySold: -1 } }
        ]);
        const salesMap = {};
        sales.forEach((item) => {
            if (item._id) {
                salesMap[item._id.toString()] = item.quantitySold;
            }
        });
        const soldProducts = allProducts.filter(p => (salesMap[p._id.toString()] || 0) > 0);
        let topProducts = [];
        if (soldProducts.length >= 3) {
            const sorted = [...allProducts].sort((a, b) => {
                const salesA = salesMap[a._id.toString()] || 0;
                const salesB = salesMap[b._id.toString()] || 0;
                return salesB - salesA;
            });
            topProducts = sorted.slice(0, 3);
        }
        else {
            const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
            topProducts = shuffled.slice(0, 3);
        }
        res.json(topProducts);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get top-selling products", details: error.message });
    }
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
        const { name, description, price, category, image, tags, stock } = req.body;
        const product = await Product.createProduct({
            name,
            description,
            price,
            category,
            image,
            tags: tags || [],
            stock: stock || 0,
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to create product", details: error.message });
    }
});
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, description, price, category, image, tags, stock } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = price;
        if (category !== undefined)
            updateData.category = category;
        if (image !== undefined)
            updateData.image = image;
        if (tags !== undefined)
            updateData.tags = tags;
        if (stock !== undefined)
            updateData.stock = stock;
        const product = await Product.updateProduct(req.params.id, updateData);
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
