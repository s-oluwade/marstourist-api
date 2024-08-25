import {InferSchemaType, model, Schema} from 'mongoose';

const postSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    thumbnail: String,
    owner: String,
    topic: String,
    content: String,
    likes: {
      type: [
        {
          userId: {type: Schema.Types.ObjectId, required: true},
          name: {type: String, required: true},
        },
      ],
      default: [],
    },
  },
  {timestamps: true}
);

type Post = InferSchemaType<typeof postSchema>;

export default model<Post>('Post', postSchema);
