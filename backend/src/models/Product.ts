import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  stock: number;
  createdAt: Date;
}

export interface IProductDocument extends IProduct, Document {}

interface IProductModel extends Model<IProductDocument> {
  createProduct(data: Partial<IProduct>): Promise<IProductDocument>;
  updateProduct(id: string, data: Partial<IProduct>): Promise<IProductDocument | null>;
}

const productSchema = new Schema<IProductDocument, IProductModel>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0, min: 0 },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

productSchema.statics.createProduct = function (data: Partial<IProduct>) {
  return this.create(data);
};

productSchema.statics.updateProduct = function (id: string, data: Partial<IProduct>) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

const Product = mongoose.model<IProductDocument, IProductModel>("Product", productSchema);

export default Product;
