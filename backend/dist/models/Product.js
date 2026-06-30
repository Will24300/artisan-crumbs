import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: () => new Date() },
}, { timestamps: true });
productSchema.statics.createProduct = function (data) {
    return this.create(data);
};
productSchema.statics.updateProduct = function (id, data) {
    return this.findByIdAndUpdate(id, data, { new: true });
};
const Product = mongoose.model("Product", productSchema);
export default Product;
