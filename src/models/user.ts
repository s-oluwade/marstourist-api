import {InferSchemaType, model, Schema} from 'mongoose';

const userSchema = new Schema({
  fullname: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, select: false},
  userType: {type: String, required: true}, // user or admin
  username: {type: String, required: true, unique: true},
  credit: {type: Number, default: 0},
  photo: {type: String},
  thumbnail: {type: String},
  bio: {type: String},
  location: {type: String, default: 'mars'},
  friends: {
    type: [
      {
        userId: {type: Schema.Types.ObjectId},
        name: {type: String},
      }
    ],
    default: [],
  },
});

type User = InferSchemaType<typeof userSchema>;

export interface UserWithId extends User {
  id: string;
}

export default model<User>('User', userSchema);
