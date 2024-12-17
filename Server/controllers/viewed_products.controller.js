import viewedProductModel from "../models/viewed_products.model.js";

export async function createViewedProducts(req, res) {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(402).json({
        message: "Provide the reqied fields",
        success: false,
        error: true,
      });
    }

    const existingRecord = await viewedProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (existingRecord) {
      return res.status(200).json({
        message: "Item already exsist in the cart",
      });
    }

    const viewedProduct = new viewedProductModel({
      productId: productId,
      userId: userId,
    });

    const saveProduct = await viewedProduct.save();

    return res.status(200).json({
      message: "Viewed Product added successful",
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

export async function getViewedProducts(req, res) {
  try {
    const userId = req.userId;
    const viewedProducts = await viewedProductModel
      .find({
        userId: userId,
      })
      .populate("productId");

    return res.status(200).json({
      data: viewedProducts,
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
