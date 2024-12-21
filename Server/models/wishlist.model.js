import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
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

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

export default wishlistModel;
