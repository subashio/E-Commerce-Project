import productModel from "../models/product.model.js";
import catergoryModel from "../models/category.model.js";

export async function createProductController(req, res) {
  try {
    const {
      name,
      image,
      description,
      categoryId,
      sub_categoryId,
      brandName,
      maxQuantity,
      minQuantity,
      wholesalePrice,
      isWholesale,
      variantId,
      stock,
      status,
      price,
      salePrice,
      filterOptions,
      specifications,
      searchTags,
    } = req.body;

    console.log("Request body:", req.body);

    if (
      !name ||
      !image[0] ||
      !categoryId[0] ||
      !sub_categoryId[0] ||
      !specifications ||
      !description
    ) {
      return res.status(400).json({
        message:
          "Enter required fields name, image, categoryId, sub_categoryId, isWholesale",
        error: true,
        success: false,
      });
    }
    if (isWholesale === false) {
      if (!salePrice || !price || !description) {
        return res.status(400).json({
          message:
            "Enter required fields name, image, categoryId, sub_categoryId, salePrice, price, description",
          error: true,
          success: false,
        });
      }
    }
    if (isWholesale === true) {
      if (!maxQuantity || !wholesalePrice) {
        return res.status(400).json({
          message: "Enter required fields  maxQuantity, wholesalePrice",
          error: true,
          success: false,
        });
      }
    }

    const category = await catergoryModel.find({ _id: categoryId });

    const payload =
      isWholesale === true
        ? {
            name,
            image,
            categoryId,
            sub_categoryId,
            productType: "wholesale",
            variantId,
            brandName,
            maxQuantity,
            minQuantity,
            wholesalePrice,
            salePrice,
            stock,
            status,
            description,
            filterOptions,
            specifications,
            searchTags,
          }
        : {
            name,
            image,
            categoryId,
            sub_categoryId,
            productType: "retail",
            brandName,
            stock,
            status,
            price,
            filterOptions,
            salePrice,
            description,
            specifications,
            searchTags,
          };

    const product = new productModel(payload);

    const saveProduct = await product.save();

    return res.status(200).json({
      message: "product added successful",
      success: true,
      error: false,
      data: saveProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getProductsDetails(req, res) {
  try {
    const getProduct = await productModel
      .find()
      .populate("variantId")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Product details",
      data: getProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function updateProductDetails(req, res) {
  try {
    const { _id } = req.body;

    const checkProduct = await productModel.findById(_id);

    if (!checkProduct) {
      return res.status(400).json({
        message: "check your product_id",
        error: true,
        success: false,
      });
    }

    const updateProduct = await productModel.findByIdAndUpdate(_id, {
      ...req.body,
    });

    return res.status(200).json({
      message: "product Updated successfull",
      success: true,
      error: false,
      data: updateProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { _id } = req.body;

    if (!_id) {
      return response.status(400).json({
        message: "provide product _id",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await productModel.deleteOne({ _id: _id });

    return res.status(200).json({
      message: "Product Deleted from the database",
      success: true,
      error: false,
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function filterProduct(req, res) {
  try {
    const { search, status } = req.query;

    //create a filter
    const filter = {};
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { name: searchRegex }, // Search in the name
        { description: searchRegex }, // Search in the description
        { brand: searchRegex }, // Search in the brand
        { category: searchRegex }, // Search in the category
        { subCategory: searchRegex }, // Search in the sub-category
      ];
    }
    // Add status filter (convert string to boolean)
    if (status !== undefined && status !== "all") {
      filter.status = status === "true";
    }
    const product = await productModel.find(filter);

    return res.status(200).json({
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
      success: false,
    });
  }
}

export async function filterByCategoryController(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: "Category ID is required.",
        success: false,
        error: true,
      });
    }

    const products = await productModel.find({
      categoryId: id,
    });
    return res.status(200).json({
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function updateProductStock(req, res) {
  try {
    const { productId, quantity } = req.body; // Include 'quantity' in the request body

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0.",
        success: false,
        error: true,
      });
    }

    // Fetch the product to check the current stock
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    // Check if there's enough stock
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Not enough stock. Available stock: ${product.stock}`,
        success: false,
        error: true,
      });
    }

    // Update the stock after deducting the quantity
    const updatedProduct = await productModel.updateOne(
      { _id: productId },
      {
        $inc: { stock: -quantity }, // Decrease the stock by the order quantity
      }
    );

    if (!updatedProduct) {
      return res.status(500).json({
        message: "Failed to update product stock",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Order placed successfully, stock updated",
      data: updatedProduct,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
