import wishlistModel from "../models/wishlist.model.js";
import mongoose from "mongoose";
export async function createWishlistController(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(402).json({
        message: "Provide the reqied fields",
        success: false,
        error: true,
      });
    }

    const existingRecord = await wishlistModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (existingRecord) {
      return res.status(200).json({
        message: "Item already exsist in the cart",
      });
    }

    const wishlist = new wishlistModel({
      userId: userId,
      productId: productId,
    });

    const saveProduct = await wishlist.save();

    return res.status(200).json({
      message: " Product added to wishlist successful",
      success: true,
      data: saveProduct,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: true,
      error: false,
    });
  }
}

export async function getWishlistController(req, res) {
  try {
    const userId = req.userId;
    const wishlistProducts = await wishlistModel
      .find({
        userId: userId,
      })
      .populate("productId");

    return res.status(200).json({
      data: wishlistProducts,
      error: true,
      success: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function deleteWishlistController(req, res) {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "provide the fields",
        success: false,
        error: true,
      });
    }

    const deleteWishlist = await wishlistModel.deleteOne({
      productId: productId,
      userId: userId,
    });

    return res.status(200).json({
      message: "Wishlist deleted successfully",
      success: true,
      error: false,
      data: deleteWishlist,
    });
  } catch (error) {
    return res.status(200).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
