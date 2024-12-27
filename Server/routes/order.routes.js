import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  CashOnDeliveryOrderController,
  getAllOrdersController,
  getOrderDetailsController,
} from "../controllers/order.controller.js";
import { admin } from "../middleware/admin.js";

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.get("/order-list", auth, getOrderDetailsController);
orderRouter.get("/all-order", auth, admin, getAllOrdersController);

export default orderRouter;
