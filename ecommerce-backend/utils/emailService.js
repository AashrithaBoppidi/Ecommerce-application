const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────
// Transporter — Gmail SMTP
// ─────────────────────────────────────────────
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// ─────────────────────────────────────────────
// Generate a short-lived signed token for
// payment method change via email link
// ─────────────────────────────────────────────
const generatePaymentChangeToken = (orderId, userId) => {
  return jwt.sign(
    { orderId, userId },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '15m' }
  );
};

// ─────────────────────────────────────────────
// Build HTML email body
// ─────────────────────────────────────────────
const buildOrderEmailHTML = (order, paymentChangeToken) => {
  const deliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Within 10 business days';

  const itemRows = (order.orderItems || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px; border-bottom:1px solid #2a2a3e;">${item.name}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #2a2a3e; text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #2a2a3e; text-align:right;">₹${Number(item.price).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const addr = order.shippingAddress || {};
  const shippingText = [addr.address, addr.city, addr.state, addr.postalCode, addr.country]
    .filter(Boolean)
    .join(', ');

  // Link points to backend → backend redirects to frontend with token
  const changePaymentLink = `http://localhost:5000/api/orders/change-payment?token=${paymentChangeToken}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d0d1a; font-family: 'Segoe UI', Arial, sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 640px; margin: 32px auto; background: #13132b; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a4a; }
    .header { background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 36px 32px; text-align: center; }
    .header h1 { font-size: 26px; color: #fff; letter-spacing: 1px; }
    .header p  { color: rgba(255,255,255,0.85); margin-top: 6px; font-size: 14px; }
    .body { padding: 32px; }
    .section-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #a78bfa; margin-bottom: 12px; margin-top: 28px; }
    .info-box { background: #1a1a35; border-radius: 10px; padding: 16px 20px; border: 1px solid #2a2a4a; }
    .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #22223a; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #94a3b8; }
    .info-value { color: #e2e8f0; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    thead th { background: #1a1a35; padding: 10px 12px; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
    thead th:last-child { text-align: right; }
    .total-row td { padding: 12px; font-weight: 700; font-size: 15px; color: #ec4899; border-top: 2px solid #2a2a4a; }
    .status-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; background: rgba(124,58,237,0.2); color: #a78bfa; border: 1px solid #7c3aed; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-top: 8px; }
    .footer { background: #0d0d1a; padding: 20px 32px; text-align: center; font-size: 12px; color: #475569; border-top: 1px solid #1a1a35; }
    .divider { border: none; border-top: 1px solid #2a2a3e; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🛍️ Order Confirmed!</h1>
      <p>Thank you for your purchase. Here's your order summary.</p>
    </div>

    <div class="body">

      <!-- Order Meta -->
      <div class="section-title">Order Details</div>
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Order ID</span>
          <span class="info-value">#${order._id}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value"><span class="status-badge">${order.status || 'Pending'}</span></span>
        </div>
        <div class="info-row">
          <span class="info-label">Expected Delivery</span>
          <span class="info-value" style="color:#10b981;">${deliveryDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Method</span>
          <span class="info-value">${order.paymentMethod}</span>
        </div>
      </div>

      <!-- Items -->
      <div class="section-title">Items Ordered</div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr class="total-row">
            <td colspan="2">Total</td>
            <td style="text-align:right;">₹${Number(order.totalPrice).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Shipping -->
      <div class="section-title">Shipping Address</div>
      <div class="info-box">
        <p style="font-size:14px; line-height:1.6;">${shippingText}</p>
      </div>

      <hr class="divider" />

      <!-- Change Payment CTA -->
      <div style="text-align:center; padding: 8px 0 4px;">
        <p style="font-size:13px; color:#94a3b8; margin-bottom:16px;">
          Need to change your payment method? You can do so within <strong style="color:#e2e8f0;">15 minutes</strong> of placing the order.
        </p>
        <a href="${changePaymentLink}" class="btn">Change Payment Method</a>
      </div>

    </div>

    <div class="footer">
      © ${new Date().getFullYear()} NeonShop Inc. &nbsp;|&nbsp; This is an automated email — do not reply.
    </div>
  </div>
</body>
</html>`;
};

// ─────────────────────────────────────────────
// Main export: send order confirmation email
// ─────────────────────────────────────────────
const sendOrderConfirmationEmail = async (email, order) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email not sent: EMAIL_USER or EMAIL_PASS not configured in .env');
      return;
    }

    const paymentChangeToken = generatePaymentChangeToken(
      order._id.toString(),
      order.user.toString()
    );

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"NeonShop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Order Confirmed — #${order._id}`,
      html: buildOrderEmailHTML(order, paymentChangeToken),
    });

    console.log(`📧 Order confirmation email sent to ${email}`);
  } catch (err) {
    // ✅ Email failure must NEVER crash the order flow
    console.error('❌ Email send error:', err.message);
  }
};

module.exports = { sendOrderConfirmationEmail };
