import express from "express";
import * as UserController from "../controllers/user";
import MulterGoogleCloudStorage from 'multer-cloud-storage';
import env from '../util/validateEnv';

const multerGoogleStorage = new MulterGoogleCloudStorage({
    bucket: env.GCLOUD_STORAGE_BUCKET,
    projectId: env.GOOGLE_CLOUD_PROJECT,
    destination: 'userImageFiles/',
    filename: (req: any, file: any, cb: any) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const multer = require("multer");
const photosMiddleware = multer({
    storage: multerGoogleStorage
});

const router = express.Router();

router.get("/users", UserController.getUsers);

router.get("/", UserController.getUser);

router.get("/peer/:username", UserController.getPeer);

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.put("/", UserController.updateUserCredentials);

router.put("/profile", UserController.updateUserProfile);

router.put("/add-credit", UserController.addCredit);

router.put("/update-friendship", UserController.updateFriendship);

router.post("/delete-account", UserController.deleteAccount);

// not in use
// router.post("/uploadPhotoByLink", UserController.uploadPhotoByLink);

router.put("/uploadPhoto", photosMiddleware.any(), UserController.uploadPhoto);

export default router;