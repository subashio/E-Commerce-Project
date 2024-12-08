import { json } from "express";
import cartModel from "../models/cart.model.js";
import userModel from "../models/user.model.js";

export async function addToCartController(req, res) {
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

    const checkCartItem = await cartModel.findOne({
      userId: userId,
      productId: productId,
    });
    if (checkCartItem) {
      return res.status(400).json({
        message: "Item already exsist in the cart",
      });
    }

    const cartItem = new cartModel({
      quantity: 1,
      productId: productId,
      userId: userId,
    });

    const saveCart = await cartItem.save();

    const updateCartUser = await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      }
    );
    return res.status(200).json({
      message: "Item added to  the cart successful",
      success: true,
      data: saveCart,
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

export async function getCartItemController(req, res) {
  try {
    const userId = req.userId;
    const cartItem = await cartModel
      .find({
        userId: userId,
      })
      .populate("productId");
    return res.status(200).json({
      data: cartItem,
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
export async function updateCartQuantityController(req, res) {
  try {
    const userId = req.userId;
    const { _id, qty } = req.body;

    if (!_id || !qty) {
      return res.status(400).json({
        message: "provide the required fields",
        error: true,
        success: false,
      });
    }
    const updateCart = await cartModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
      }
    );

    return res.status(200).json({
      message: "updated cart successful",
      error: false,
      success: true,
      data: updateCart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
export async function deleteCartController(req, res) {
  try {
    const userId = req.userId;
    const { _id } = req._id;

    if (!_id) {
      return res.status(400).json({
        message: "provide the fields",
        success: false,
        error: true,
      });
    }

    const deleteCart = await cartModel.deleteOne({
      _id: _id,
      userId: userId,
    });
    return res.status(200).json({
      message: "cart deleted successful",
      success: true,
      error: false,
      data: deleteCart,
    });
  } catch (error) {
    return res.status(200).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
