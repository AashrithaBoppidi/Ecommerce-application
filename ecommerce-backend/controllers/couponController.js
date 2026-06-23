const Coupon = require('../models/couponModel');

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expiryDate, maxUses } = req.body;
    const exists = await Coupon.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({ code, discountPercent, expiryDate, maxUses: maxUses || 100 });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: validate and return discount
const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (new Date() > coupon.expiryDate) return res.status(400).json({ message: 'Coupon has expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' });

    res.json({ discountPercent: coupon.discountPercent, code: coupon.code, _id: coupon._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCoupons, createCoupon, deleteCoupon, applyCoupon };
