import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
    },
    product_details: {
      type: String,
    },
    payment_id: {
      type: String,
    },
    payment_status: {
      type: String,
    },
    delivery_address: {
      type: Object,
      default: {},
    },
    delivery_status: {
      type: String,
    },
    subTotalAmt: {
      type: Number,
    },
    totalAmt: {
      type: Number,
    },
    invoice_receipt: {
      type: String,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
