import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 },
        },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["pending", "accepted", "preparing", "ready_for_pickup", "completed", "declined"],
        default: "pending",
    },
    createdAt: { type: Date, default: () => new Date() },
}, { timestamps: true });
const Order = mongoose.model("Order", orderSchema);
export default Order;
