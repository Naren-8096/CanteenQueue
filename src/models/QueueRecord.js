const mongoose = require('mongoose');

const queueRecordSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  queue_position: { type: Number, required: true },
  status: {
    type: String,
    enum: ['waiting', 'preparing', 'ready', 'done', 'cancelled'],
    default: 'waiting',
  },
}, { timestamps: true });

queueRecordSchema.index({ status: 1, queue_position: 1 });

module.exports = mongoose.model('QueueRecord', queueRecordSchema);
