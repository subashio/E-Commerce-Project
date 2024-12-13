import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import subCategoryModel from "../models/sub_category.model.js";

export async function createCategoryController(req, res) {
  try {
    const { name, status, image } = req.body;

    if (!name || !status) {
      return res.status(400).json({
        message: "Provide valid name",
        success: false,
        error: true,
      });
    }
    if (!image) {
      return res.status(400).json({
        message: "Provide valid image",
        success: false,
        error: true,
      });
    }

    const createCategory = new categoryModel({
      name: name,
      status: status,
      image: image,
    });

    const saveCategory = await createCategory.save();

    return res.status(200).json({
      message: "Category Created successful",
      success: true,
      error: false,
      data: saveCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getCategoryController(req, res) {
  try {
    const data = await categoryModel.find().sort({ createdAt: -1 });

    return res.json({
      message: "categort details",
      data: data,
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

export async function filterCategoryController(req, res) {
  try {
    const { search, status } = req.query;

    //create a filter
    const filter = {};

    // Add search filter (case-insensitive regex)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Add status filter (convert string to boolean)
    if (status !== undefined && status !== "all") {
      filter.status = status === "true";
    }
    const category = await categoryModel.find(filter);

    return res.status(200).json({
      error: false,
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
      success: false,
    });
  }
}

export async function updateCategoryController(req, res) {
  try {
    const { _id, name, status, image } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "provide category _id",
        error: true,
        success: false,
      });
    }
    const updateData = { name, status, image };

    const updateCategory = await categoryModel.findByIdAndUpdate(
      { _id: _id },
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: " category Updated Successful",
      data: updateCategory,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
}

export async function deleteCategoryController(req, res) {
  try {
    const { _id } = req.body;

    if (!_id) {
      res.json({
        message: "Provide the id",
        success: true,
        error: false,
      });
    }

    const checkSubCategory = await subCategoryModel
      .find({
        category: {
          $in: [_id],
        },
      })
      .countDocuments();

    const checkProduct = await productModel
      .find({
        category: {
          $in: [_id],
        },
      })
      .countDocuments();

    if (checkSubCategory > 0 || checkProduct > 0) {
      return res.status(400).json({
        message: "Category is already use can't delete",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await categoryModel.deleteOne({ _id: _id });

    res.status(200).json({
      message: "Product deleted successful",
      success: true,
      data: deleteCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
}
