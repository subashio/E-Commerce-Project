import addressModel from "../models/address.model.js";
import userModel from "../models/user.model.js";

export async function addAddressController(req, res) {
  try {
    const userId = req.userId; //middelware auth
    const {
      address_title,
      address_line,
      city,
      country,
      mobile,
      pincode,
      state,
    } = req.body;

    const creatAddress = new addressModel({
      address_title,
      address_line,
      city,
      state,
      country,
      mobile,
      pincode,
      userId: userId,
    });

    const saveAddress = await creatAddress.save();

    const addressId = await userModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });
    return res.status(200).json({
      message: "Address added Successful",
      data: addressId,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAddressController(req, res) {
  try {
    const userId = req.userId; // middleware auth
    const data = await addressModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "list of Address",
      data: data,
      success: true,
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

export async function updateAddressController(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const {
      _id,
      address_title,
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
    } = req.body;
    console.log("UserId:", userId); // Debugging log
    console.log("Address ID:", _id); // Debugging log

    if (!_id) {
      return res.status(400).json({
        message: "Address ID (_id) is required.",
        success: false,
        error: true,
      });
    }

    const updateAddress = await addressModel.updateOne(
      { _id: _id },
      {
        $set: {
          address_title: address_title,
          address_line: address_line,
          city: city,
          state: state,
          country: country,
          mobile: mobile,
          pincode: pincode,
        },
      }
    );

    return res.status(200).json({
      message: "Address Updated Successful",
      data: updateAddress,
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

export async function updateAddressStatus(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { _id, status } = req.body;

    if (status) {
      // Set all other addresses to `false` for this user
      await addressModel.updateMany(
        { userId, _id: { $ne: _id } }, // All addresses except the current one
        { $set: { status: false } }
      );
    }
    // Update the selected address status
    const updatedAddress = await addressModel.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    return res.json({
      message: "status updated successfull ",
      error: false,
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function deleteAddressController(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { _id } = req.body;

    const deleteAddress = await addressModel.deleteOne({ _id: _id, userId });
    return res.json({
      message: "Address remove",
      error: false,
      success: true,
      data: deleteAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
