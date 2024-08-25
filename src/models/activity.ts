import {InferSchemaType, model, Schema} from 'mongoose';

const activitySchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    thumbnail: String,
    owner: String,
    topic: String,
    content: String,
    currentLocation: {type:String, default: 'mars'},
    activityType: {type: String, required: true}, // post, newUser
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

type Post = InferSchemaType<typeof activitySchema>;

export default model<Post>('Post', activitySchema);
