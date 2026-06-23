const express = require('express');
const {
  addOrderItems,
  getOrderById,
  updateOrderAddress,
  updateOrderPayment,
  getMyOrders,
  getAllOrders,
  changePaymentViaEmail,
  processChangePaymentViaEmail
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ IMPORTANT: Static routes MUST come before dynamic /:id routes
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

// ✅ FIXED: /all before /:id to prevent shadowing
router.get('/all', protect, admin, getAllOrders);

// ✅ Feature 4: Change payment via email link (no auth middleware — uses JWT in query)
router.get('/change-payment', changePaymentViaEmail);
router.post('/change-payment', processChangePaymentViaEmail);

// Dynamic routes last
router.route('/:id').get(protect, getOrderById);
router.route('/:id/address').put(protect, updateOrderAddress);
router.route('/:id/payment').put(protect, updateOrderPayment);

module.exports = router;