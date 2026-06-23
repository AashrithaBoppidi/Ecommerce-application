const Order = require('../models/orderModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// ─────────────────────────────────────────────
// POST /api/orders — Place a new order
// ─────────────────────────────────────────────
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isScheduled,
      scheduledFor,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // ✅ Fallback deliveryDate (model default covers this, but belt-and-suspenders)
    const deliveryDate =
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: isScheduled ? 'Scheduled' : 'Pending',
      scheduledFor: isScheduled ? new Date(scheduledFor) : null,
      deliveryDate, // ✅ always set explicitly
    });

    const createdOrder = await order.save();

    // ─────────────────────────────────────
    // Feature 3: Send confirmation email
    // ─────────────────────────────────────
    try {
      const user = await User.findById(req.user._id).select('email');
      if (user && user.email) {
        await sendOrderConfirmationEmail(user.email, createdOrder);
      }
    } catch (emailErr) {
      // ✅ Email failure never breaks order creation
      console.error('Email send failed (non-fatal):', emailErr.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/orders/:id
// ─────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/orders/:id/address
// ─────────────────────────────────────────────
const updateOrderAddress = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (order.status !== 'Pending' && order.status !== 'Scheduled') {
      return res.status(400).json({ message: 'Cannot change address after order is processed' });
    }

    if (req.body.state && order.shippingAddress.state.toLowerCase() !== req.body.state.toLowerCase()) {
      return res.status(400).json({ message: 'Cannot change to a different state' });
    }

    order.shippingAddress = { ...order.shippingAddress.toObject(), ...req.body };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/orders/:id/payment
// ─────────────────────────────────────────────
const updateOrderPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({ message: 'Cannot change payment method after dispatch' });
    }

    order.paymentMethod = req.body.paymentMethod || order.paymentMethod;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/orders/myorders
// ─────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/orders/all — ADMIN only
// ─────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// Feature 4: GET /api/orders/change-payment
// Validate JWT token → redirect to frontend page
// ─────────────────────────────────────────────
const changePaymentViaEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('Missing token. Please use the link from your email.');
    }

    // Validate token (will throw if expired or invalid)
    jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');

    // Redirect to frontend change-payment page with token preserved
    return res.redirect(`http://localhost:3000/change-payment?token=${token}`);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).send(
        '<h2 style="font-family:sans-serif;text-align:center;margin-top:4rem;">⏰ Link Expired</h2><p style="text-align:center;">This payment change link has expired (valid for 15 minutes). Please contact support.</p>'
      );
    }
    return res.status(400).send('Invalid token. This link may have been tampered with.');
  }
};

// ─────────────────────────────────────────────
// Feature 4: POST /api/orders/change-payment
// Process the payment method update from email link
// ─────────────────────────────────────────────
const processChangePaymentViaEmail = async (req, res) => {
  try {
    const { token, paymentMethod } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // ✅ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Payment change link has expired. Links are valid for 15 minutes only.' });
      }
      return res.status(401).json({ message: 'Invalid or tampered token' });
    }

    const { orderId, userId } = decoded;

    // ✅ Fetch order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ Validate ownership
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: order does not belong to this user' });
    }

    // ✅ Status check — cannot change after dispatch
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({
        message: `Cannot change payment method. Order is already ${order.status}.`,
      });
    }

    // ✅ Update
    order.paymentMethod = paymentMethod;
    const updatedOrder = await order.save();

    res.json({
      message: 'Payment method updated successfully',
      order: {
        _id: updatedOrder._id,
        paymentMethod: updatedOrder.paymentMethod,
        status: updatedOrder.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderAddress,
  updateOrderPayment,
  getMyOrders,
  getAllOrders,
  changePaymentViaEmail,
  processChangePaymentViaEmail,
};