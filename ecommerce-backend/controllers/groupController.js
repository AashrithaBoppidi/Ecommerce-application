const GroupCart = require('../models/groupModel');
const User = require('../models/userModel');

const joinGroupCart = async (req, res) => {
  try {
    const { cartName } = req.body; // cartName can be a shareId (USR-XXXXXX) or plain group name

    let cart = null;

    // ── Try: join via another user's shareId ──────────────────
    // shareId format: USR-XXXXXX (6 chars after dash)
    const shareIdPattern = /^USR-[A-Z0-9]{6}$/;
    if (shareIdPattern.test(cartName)) {
      const targetUser = await User.findOne({ shareId: cartName });
      if (targetUser && targetUser.groupCartId) {
        // Join that user's existing group cart
        cart = await GroupCart.findById(targetUser.groupCartId);
      } else if (targetUser) {
        // Target user exists but has no group cart yet → create one
        cart = new GroupCart({ name: `${targetUser.name}'s Group`, users: [targetUser._id] });
        await cart.save();
        targetUser.groupCartId = cart._id;
        await targetUser.save();
      } else {
        return res.status(404).json({ message: `No user found with Share ID: ${cartName}` });
      }
    } else {
      // ── Fallback: join/create by cart name ───────────────────
      cart = await GroupCart.findOne({ name: cartName });
      if (!cart) {
        cart = new GroupCart({ name: cartName, users: [] });
      }
    }

    // Prevent re-joining
    const alreadyMember = cart.users.some(u => u.toString() === req.user._id.toString());
    if (!alreadyMember) {
      if (cart.users.length >= 4) {
        return res.status(400).json({ message: 'Group cart is full (max 4 users)' });
      }
      cart.users.push(req.user._id);
    }

    await cart.save();

    // Link cart back to this user
    const currentUser = await User.findById(req.user._id);
    currentUser.groupCartId = cart._id;
    await currentUser.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToGroupCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.groupCartId) {
      return res.status(400).json({ message: 'You are not in a group cart. Join one first.' });
    }

    const { productId, quantity } = req.body;
    const cart = await GroupCart.findById(user.groupCartId);
    if (!cart) return res.status(404).json({ message: 'Group cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity) || 1;
    } else {
      cart.items.push({ product: productId, addedBy: req.user._id, quantity: Number(quantity) || 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroupCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.groupCartId) {
      return res.status(400).json({ message: 'You are not in a group cart' });
    }

    const cart = await GroupCart.findById(user.groupCartId)
      .populate('users', 'name email shareId')
      .populate('items.product', 'name price image brand')
      .populate('items.addedBy', 'name');

    if (!cart) {
      // Stale reference — clear it
      user.groupCartId = null;
      await user.save();
      return res.status(400).json({ message: 'Group cart not found' });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { joinGroupCart, addToGroupCart, getGroupCart };