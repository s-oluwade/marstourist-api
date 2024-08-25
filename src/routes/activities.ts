import express from "express";
import * as ActivitiesController from "../controllers/activities";

const router = express.Router();

router.get("/", ActivitiesController.getActivities);

router.get("/posts/:userId", ActivitiesController.getPosts);

router.post("/posts", ActivitiesController.createPostActivity);

router.delete("/posts/:postId", ActivitiesController.deletePost);

router.put("/posts/like/:postId", ActivitiesController.likePost);

export default router;
