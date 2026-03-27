const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Dinner'],
    default: 'Lunch',
  },
  availability: {
    type: Boolean,
    default: true,
  },
  image_url: {
    type: String,
    default: '',
  },
  prep_time: {
    type: Number,   // in minutes
    default: 10,
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
