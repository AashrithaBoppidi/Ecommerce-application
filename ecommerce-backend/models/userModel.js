const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  // Unique short ID used to identify user in group carts
  shareId: { type: String, unique: true, sparse: true },
  // Wishlist of product IDs
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  // Phone & address for profile
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  groupCartId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupCart', default: null }
}, { timestamps: true });

// Generate shareId before saving if not present
userSchema.pre('save', async function () {
  // Generate shareId for new users
  if (!this.shareId) {
    const short = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
    this.shareId = `USR-${short}`;
  }

  // Hash password if modified
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);