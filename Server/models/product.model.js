import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: Array,
      default: [],
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
    },
    sub_categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "subCategory",
    },
    unit: {
      type: String,
      default: null,
    },
    stock: {
      type: Number,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      default: null,
    },
    salePrice: {
      type: Number,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
