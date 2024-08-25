import { InferSchemaType, model, Schema } from "mongoose";

const purchaseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    imageUrl: String,
    brand: String,
    category: String,
    quantity: { type: Number, required: true },
}, { timestamps: true });

type Purchase = InferSchemaType<typeof purchaseSchema>;

export default model<Purchase>("Purchase", purchaseSchema);