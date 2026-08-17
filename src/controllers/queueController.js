const QueueRecord = require('../models/QueueRecord');
const Order = require('../models/Order');

// GET /api/queue
const getQueue = async (req, res, next) => {
  try {
    const queue = await QueueRecord.find({ status: { $in: ['waiting', 'preparing'] } })
      .populate('order_id', 'token_number items total_price order_status user_id')
      .populate('user_id', 'name')
      .sort({ queue_position: 1 });
    res.json({ success: true, count: queue.length, data: queue });
  } catch (err) { next(err); }
};

// GET /api/queue/position/:orderId
const getQueuePosition = async (req, res, next) => {
  try {
    const record = await QueueRecord.findOne({ order_id: req.params.orderId });
    if (!record) return res.status(404).json({ success: false, message: 'Not in queue yet.' });
    const ahead = await QueueRecord.countDocuments({
      status: 'waiting',
      queue_position: { $lt: record.queue_position },
    });
    res.json({ success: true, data: { queue_position: record.queue_position, orders_ahead: ahead, status: record.status } });
  } catch (err) { next(err); }
};

// GET /api/queue/item-positions/:orderId  (student)
// Returns for each item in the order: how many people are ahead in the queue who ordered the same item
const getItemQueuePositions = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Ensure the order belongs to this student (or is staff)
    const myOrder = await Order.findById(orderId);
    if (!myOrder) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (myOrder.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Get my queue record
    const myRecord = await QueueRecord.findOne({ order_id: orderId });

    // Get all active queue records ahead of (or equal to) mine, populated with their order items
    const allActive = await QueueRecord.find({ status: { $in: ['waiting', 'preparing'] } })
      .populate('order_id', 'items token_number')
      .sort({ queue_position: 1 });

    const myQueuePos = myRecord ? myRecord.queue_position : null;

    // For each item in my order, count how many people AHEAD of me (lower queue_position) ordered the same item
    const itemPositions = myOrder.items.map(myItem => {
      let aheadCount = 0;
      for (const rec of allActive) {
        if (!rec.order_id) continue;
        // Only count orders strictly ahead of mine
        if (myQueuePos !== null && rec.queue_position >= myQueuePos) continue;
        const hasItem = rec.order_id.items && rec.order_id.items.some(
          i => i.item_id && i.item_id.toString() === myItem.item_id.toString()
        );
        if (hasItem) aheadCount++;
      }
      return {
        item_id: myItem.item_id,
        item_name: myItem.item_name,
        quantity: myItem.quantity,
        price: myItem.price,
        people_ahead: aheadCount,
      };
    });

    res.json({
      success: true,
      data: {
        order_id: myOrder._id,
        token_number: myOrder.token_number,
        order_status: myOrder.order_status,
        otp_verified: myOrder.otp_verified,
        queue_position: myQueuePos,
        in_queue: myRecord !== null,
        items: itemPositions,
      },
    });
  } catch (err) { next(err); }
};

// GET /api/queue/item-counts  (any authenticated user)
// Returns { item_id: totalQtyOrdered } for all items in active (waiting/preparing) queue orders
const getItemCounts = async (req, res, next) => {
  try {
    const allActive = await QueueRecord.find({ status: { $in: ['waiting', 'preparing'] } })
      .populate('order_id', 'items');

    const counts = {}; // item_id (string) -> total quantity ordered
    for (const rec of allActive) {
      if (!rec.order_id || !rec.order_id.items) continue;
      for (const item of rec.order_id.items) {
        const key = item.item_id ? item.item_id.toString() : null;
        if (!key) continue;
        counts[key] = (counts[key] || 0) + (item.quantity || 1);
      }
    }

    res.json({ success: true, data: counts });
  } catch (err) { next(err); }
};

module.exports = { getQueue, getQueuePosition, getItemQueuePositions, getItemCounts };
