import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "accepted" | "preparing" | "ready_for_pickup" | "completed" | "declined";
  fulfillmentType?: "pickup" | "delivery";
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  paymentMethod?: string;
  createdAt: Date;
}

export interface IOrderDocument extends IOrder, Document {}

const orderSchema = new Schema<IOrderDocument>(
  {
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
    fulfillmentType: { type: String, enum: ["pickup", "delivery"], default: "delivery" },
    pickupTime: { type: String, default: "" },
    deliveryAddress: { type: String, default: "" },
    deliveryFee: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "card" },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

const Order = mongoose.model<IOrderDocument>("Order", orderSchema);

export default Order;
