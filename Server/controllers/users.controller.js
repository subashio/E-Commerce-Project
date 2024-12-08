import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendEmail from "../config/sendEmail.js";
import emailVerificationTemplate from "../utils/emailVerificationTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshtoken from "../utils/generateRefreshtoken.js";
import jwt from "jsonwebtoken";
import generateOtp from "../utils/genarateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import cloudinaryImageUpload from "../utils/cloudinaryImageUpload.js";

//user registration
export async function registerController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide name,email,password",
        error: true,
        success: false,
      });
    }

    //checking exsiting user
    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({
        message: " Already registered email",
        error: true,
        success: false,
      });
    }

    // hasing password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: passwordHashed,
    };
    //creating new user
    const newUser = new userModel(payload);
    const save = await newUser.save();

    // verifying email after registeration using resend
    const VerifyEmailUrl = `${process.env.CLIENT_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from Shopme",
      html: emailVerificationTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    return res.json({
      message: "User Register successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
//user verifcation
export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await userModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }

    //updating user-model
    const updateUser = await userModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.json({
      message: "Verify email done",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
}

//user login
export async function LoginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Provide email and password",
        error: true,
        success: false,
      });
    }

    //user  not registered excist
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email is not Registered",
        success: false,
        error: true,
      });
    }
    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact Admin for access",
        success: false,
        error: true,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Check Your password",
        success: false,
        error: true,
      });
    }

    //genrating token
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshtoken(user._id);

    //updating user-model
    const updateUser = userModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    }); //15 mins
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 days

    return res.json({
      message: " Login Successfull",
      status: true,
      error: false,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//user Logout
export async function LogoutController(req, res) {
  try {
    const userId = req.userId; // middleware

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS)
      sameSite: "Strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    console.log(userId);
    const removeRefreshToken = await userModel.findByIdAndUpdate(
      userId,
      {
        refresh_token: "",
      },
      { new: true }
    );
    if (removeRefreshToken) {
      console.log("Refresh token removed successfully.");
    } else {
      console.log("Failed to remove refresh token.");
    }

    return res.status(200).json({
      message: " Logout Successfull",
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

//refresh token controller
export async function RefreshToken(req, res) {
  try {
    const token =
      req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    if (!verifyToken) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
        error: true,
        success: false,
      });
    }
    //generate a new access token
    const userId = verifyToken?._id;
    const newAccessToken = await generateRefreshtoken(userId);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 15 * 60 * 1000, // 15 mins
    };

    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.json({
      message: "New access Token Genarated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//forget password
export async function ForgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        success: false,
        error: true,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 2 * 60 * 1000);

    const update = await userModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expried: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot passward from shopme",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.json({
      message: "Check your email",
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

//forgot password verification
export async function VerifyForgotPassword(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide required fields email and password",
        error: true,
        success: false,
      });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email is not found",
        success: false,
        error: true,
      });
    }

    const currentTime = new Date().toISOString();

    if (!user.forgot_password_expried || !user.forgot_password_otp) {
      return res.status(400).json({
        message: "OTP or expiration not set for this user.",
        success: false,
        error: true,
      });
    }

    if (new Date(user.forgot_password_expried) < new Date(currentTime)) {
      return res.status(400).json({
        message: "The OTP is expired.",
        success: false,
        error: true,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Enter a Valid Otp",
        error: true,
        success: false,
      });
    }

    //update the database with empty strings
    await userModel.findByIdAndUpdate(user?._id, {
      forgot_password_expried: "",
      forgot_password_otp: "",
    });
    return res.status(200).json({
      message: "verification Successful",
      status: true,
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

//reseting password
export async function ResetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide the email and password, confirmPassword",
        success: false,
        error: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "email doesn't exsist",
        success: false,
        error: true,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords doen't match",
        success: false,
        error: true,
      });
    }
    // hasing password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const newPasswordHashed = await bcrypt.hash(newPassword, salt);

    const updatePass = await userModel.findByIdAndUpdate(user._id, {
      password: newPasswordHashed,
    });

    return res.status(200).json({
      message: "password Reseted successful",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
}
//sending the user details
export async function userDetails(req, res) {
  try {
    const userId = req.userId;

    const user = await userModel
      .findById(userId)
      .select("-password -refresh_token");

    return res.json({
      message: "user details",
      data: user,
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

export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId; // auth middleware
    const image = req.file; // multer middleware

    const upload = await cloudinaryImageUpload(image);
    console.log("image", image);
    const updateUser = await userModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.status(200).json({
      message: "Image uploaded successful",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function updatedUserDetails(req, res) {
  try {
    const userId = req.userId; // auth middleware
    const { email, name, mobile, password } = req.body;

    let hasPassword = "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hasPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await userModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hasPassword }),
      }
    );

    if (!updateUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "updated Successfully",
      success: true,
      error: false,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
