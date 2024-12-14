import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  filterCategoryController,
  getCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";
import { admin } from "../middleware/admin.js";
import auth from "../middleware/auth.js";

const categoryRouter = Router();

categoryRouter.post("/create", auth, admin, createCategoryController);
categoryRouter.get("/get", getCategoryController);
categoryRouter.get("/filter", filterCategoryController);
categoryRouter.put("/update", auth, admin, updateCategoryController);
categoryRouter.delete("/delete", auth, admin, deleteCategoryController);

export default categoryRouter;
