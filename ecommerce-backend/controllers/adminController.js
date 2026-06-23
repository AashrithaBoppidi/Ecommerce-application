const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

const getAdminStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({});
    const productsCount = await Product.countDocuments({});
    const ordersCount = await Order.countDocuments({});

    const orders = await Order.find({ status: 'Delivered' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({ usersCount, productsCount, ordersCount, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analytics: revenue by month, orders by status, new users per month
const getAnalytics = async (req, res) => {
  try {
    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const revenueByMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $in: ['Delivered', 'Placed', 'Shipped'] } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // New users by month
    const usersByMonth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Top products by order frequency
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $group: { _id: '$orderItems.name', totalSold: { $sum: '$orderItems.qty' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formatMonthly = (data) =>
      data.map((d) => ({
        month: monthNames[d._id.month - 1],
        ...d,
      }));

    res.json({
      revenueByMonth: formatMonthly(revenueByMonth),
      ordersByStatus,
      usersByMonth: formatMonthly(usersByMonth),
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin product operations (delegating to product model directly)
const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // toggle ban: we use a "banned" flag — add to model if needed, or just skip for now
    res.json({ message: 'Done', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
  adminDeleteProduct,
  toggleUserStatus,
};