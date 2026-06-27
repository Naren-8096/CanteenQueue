const crypto = require('crypto');
const Order = require('../models/Order');
const QueueRecord = require('../models/QueueRecord');
const MenuItem = require('../models/MenuItem');

const isMock = process.env.PAYMENT_MODE === 'mock';

// Only load Razorpay if not in mock mode
const razorpay = isMock ? null : (() => {
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
})();

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const createPendingOrderFromItems = async (userId, items) => {
  if (!items || items.length === 0) {
    throw new Error('No items in order.');
  }

  let total_price = 0;
  const enrichedItems = [];

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.item_id);
    if (!menuItem || !menuItem.availability) {
      throw new Error(`${menuItem?.item_name || 'Item'} is not available.`);
    }

    const qty = item.quantity || 1;
    if (menuItem.stock !== null && menuItem.stock !== undefined && menuItem.stock < qty) {
      throw new Error(`${menuItem.item_name} only has ${menuItem.stock} left.`);
    }

    total_price += menuItem.price * qty;
    enrichedItems.push({ item_id: menuItem._id, item_name: menuItem.item_name, price: menuItem.price, quantity: qty });
  }

  const otp_code = generateOTP();
  return Order.create({
    user_id: userId,
    items: enrichedItems,
    total_price,
    otp_code,
    order_status: 'Ordered',
    payment_status: 'pending',
  });
};

// POST /api/payment/create-order
const createPaymentOrder = async (req, res, next) => {
  try {
    const { order_id, items } = req.body;
    let order;

    if (order_id) {
      order = await Order.findById(order_id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    } else if (items) {
      order = await createPendingOrderFromItems(req.user._id, items);
    } else {
      return res.status(400).json({ success: false, message: 'Order details are required.' });
    }

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
          otp_code: order.otp_code,
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
        otp_code: order.otp_code,
      },
    });
  } catch (err) { next(err); }
};

// POST /api/payment/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const markPaidAndQueue = async (order) => {
      if (order.payment_status === 'paid') return order;

      order.payment_status = 'paid';
      order.payment_id = razorpay_payment_id || `mock_pay_${Date.now()}`;
      if (order.order_status !== 'Delivered' && order.order_status !== 'Cancelled') {
        order.order_status = 'In Queue';
      }
      await order.save();

      if (order.order_status !== 'Delivered' && order.order_status !== 'Cancelled') {
        const existingQueue = await QueueRecord.findOne({ order_id: order._id });
        if (existingQueue) {
          existingQueue.status = 'waiting';
          await existingQueue.save();
        } else {
          const queuePosition = await QueueRecord.countDocuments({ status: { $in: ['waiting', 'preparing'] } }) + 1;
          const queueRecord = await QueueRecord.create({
            order_id: order._id,
            user_id: order.user_id,
            queue_position: queuePosition,
            status: 'waiting',
          });
          order.queue_position = queueRecord.queue_position;
          await order.save();
        }
      }

      return order;
    };

    // --- MOCK MODE: skip signature check ---
    if (isMock) {
      const order = await Order.findById(order_id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
      const updatedOrder = await markPaidAndQueue(order);
      return res.json({
        success: true,
        message: 'Dummy payment successful!',
        data: { order_id: updatedOrder._id, token_number: updatedOrder.token_number, payment_status: updatedOrder.payment_status, order_status: updatedOrder.order_status },
      });
    }

    // --- REAL RAZORPAY: verify HMAC signature ---
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expected = hmac.digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }
    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    const updatedOrder = await markPaidAndQueue(order);
    res.json({
      success: true,
      message: 'Payment verified successfully!',
      data: { order_id: updatedOrder._id, token_number: updatedOrder.token_number, payment_status: updatedOrder.payment_status, order_status: updatedOrder.order_status },
    });
  } catch (err) { next(err); }
};

module.exports = { createPaymentOrder, verifyPayment };
