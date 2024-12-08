import userModel from "../models/user.model.js";

export const admin = async (req, res, next) => {
  try {
    const userId = req.userId; //auth middleware
    const user = await userModel.findById(userId);

    if (user.role !== "ADMIN") {
      return res.status(400).json({
        message: "Not Access for Admin",
        error: true,
        success: false,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
