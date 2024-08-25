import {RequestHandler} from 'express';
import ActivityModel from '../models/activity';
import env from '../util/validateEnv';
import UserModel, {UserWithId} from '../models/user';
const jwt = require('jsonwebtoken');

export const getActivities: RequestHandler = async (req, res, next) => {
  const id = req.params.userId;
  let activities = await ActivityModel.find({}).exec();

  // update thumbnails and user name
  for (const activity of activities) {

    const user = await UserModel.findById(activity.userId).exec();
    if (user) {
      // update user thumbnail
      if (user.thumbnail !== activity.thumbnail) {
        activity.set('thumbnail', user.thumbnail);
      }
      // update user name
      if (user.fullname !== activity.owner) {
        activity.set('owner', user.fullname);
      }
      await activity.save();
    }
  }

  res.json(activities);
};

export const getPosts: RequestHandler = async (req, res, next) => {
  const id = req.params.userId;
  let posts = await ActivityModel.find({userId: id}).exec();

  res.json(posts);
};

interface PostBody {
  content: string;
  topic?: string;
  likes?: [string];
}

// Just a function, not a request handler
export async function createNewUserActivity(user: UserWithId) {
  await ActivityModel.create({
    userId: user.id,
    owner: user.fullname,
    thumbnail: user.thumbnail,
    activityType: 'newUser',
    currentLocation: user.location ?? 'mars',
  });
}

// Just a function, not a request handler
export async function createNewLocationActivity(user: UserWithId, location: string) {
  await ActivityModel.create({
    userId: user.id,
    owner: user.fullname,
    thumbnail: user.thumbnail,
    activityType: 'newLocation',
    currentLocation: location,
  });
}

export const createPostActivity: RequestHandler<unknown, unknown, PostBody, unknown> = async (req, res, next) => {
  const {token} = req.cookies;
  const content = req.body.content;
  const topic = req.body.topic || '';
  const likes = req.body.likes || [];

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw err;

      const user = await UserModel.findById(decodedUser.id);
      if (!user) throw new Error();

      try {
        const post = await ActivityModel.create({
          userId: decodedUser.id,
          content,
          topic,
          likes,
          owner: user.fullname,
          thumbnail: user.thumbnail,
          activityType: 'post',
          currentLocation: user.location ?? 'mars'
        });

        res.json(post);
      } catch (error) {
        console.error(error);
        res.json(null);
      }
    });
  } else {
    console.log('User not signed in');
    res.json(null);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any}) => {
      if (err) throw err;

      try {
        const post = await ActivityModel.findByIdAndDelete(postId);

        res.json(post);
      } catch (error) {
        console.error(error);
        res.json(null);
      }
    });
  }
};

export const likePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  const {token} = req.cookies;

  if (token) {
    jwt.verify(token, env.JWT_SECRET, {}, async (err: any, decodedUser: {id: any; name: string}) => {
      if (err) throw err;

      try {
        let post = await ActivityModel.findById(postId).exec();

        if (post) {
          if (post.likes.map((like) => like.userId.toString()).includes(decodedUser.id)) {
            post.likes = post.likes.filter((like) => like.userId.toString() !== decodedUser.id);
          } else {
            post.likes.push({userId: decodedUser.id, name: decodedUser.name});
          }
          res.json(await post.save());
        } else {
          res.json(null);
        }
      } catch (error) {
        console.error(error);
        res.json(null);
      }
    });
  }
};
