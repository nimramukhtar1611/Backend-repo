const express = require('express');
const orderrouter = express.Router();
const nodemailer = require('nodemailer');

orderrouter.post('/', async (req, res) => {
  try {
    const {
      email, firstName, lastName, phone, address, city, postalCode,
      shippingmethod, paymentMethod, cartItems, total, subtotal, shipping
    } = req.body;

    // Admin email credentials
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'alfredwhite8811@gmail.com', // admin email
        pass: 'bzyaduxpwgatsyir',          // Gmail App Password
      }
    });

    // Build products HTML
    const productsHTML = cartItems.map(item => `
      <tr>
        <td style="border-right:1px solid #F4B92F;">
          <img src="${item.image}" alt="${item.title}" style="width:40px;vertical-align:middle;border-radius:0.3rem;margin-right:8px;">
          <span>${item.title} x${item.quantity}</span>
        </td>
        <td><p style="color:#F4B92F;text-align:end;padding-left:10px;">${item.price}</p></td>
      </tr>
    `).join('');

    // Send confirmation email to user
    const userMailOptions = {
      from: "alfredwhite8811@gmail.com",
      to: email, 
      subject: "Aurum Order Confirmation",
      html: `
      <div style='background-color:#f6f7fa;padding:30px;border-radius:12px; font-family:Poppins,sans-serif;'>
        <h1 style='color:#E1AD01;text-align:center;'>Thanks for shopping, ${firstName}!</h1>
        <h3 style='padding:10px;color:#A38235'>Hi ${firstName} ${lastName}, your order has been confirmed.</h3>
        <h2 style='color:#E1AD01;text-align:center;text-decoration:underline;'>Order Summary</h2>
        <table style='border:1px solid #F4B92F;padding:10px;width:100%;border-radius:8px;background:#fff;'>
          <tr>
            <th style="border-right:1px solid #F4B92F;border-bottom:1px solid #F4B92F;">Products</th>
            <th style="border-bottom:1px solid #F4B92F;">Total</th>
          </tr>
          ${productsHTML}
          <tr>
            <td style="border-right:1px solid #F4B92F;">Delivery Charges</td>
            <td>Rs${shipping}</td>
          </tr>
          <tr>
            <th style="border-right:1px solid #F4B92F;">Subtotal incl. Delivery Charges</th>
            <th>Rs${total}</th>
          </tr>
        </table>
        <br/>
        <h4 style="color:#222;">Shipping Details</h4>
        <p>
          <strong>Name:</strong> ${firstName} ${lastName}<br/>
          <strong>Email:</strong> ${email}<br/>
          <strong>Phone:</strong> ${phone}<br/>
          <strong>Address:</strong> ${address}, ${city}, ${postalCode}<br/>
          <strong>Shipping Method:</strong> ${shippingmethod}<br/>
          <strong>Payment Method:</strong> ${paymentMethod}
        </p>
      </div>
      `
    };

    // Send order notification to admin
    const adminMailOptions = {
      from: "alfredwhite8811@gmail.com",
      to: "alfredwhite8811@gmail.com",
      subject: "New Order Received",
      html: `
      <div style='background-color:#f6f7fa;padding:30px;border-radius:12px; font-family:Poppins,sans-serif;'>
        <h1 style='color:#E1AD01;text-align:center;'>New Order Received</h1>
        <p style='color:#A38235;text-align:center;'>A new order has been placed. Details are below:</p>
        <h2 style='color:#E1AD01;text-align:center;text-decoration:underline;'>Order Summary</h2>
        <table style='border:1px solid #F4B92F;padding:10px;width:100%;border-radius:8px;background:#fff;'>
          <tr>
            <th style="border-right:1px solid #F4B92F;border-bottom:1px solid #F4B92F;">Products</th>
            <th style="border-bottom:1px solid #F4B92F;">Total</th>
          </tr>
          ${productsHTML}
          <tr>
            <td style="border-right:1px solid #F4B92F;">Delivery Charges</td>
            <td>Rs${shipping}</td>
          </tr>
          <tr>
            <th style="border-right:1px solid #F4B92F;">Subtotal incl. Delivery Charges</th>
            <th>Rs${total}</th>
          </tr>
        </table>
        <br/>
        <h4 style="color:#222;">Customer & Shipping Details</h4>
        <p>
          <strong>Name:</strong> ${firstName} ${lastName}<br/>
          <strong>Email:</strong> ${email}<br/>
          <strong>Phone:</strong> ${phone}<br/>
          <strong>Address:</strong> ${address}, ${city}, ${postalCode}<br/>
          <strong>Shipping Method:</strong> ${shippingmethod}<br/>
          <strong>Payment Method:</strong> ${paymentMethod}<br/>
          <strong>Subtotal:</strong> Rs${subtotal}<br/>
          <strong>Shipping:</strong> Rs${shipping}<br/>
          <strong>Total:</strong> Rs${total}
        </p>
      </div>
      `
    };
console.log("Sending user and admin emails...");
    // Send emails in parallel
    await Promise.all([
      transport.sendMail(userMailOptions),
      transport.sendMail(adminMailOptions)
    ]);
console.log("Emails sent!");
    return res.status(200).json({ message: "Order placed and emails sent successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = orderrouter;