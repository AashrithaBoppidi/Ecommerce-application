const express = require('express');
const { applyCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public apply coupon (auth user only)
router.post('/apply', protect, applyCoupon);

module.exports = router;
