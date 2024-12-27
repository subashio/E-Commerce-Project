import { Router } from "express";
import {
  addVariant,
  deleteVariant,
  filterVariant,
  updateVariant,
  getVariant,
} from "../controllers/variant.controller.js";

const variantRouter = Router();

variantRouter.post("/add", addVariant);
variantRouter.delete("/delete", deleteVariant);
variantRouter.get("/filter", filterVariant);
variantRouter.put("/update", updateVariant);
variantRouter.get("/get", getVariant);

export default variantRouter;
