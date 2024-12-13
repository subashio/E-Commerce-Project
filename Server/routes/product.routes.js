import { Router } from "express";
import {
  createProductController,
  deleteProduct,
  filterByCategoryController,
  filterProduct,
  getProductsDetails,
  updateProductDetails,
} from "../controllers/product.controller.js";
import { admin } from "../middleware/admin.js";
import auth from "../middleware/auth.js";

const productRouter = Router();

productRouter.post("/create", auth, admin, createProductController);
productRouter.get("/get", getProductsDetails);
productRouter.get("/filter", filterProduct);
productRouter.get("/filter/category", filterByCategoryController);
productRouter.put("/update", auth, admin, updateProductDetails);
productRouter.delete("/delete", auth, admin, deleteProduct);

export default productRouter;
