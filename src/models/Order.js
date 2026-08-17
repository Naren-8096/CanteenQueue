const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  item_name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total_price: { type: Number, required: true },
  token_number: { type: Number },
  otp_code: { type: String, select: false },
  otp_verified: { type: Boolean, default: false },
  queue_position: { type: Number, default: null },
  order_status: {
    type: String,
    enum: ['Ordered', 'In Queue', 'Preparing', 'Ready for Pickup', 'OTP Verified', 'Delivered', 'Cancelled'],
    default: 'In Queue',
  },
  payment_id: { type: String, default: null },
  payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpay_order_id: { type: String, default: null },
  feedback_rating: { type: Number, min: 1, max: 5, default: null },
  feedback_text: { type: String, default: '' },
  feedback_submitted: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-assign token number before saving
orderSchema.pre('save', async function (next) {
  if (!this.token_number) {
    const lastOrder = await mongoose.model('Order').findOne().sort({ token_number: -1 });
    this.token_number = lastOrder && lastOrder.token_number ? lastOrder.token_number + 1 : 1001;
  }
  next();
});

orderSchema.index({ order_status: 1, createdAt: -1 });
orderSchema.index({ user_id: 1, createdAt: -1 });
orderSchema.index({ token_number: 1 });

module.exports = mongoose.model('Order', orderSchema);
