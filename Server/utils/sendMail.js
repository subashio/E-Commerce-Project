import nodemailer from "nodemailer";

export async function sendMail(order) {
  try {
    console.log("Order received in sendMail:", order);

    if (!order || !order.cart || order.cart.length === 0) {
      throw new Error("Order data is missing or empty.");
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"GloboGreen" <subashthor22@gmail.com>', // Sender
      to: "subashthor22@gmail.com", // Your email to receive order details
      subject: `New Order Received - Order ID #${order.orderId}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Customer Name:</strong> ${order.user.name}</p>
        <p><strong>Email:</strong> ${order.user.email}</p>
        <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
        <p><strong>Payment Method:</strong> ${order.payment_status}</p>
        <p><strong>Subtotal:</strong> ₹${order.subTotalAmt}</p>
        <p><strong>Grand Total:</strong> ₹${order.totalAmt}</p>
        <h3>Order Items:</h3>
        <ul>
          ${
            order.cart && order.cart.length > 0
              ? order.cart
                  .map(
                    (item) => `
                    <li>
                      <strong>${item.product}</strong> - Qty: ${item.qty} - Price: ₹${item.price}
                    </li>
                  `
                  )
                  .join("")
              : "<li>No items in the cart.</li>"
          }
        </ul>
      `,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw error;
  }
}
