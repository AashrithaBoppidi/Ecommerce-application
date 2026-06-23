const mongoose = require('mongoose');

const groupCartSchema = new mongoose.Schema({
  name: { type: String, default: 'Group Cart' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Max 4 users logic enforced in controller
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.GroupCart || mongoose.model('GroupCart', groupCartSchema);