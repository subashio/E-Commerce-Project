import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createViewedProducts,
  getViewedProducts,
} from "../controllers/viewed_products.controller.js";

const viewedProductRouter = Router();

viewedProductRouter.post("/create", auth, createViewedProducts);
viewedProductRouter.get("/get", auth, getViewedProducts);

export default viewedProductRouter;
