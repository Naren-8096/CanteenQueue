const Order = require('../models/Order');
const QueueRecord = require('../models/QueueRecord');
const MenuItem = require('../models/MenuItem');
const crypto = require('crypto');

// Generate 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// POST /api/order/create
const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    let total_price = 0;
    const enrichedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.item_id);
      if (!menuItem || !menuItem.availability) {
        return res.status(400).json({ success: false, message: `${menuItem?.item_name || 'Item'} is not available.` });
      }
      const qty = item.quantity || 1;
      if (menuItem.stock !== null && menuItem.stock !== undefined && menuItem.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.item_name} only has ${menuItem.stock} left.`,
        });
      }
      total_price += menuItem.price * qty;
      enrichedItems.push({ item_id: menuItem._id, item_name: menuItem.item_name, price: menuItem.price, quantity: qty });
    }

    for (const item of enrichedItems) {
      if (item.quantity > 0) {
        const menuItem = await MenuItem.findById(item.item_id);
        if (menuItem.stock !== null && menuItem.stock !== undefined) {
          const nextStock = Math.max(0, menuItem.stock - item.quantity);
          await MenuItem.findByIdAndUpdate(item.item_id, {
            stock: nextStock,
            availability: nextStock > 0,
          });
        }
      }
    }

    const otp_code = generateOTP();
    const order = await Order.create({
      user_id: req.user._id,
      items: enrichedItems,
      total_price,
      otp_code,
    });

    res.status(201).json({
      success: true,
      message: 'Order created! Complete payment to confirm.',
      data: {
        order_id: order._id,
        token_number: order.token_number,
        otp_code: otp_code,
        total_price: order.total_price,
        items: order.items,
        order_status: order.order_status,
      },
    });
  } catch (err) { next(err); }
};

// GET /api/order/status/:id
const getOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user_id', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user_id._id.toString() !== req.user._id.toString() && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const queueRecord = await QueueRecord.findOne({ order_id: order._id });
    res.json({
      success: true,
      data: {
        order_id: order._id,
        token_number: order.token_number,
        items: order.items,
        total_price: order.total_price,
        order_status: order.order_status,
        otp_verified: order.otp_verified,
        queue_position: queueRecord ? queueRecord.queue_position : null,
        payment_status: order.payment_status,
        createdAt: order.createdAt,
      },
    });
  } catch (err) { next(err); }
};

// POST /api/order/verify-otp  (staff)
const verifyOTP = async (req, res, next) => {
  try {
    const { order_id, otp } = req.body;
    // Accept either a MongoDB _id or a numeric token_number
    const isTokenNumber = /^\d+$/.test(String(order_id));
    const order = isTokenNumber
      ? await Order.findOne({ token_number: Number(order_id) }).select('+otp_code')
      : await Order.findById(order_id).select('+otp_code');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.otp_verified) return res.status(400).json({ success: false, message: 'OTP already verified.' });
    if (order.otp_code !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });

    // Count already verified orders for queue position (FIFO)
    const verifiedCount = await QueueRecord.countDocuments({ status: { $in: ['waiting', 'preparing'] } });
    const queuePosition = verifiedCount + 1;

    await QueueRecord.create({ order_id: order._id, user_id: order.user_id, queue_position: queuePosition });
    order.otp_verified = true;
    order.queue_position = queuePosition;
    order.order_status = 'In Queue';
    await order.save();

    res.json({
      success: true,
      message: 'OTP verified! Order added to queue.',
      data: { order_id: order._id, token_number: order.token_number, queue_position: queuePosition },
    });
  } catch (err) { next(err); }
};

// PUT /api/order/status/:id  (staff)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Ordered', 'OTP Verified', 'In Queue', 'Preparing', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });

    const order = await Order.findByIdAndUpdate(req.params.id, { order_status: status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Update queue record status
    if (status === 'Preparing') await QueueRecord.findOneAndUpdate({ order_id: order._id }, { status: 'preparing' });
    else if (status === 'Delivered') await QueueRecord.findOneAndUpdate({ order_id: order._id }, { status: 'done' });

    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

// GET /api/order/my-orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

// GET /api/order/all  (staff)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ order_status: { $nin: ['Delivered', 'Cancelled'] } })
      .populate('user_id', 'name email')
      .sort({ createdAt: 1 });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

module.exports = { createOrder, getOrderStatus, verifyOTP, updateOrderStatus, getMyOrders, getAllOrders };
