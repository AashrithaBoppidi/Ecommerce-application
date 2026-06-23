const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
  adminDeleteProduct,
} = require('../controllers/adminController');
const {
  createProduct,
  updateProduct,
} = require('../controllers/productController');
const { getCoupons, createCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Stats & Analytics
router.get('/stats', protect, admin, getAdminStats);
router.get('/analytics', protect, admin, getAnalytics);

// Users
router.get('/users', protect, admin, getAllUsers);

// Orders
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

// Products (CRUD from admin panel)
router.post('/products', protect, admin, upload.single('image'), createProduct);
router.put('/products/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/products/:id', protect, admin, adminDeleteProduct);

// Coupons
router.get('/coupons', protect, admin, getCoupons);
router.post('/coupons', protect, admin, createCoupon);
router.delete('/coupons/:id', protect, admin, deleteCoupon);

module.exports = router;