import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  createSubCategoryController,
  deleteSubCategory,
  getFilterSubCategory,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/create", auth, admin, createSubCategoryController);
subCategoryRouter.get("/get", getSubCategoryController);
subCategoryRouter.get("/filter", getFilterSubCategory);
subCategoryRouter.put("/update", auth, updateSubCategoryController);
subCategoryRouter.delete("/delete", auth, deleteSubCategory);

export default subCategoryRouter;
