import mongoose from "mongoose";

const viewedProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const viewedProductModel = mongoose.model("viewedproduct", viewedProductSchema);

export default viewedProductModel;
