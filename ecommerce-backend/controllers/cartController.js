const cartModel = require('../models/cartModel');

exports.addToCart = (req, res) => {
  const user_id = req.user._id;
  const { product_id } = req.body;

  cartModel.addItem(user_id, product_id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Added to cart' });
  });
};

exports.getCart = (req, res) => {
  const user_id = req.user._id;

  cartModel.getCart(user_id, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};