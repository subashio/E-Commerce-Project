import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requried: [true, "Provide name"],
    },
    email: {
      type: String,
      requried: [true, "Provide email"],
      unique: true,
      min: 2,
      max: 250,
    },
    password: {
      type: String,
      requried: [true, "Provide password"],
    },
    companyName: {
      type: String,
      default: "",
    },
    officeAddress: {
      type: String,
      default: "",
    },
    isWholesaler: {
      type: Boolean,
      default: false,
    },
    isApprovedWholsale: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      default: null,
    },
    refresh_token: {
      type: String,
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    GSTIN: {
      type: String,
      default: "",
    },
    last_login_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "suspended"],
      default: "Active",
    },
    address_details: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    shopping_cart: {
      type: [mongoose.Schema.ObjectId],
      ref: "cart",
      default: [],
    },
    order_history: {
      type: mongoose.Schema.ObjectId,
      ref: "order",
    },
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expried: {
      type: Date,
      default: "",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
