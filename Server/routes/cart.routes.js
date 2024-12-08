import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addToCartController,
  deleteCartController,
  getCartItemController,
  updateCartQuantityController,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", auth, addToCartController);
cartRouter.get("/get", auth, getCartItemController);
cartRouter.put("/update", auth, updateCartQuantityController);
cartRouter.delete("/delete", auth, deleteCartController);

export default cartRouter;
