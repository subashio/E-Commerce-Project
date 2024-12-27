import variantModel from "../models/variant.model.js";

export const addVariant = async (req, res) => {
  try {
    const { variant_name, brand_name, material_type } = req.body;

    const variant = new variantModel({
      variant_name,
      brand_name,
      material_type,
    });

    const saveVariant = await variant.save();

    return res.status(200).json({
      message: "Variant added successfully",
      data: saveVariant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Variant not added",
      error: error.message,
    });
  }
};

export const filterVariant = async (req, res) => {
  try {
    const { search } = req.query;
    const variant = await variantModel.find({
      variant_name: { $regex: search, $options: "i" },
    });
    return res.status(200).json({
      success: true,
      message: "Variant filtered successfully",
      error: false,
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Variant not filtered",
      error: error.message,
    });
  }
};
export const deleteVariant = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Provide valid variant id",
        success: false,
        error: true,
      });
    }
    const variant = await variantModel.findByIdAndDelete({ _id: _id });
    return res.status(200).json({
      message: "Variant deleted successfully",
      data: variant,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Variant not deleted",
      error: error.message,
    });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { _id, variant_name, brand_name, material_type } = req.body;

    if (!variant_name || !brand_name || !material_type) {
      return res.status(400).json({
        message: "Provide valid variant name, brand name, and material type",
        success: false,
        error: true,
      });
    }

    const updateData = {
      variant_name,
      brand_name,
      material_type,
    };
    const variant = await variantModel.findByIdAndUpdate(
      { _id: _id },
      updateData,
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Variant updated successfully",
      data: variant,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Variant not updated",
      error: error.message,
    });
  }
};

export const getVariant = async (req, res) => {
  try {
    const variant = await variantModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
      data: variant,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Variant not fetched",
      error: error.message,
    });
  }
};
