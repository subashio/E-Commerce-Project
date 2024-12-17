import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import orderModel from "../models/order.model.js";
import cartModel from "../models/cart.model.js";
import addressModel from "../models/address.model.js";

export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    if (!addressId) {
      return res.status(404).json({
        message: "Provide Delivery address",
        success: false,
        error: true,
      });
    }

    const payload = list_items.map((el) => {
      return {
        userId: userId,
        // orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`, // Generate 6-digit Order ID
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
          status: el.productId.status,
          price: el.productId.price,
          quantity: el.quantity,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });
    const generatedOrder = await orderModel.insertMany(payload);

    const removeCartItems = await cartModel.deleteMany({ userId: userId });
    const updateUser = await userModel.updateMany(
      { _id: userId },
      { $set: { shopping_cart: [] } }
    );

    return res.json({
      message: "Order placed successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

export async function paymentController(req, res) {
  try {
    const userId = req.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const user = await userModel.findById(userId);

    const line_items = list_items.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount:
            pricewithDiscount(item.productId.price, item.productId.discount) *
            100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId; // order id
    const orderList = await orderModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.json({
      message: "order List",
      data: orderList,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
