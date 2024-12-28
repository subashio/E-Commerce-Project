import mongoose from "mongoose";

const cartschema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    variantQty: {
      type: Array,
      default: [{ materialType: "", brandName: "", quantity: 0 }],
    },
    variantTotal: {
      type: Number,
      default: null,
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("cart", cartschema);

export default cartModel;
