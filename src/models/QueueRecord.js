const mongoose = require('mongoose');

const queueRecordSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  queue_position: { type: Number, required: true },
  status: {
    type: String,
    enum: ['waiting', 'preparing', 'done'],
    default: 'waiting',
  },
}, { timestamps: true });

module.exports = mongoose.model('QueueRecord', queueRecordSchema);
