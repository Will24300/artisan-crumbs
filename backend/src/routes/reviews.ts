import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET all product reviews for Admin Dashboard
router.get("/all", authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const reviews = await Review.find().populate("productId", "name image price").sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch all reviews", details: error.message });
  }
});

// DELETE a product review by ID (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete review", details: error.message });
  }
});

// GET batch summary of rating averages and counts for all products
router.get("/summary", async (_req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const summaryMap: Record<string, { averageRating: number; count: number }> = {};
    stats.forEach((item) => {
      if (item._id) {
        summaryMap[item._id.toString()] = {
          averageRating: Math.round(item.averageRating * 10) / 10,
          count: item.count,
        };
      }
    });

    res.json(summaryMap);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch reviews summary", details: error.message });
  }
});

// GET recent reviews with customer photos (photo wall / community showcase)
router.get("/recent-photos", async (_req, res) => {
  try {
    const photoReviews = await Review.find({ photo: { $ne: "", $exists: true } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json(photoReviews);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch recent photo reviews", details: error.message });
  }
});

// GET reviews for a specific product
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.json({
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean();

    const totalReviews = reviews.length;
    let sumRating = 0;
    const ratingBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((rev) => {
      sumRating += rev.rating;
      const rounded = Math.min(5, Math.max(1, Math.round(rev.rating)));
      ratingBreakdown[rounded] = (ratingBreakdown[rounded] || 0) + 1;
    });

    const averageRating = totalReviews > 0 ? Math.round((sumRating / totalReviews) * 10) / 10 : 0;

    res.json({
      reviews,
      averageRating,
      totalReviews,
      ratingBreakdown,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch product reviews", details: error.message });
  }
});

// POST create a review for a product (authenticated)
router.post("/product/:productId", authenticateToken, async (req: any, res: any) => {
  try {
    const { productId } = req.params;
    const { rating, comment, photo } = req.body;
    const user = req.user;

    if (user?.role === "admin") {
      return res.status(403).json({ error: "Administrators cannot post product reviews." });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5 stars" });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: "Review comment is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if user has purchased this product (completed order)
    let isVerifiedPurchase = false;
    try {
      const userOrder = await Order.findOne({
        userId: user.id,
        status: { $in: ["completed", "ready_for_pickup", "accepted", "preparing"] },
        "items.productId": productId,
      });
      if (userOrder) {
        isVerifiedPurchase = true;
      }
    } catch {
      // Non-blocking verification check
    }

    const newReview = await Review.create({
      productId,
      userId: user.id,
      userName: user.name || "Artisan Lover",
      userAvatar: user.avatar || "",
      rating: Number(rating),
      comment: comment.trim(),
      photo: photo || "",
      isVerifiedPurchase,
    });

    res.status(201).json(newReview);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit review", details: error.message });
  }
});

export default router;
