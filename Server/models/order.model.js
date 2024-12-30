import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      required: [true, "Provide orderId"],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    product_details: {
      name: String,
      image: Array,
      price: Number,
      status: Boolean,
      quantity: Number,
      variantQty: Array,
      variantTotal: Number,
    },
    paymentId: {
      type: String,
    },
    payment_status: {
      type: String,
    },
    order_status: {
      type: String,
      enum: ["Pending", "Shipped", "Success", "Cancel"],
      default: "Pending",
    },
    delivery_address: {
      type: Object,
      default: {},
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
