const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  // Primary image URL (could be an upload path or external URL)
  image: { type: String, required: true },
  // Additional product images
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, // percentage off
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);