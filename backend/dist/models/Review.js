import mongoose, { Schema } from "mongoose";
const reviewSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true, trim: true },
    userAvatar: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    photo: { type: String, default: "" },
    isVerifiedPurchase: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date() },
}, { timestamps: true });
const Review = mongoose.model("Review", reviewSchema);
export default Review;
