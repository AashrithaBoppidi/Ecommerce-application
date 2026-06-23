// const Order = require('../models/orderModel');

// const addOrderItems = async (req, res) => {
//   try {
//     const { orderItems, shippingAddress, paymentMethod, totalPrice, isScheduled, scheduledFor } = req.body;

//     if (orderItems && orderItems.length === 0) {
//       return res.status(400).json({ message: 'No order items' });
//     }

//     const order = new Order({
//       orderItems,
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       status: isScheduled ? 'Scheduled' : 'Pending',
//       scheduledFor: isScheduled ? new Date(scheduledFor) : null,
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate('user', 'name email');
//     if (order) {
//       res.json(order);
//     } else {
//       res.status(404).json({ message: 'Order not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateOrderAddress = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (order.user.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     if (order.status !== 'Pending' && order.status !== 'Scheduled') {
//       return res.status(400).json({ message: 'Cannot change address after order is processed' });
//     }

//     // Validate same state logic (simple check)
//     if (req.body.state && order.shippingAddress.state.toLowerCase() !== req.body.state.toLowerCase()) {
//       return res.status(400).json({ message: 'Cannot change to a different state' });
//     }

//     order.shippingAddress = { ...order.shippingAddress, ...req.body };
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateOrderPayment = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (order.user.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     if (order.status === 'Shipped' || order.status === 'Delivered') {
//       return res.status(400).json({ message: 'Cannot change payment method after dispatch' });
//     }

//     order.paymentMethod = req.body.paymentMethod || order.paymentMethod;
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { addOrderItems, getOrderById, updateOrderAddress, updateOrderPayment, getMyOrders };


import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');

  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;