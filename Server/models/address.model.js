import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    address_title: {
      type: String,
      default: "",
    },
    address_line: {
      type: String,
      default: "",
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    country: {
      type: String,
    },
    mobile: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const addressModel = mongoose.model("address", addressSchema);

export default addressModel;
