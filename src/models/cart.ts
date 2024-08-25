import { InferSchemaType, model, Schema } from "mongoose";

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: {
        type: Map,
        of: {
            count: { type: Number, default: 1 },
            timestamp: { type: Number, default: Date.now() },
        },
        default: {
            total: {
                count: 0,
                timestamp: Date.now(),
            }
        }
    },
}, { timestamps: true });

type Cart = InferSchemaType<typeof cartSchema>;

export default model<Cart>("Cart", cartSchema);