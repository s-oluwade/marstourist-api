import express from "express";
import * as SalesController from "../controllers/sales";

const router = express.Router();

router.get("/cart", SalesController.getCart);

router.put("/cart/add", SalesController.addToCart);

router.put("/cart/remove", SalesController.removeFromCart);

router.get("/purchase", SalesController.getPurchase);

router.post("/purchase", SalesController.buyProducts);

export default router;