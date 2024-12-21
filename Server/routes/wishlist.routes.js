import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createWishlistController,
  deleteWishlistController,
  getWishlistController,
} from "../controllers/wishlist.controller.js";

const wishlistRouter = Router();

wishlistRouter.post("/create", auth, createWishlistController);
wishlistRouter.get("/get", auth, getWishlistController);
wishlistRouter.delete("/delete", auth, deleteWishlistController);

export default wishlistRouter;
