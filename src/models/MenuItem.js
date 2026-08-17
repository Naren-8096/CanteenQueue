const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user_name: { type: String, default: 'Student' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

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
  stock: {
    type: Number,
    default: null,
    min: [0, 'Stock cannot be negative'],
  },
  image_url: {
    type: String,
    default: '',
  },
  prep_time: {
    type: Number,   // in minutes
    default: 10,
  },
  reviews: [reviewSchema],
  average_rating: {
    type: Number,
    default: 0,
  },
  num_reviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
