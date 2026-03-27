const crypto = require('crypto');
const Order = require('../models/Order');

const isMock = process.env.PAYMENT_MODE === 'mock';

// Only load Razorpay if not in mock mode
const razorpay = isMock ? null : (() => {
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
})();

// POST /api/payment/create-order
const createPaymentOrder = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.payment_status === 'paid') return res.status(400).json({ success: false, message: 'Already paid.' });

    // --- MOCK MODE ---
    if (isMock) {
      const mockOrderId = `mock_order_${Date.now()}`;
      order.razorpay_order_id = mockOrderId;
      await order.save();
      return res.json({
        success: true,
        mock: true,
        data: {
          razorpay_order_id: mockOrderId,
          amount: Math.round(order.total_price * 100),
          currency: 'INR',
          key_id: 'mock',
          order_id: order._id,
          token_number: order.token_number,
        },
      });
    }

    // --- REAL RAZORPAY ---
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total_price * 100),
      currency: 'INR',
      receipt: `cq_${order._id}`,
      notes: { order_id: order._id.toString(), token: order.token_number.toString() },
    });
    order.razorpay_order_id = razorpayOrder.id;
    await order.save();
    res.json({
      success: true,
      data: {
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
        order_id: order._id,
        token_number: order.token_number,
      },
    });
  } catch (err) { next(err); }
};

// POST /api/payment/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    // --- MOCK MODE: skip signature check ---
    if (isMock) {
      const order = await Order.findByIdAndUpdate(
        order_id,
        { payment_status: 'paid', payment_id: razorpay_payment_id || `mock_pay_${Date.now()}` },
        { new: true }
      );
      if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
      return res.json({
        success: true,
        message: 'Dummy payment successful!',
        data: { order_id: order._id, token_number: order.token_number, payment_status: order.payment_status },
      });
    }

    // --- REAL RAZORPAY: verify HMAC signature ---
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expected = hmac.digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }
    const order = await Order.findByIdAndUpdate(
      order_id,
      { payment_status: 'paid', payment_id: razorpay_payment_id },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({
      success: true,
      message: 'Payment verified successfully!',
      data: { order_id: order._id, token_number: order.token_number, payment_status: order.payment_status },
    });
  } catch (err) { next(err); }
};

module.exports = { createPaymentOrder, verifyPayment };
