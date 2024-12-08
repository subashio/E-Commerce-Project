import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addAddressController,
  deleteAddressController,
  getAddressController,
  updateAddressController,
  updateAddressStatus,
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/create", auth, addAddressController);
addressRouter.get("/get", auth, getAddressController);
addressRouter.put("/update", auth, updateAddressController);
addressRouter.put("/update-stauts", auth, updateAddressStatus);
addressRouter.delete("/delete", auth, deleteAddressController);

export default addressRouter;
