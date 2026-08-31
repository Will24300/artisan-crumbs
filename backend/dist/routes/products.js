import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
const router = express.Router();
// Helper: checks if a string is an inline base64 data-URI
function isBase64Image(str) {
    return str.startsWith("data:image/");
}
// Helper: build the public image URL for a product
function imageUrl(req, product) {
    // If the stored value is already a normal URL, keep it as-is
    if (!isBase64Image(product.image))
        return product.image;
    // Otherwise return a URL that points to our dedicated image endpoint
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}/api/products/${product._id}/image`;
}
// Helper: strip the heavy image field and replace with a lightweight URL
function toLightProduct(req, product) {
    const obj = product.toObject ? product.toObject() : { ...product };
    obj.image = imageUrl(req, obj);
    return obj;
}
// ── Dedicated image endpoint ────────────────────────────────────────────
// Serves the raw image binary with proper content-type + aggressive caching
router.get("/:id/image", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select("image").lean();
        if (!product || !product.image) {
            return res.status(404).json({ error: "Image not found" });
        }
        // If the image is a regular URL, redirect to it
        if (!isBase64Image(product.image)) {
            return res.redirect(product.image);
        }
        // Parse the data-URI:  data:image/png;base64,iVBORw0KGg...
        const matches = product.image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!matches) {
            return res.status(400).json({ error: "Invalid image format" });
        }
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        // Cache for 7 days (browser) + 30 days (CDN / proxy)
        res.set({
            "Content-Type": mimeType,
            "Content-Length": String(buffer.length),
            "Cache-Control": "public, max-age=604800, s-maxage=2592000, immutable",
            "ETag": `"${product._id}"`,
        });
        // Handle conditional requests (304 Not Modified)
        if (req.headers["if-none-match"] === `"${product._id}"`) {
            return res.status(304).end();
        }
        return res.send(buffer);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to serve image", details: error.message });
    }
});
// ── Product listings (no image data in the JSON) ────────────────────────
router.get("/", async (_req, res) => {
    // Exclude the heavy image field from the MongoDB query — this is the key
    // performance win since MongoDB Atlas won't transfer MBs of base64 data
    const products = await Product.find().select("-image").sort({ createdAt: -1 }).lean();
    const protocol = _req.headers["x-forwarded-proto"] || _req.protocol;
    const host = _req.get("host");
    // Always point to the dedicated image endpoint (handles both base64 & URL)
    const light = products.map((p) => ({
        ...p,
        image: `${protocol}://${host}/api/products/${p._id}/image`,
    }));
    res.json(light);
});
router.get("/top-selling", async (_req, res) => {
    try {
        // Exclude image data from the query
        const allProducts = await Product.find().select("-image").lean();
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
        const protocol = _req.headers["x-forwarded-proto"] || _req.protocol;
        const host = _req.get("host");
        const light = topProducts.map((p) => ({
            ...p,
            image: `${protocol}://${host}/api/products/${p._id}/image`,
        }));
        res.json(light);
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
    res.json(toLightProduct(req, product));
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
