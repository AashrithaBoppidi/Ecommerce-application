// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   orderItems: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       name: { type: String, required: true },
//       quantity: { type: Number, required: true },
//       price: { type: Number, required: true },
//       image: { type: String, required: true }
//     }
//   ],
//   shippingAddress: {
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     country: { type: String, required: true },
//     state: { type: String, required: true }
//   },
//   paymentMethod: { type: String, required: true },
//   totalPrice: { type: Number, required: true },
//   isPaid: { type: Boolean, required: true, default: false },
//   paidAt: { type: Date },
//   status: { type: String, enum: ['Scheduled', 'Pending', 'Placed', 'Shipped', 'Delivered'], default: 'Pending' },
//   scheduledFor: { type: Date }, // For scheduled ordering
// }, { timestamps: true }
// const deliveryDate = new Date();
// deliveryDate.setDate(deliveryDate.getDate() + 10);

// );

// module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true }
    }
  ],

  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true }
  },

  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },

  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },

  status: {
    type: String,
    enum: ['Scheduled', 'Pending', 'Placed', 'Shipped', 'Delivered'],
    default: 'Pending'
  },

  scheduledFor: { type: Date },

  // ✅ DELIVERY DATE: always defaults to +10 days from creation
  deliveryDate: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setDate(d.getDate() + 10);
      return d;
    }
  }

}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);