import cartModel from "../models/cart.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

export async function addToCartController(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { productId, quantity, variantQty, variantTotal } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Provide the required fields",
        success: false,
        error: true,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid productId format",
        success: false,
        error: true,
      });
    }

    // Ensure indexes on userId and productId for faster querying
    const checkCartItem = await cartModel
      .findOne({
        userId: userId,
        productId: productId,
      })
      .lean(); // Use lean for faster read

    if (checkCartItem) {
      return res.status(400).json({
        message: "Item already exists in the cart",
      });
    }

    const cartItem = new cartModel({
      quantity: quantity,
      productId: productId,
      variantQty: variantQty ? variantQty : [],
      variantTotal: variantTotal ? variantTotal : null,
      userId: userId,
    });

    // Use Promise.all to perform save and update concurrently
    const [saveCart, updateCartUser] = await Promise.all([
      cartItem.save(),
      userModel.updateOne(
        { _id: userId },
        { $push: { shopping_cart: [cartItem._id] } }
      ),
    ]);

    // const [saveCart, updateCartUser] = await Promise.all([
    //   cartItem.save(),
    //   userModel.updateOne(
    //     { _id: userId },
    //     { $push: { shopping_cart: cartItem._id } } // Directly push the ObjectId
    //   ),
    // ]);

    return res.status(200).json({
      message: "Item added to the cart successfully",
      success: true,
      data: saveCart,
      error: false,
    });
  } catch (error) {
    console.error("Error in addToCartController:", error);
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getCartItemController(req, res) {
  try {
    const userId = req.userId;
    const cartItem = await cartModel
      .find({ userId: userId })
      .populate("productId")
      .lean();

    return res.status(200).json({
      data: cartItem,
      error: false,
      success: true,
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
    const { _id, qty, variantQty, variantTotal } = req.body;

    if (!_id || !qty) {
      return res.status(400).json({
        message: "provide the required fields id and qty",
        error: true,
        success: false,
      });
    }

    const updateCart = await cartModel.findOneAndUpdate(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
        variantQty: variantQty ? variantQty : [],
        variantTotal: variantTotal ? variantTotal : null,
      },
      {
        new: true, // Return the updated document
        lean: true, // Return a plain JavaScript object
      }
    );

    return res.status(200).json({
      message: "updated cart successful",
      error: false,
      success: true,
      data: updateCart,
    });
  } catch (error) {
    console.error("Error in updateCartQuantityController:", error);
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
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "provide the fields",
        success: false,
        error: true,
      });
    }

    // Execute both operations concurrently
    const [updateCartUser, deleteCart] = await Promise.all([
      userModel.updateOne({ _id: userId }, { $pull: { shopping_cart: _id } }),
      cartModel.deleteOne({
        _id: _id,
        userId: userId,
      }),
    ]);

    return res.status(200).json({
      message: "cart deleted successful",
      success: true,
      error: false,
      data: deleteCart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
