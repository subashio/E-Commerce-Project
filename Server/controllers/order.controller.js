import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import { sendMail } from "../utils/sendMail.js";

export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { list_items, totalAmt, address, subTotalAmt } = req.body;

    if (!address) {
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
        orderId: `GG#${Math.floor(1000 + Math.random() * 9000)}`, // Generates a random 4-digit number
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
          status: el.productId.status,
          price: el.productId.price
            ? el.productId.price
            : el.productId.wholesalePrice,
          quantity: el.quantity,
          variantQty: el.variantQty || [],
          variantTotal: el.variantTotal || null,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: address || {},
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });
    const generatedOrder = await orderModel.insertMany(payload);

    const removeCartItems = await cartModel.deleteMany({ userId: userId });
    const updateUserCart = await userModel.updateOne(
      { _id: userId },
      { $set: { shopping_cart: [] } }
    );
    const updateUserOrder = await userModel.updateOne(
      { _id: userId },
      { $push: { order_history: generatedOrder._id } }
    );

    const user = await userModel.findById(userId);

    const generatedOrderData =
      generatedOrder.length > 0 ? generatedOrder[0] : {};

    const formattedAddress = generatedOrderData.delivery_address
      ? `${generatedOrderData.delivery_address.address_line}, ${generatedOrderData.delivery_address.city}, ${generatedOrderData.delivery_address.state}, ${generatedOrderData.delivery_address.pincode}, ${generatedOrderData.delivery_address.country}`
      : "Address not provided";

    const orderWithUserData = {
      orderId: generatedOrderData.orderId, // Ensure orderId is available
      payment_status: generatedOrderData.payment_status,
      delivery_address: formattedAddress,
      subTotalAmt: generatedOrderData.subTotalAmt,
      totalAmt: generatedOrderData.totalAmt,
      user: {
        name: user.name,
        email: user.email,
      },
      cart: list_items.map((el) => ({
        product: el.productId.name,
        qty: el.quantity,
        price: el.productId.price
          ? el.productId.price
          : el.productId.wholesalePrice,
      })),
    };

    console.log("Order Data Sent to Email:", orderWithUserData);

    try {
      const mail = await sendMail(orderWithUserData); // Send the order with user data and cart
      console.log("Mail Response:", mail);
    } catch (mailError) {
      console.error("Email Sending Error:", mailError);
    }

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

//for future update
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

export async function getAllOrdersController(req, res) {
  try {
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate("userId");

    return res.json({
      message: "order details",
      data: orders,
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

export async function updateOrderStatus(req, res) {
  try {
    const { _id, order_status } = req.body;

    const updateOrder = await orderModel.updateOne(
      { _id: _id },
      {
        ...(order_status && { order_status: order_status }),
      }
    );
    if (!updateOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "order status updated succesful",
      data: updateOrder,
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
