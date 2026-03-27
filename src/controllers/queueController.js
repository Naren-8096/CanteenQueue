const QueueRecord = require('../models/QueueRecord');

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

module.exports = { getQueue, getQueuePosition };
