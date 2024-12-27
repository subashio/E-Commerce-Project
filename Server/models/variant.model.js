import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    variant_name: {
      type: String,
      default: null,
      require: true,
    },
    brand_name: {
      type: Array,
      default: [],
      require: true,
    },
    material_type: {
      type: Array,
      default: [],
      require: true,
    },
  },
  { timestamps: true }
);

const variantModel = mongoose.model("variant", variantSchema);

export default variantModel;
