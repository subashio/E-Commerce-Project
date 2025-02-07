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
    brandName: {
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
    productType: {
      type: String,
      enum: ["retail", "wholesale"],
      default: "retail",
    },
    variantId: {
      type: mongoose.Schema.ObjectId,
      ref: "variant",
    },
    specifications: {
      type: Array,
      default: [],
    },
    filterOptions: {
      type: Array,
      default: [],
    },
    searchTags: {
      type: Array,
      default: [],
    },
    price: {
      type: Number,
      default: null,
    },
    salePrice: {
      type: Number,
      default: null,
    },
    wholesalePrice: {
      type: Number,
      default: null,
    },
    maxQuantity: {
      type: Number,
      default: null,
    },
    minQuantity: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    discount: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
