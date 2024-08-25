import { InferSchemaType, model, Schema } from "mongoose";

const productSchema = new Schema({
    title: { type: String, unique: true },
    brand: { type: String },
    category: { type: String },
    description: { type: String },
    discountPercentage: { type: Number },
    images: { type: [String] },
    price: { type: Number },
    stock: { type: Number },
    thumbnail: { type: String },
});

type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product", productSchema);