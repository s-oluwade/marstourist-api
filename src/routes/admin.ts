import express from "express";
import * as AdminController from "../controllers/admin";
import { requiresAdminAuth } from "../middleware/adminAuth";

const router = express.Router();

router.get("/", requiresAdminAuth, AdminController.getAdmin);

router.get("/users", requiresAdminAuth, AdminController.getUsers);

router.post("/register", AdminController.register);

router.post("/login", AdminController.login);

router.post("/logout", AdminController.logout);

export default router;