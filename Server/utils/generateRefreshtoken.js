import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const generateRefreshtoken = async (userId) => {
  const token = await jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "5d" }
  );
  const updateRefreshToken = await userModel.updateOne(
    { _id: userId },
    { refresh_token: token }
  );

  return token;
};
export default generateRefreshtoken;
