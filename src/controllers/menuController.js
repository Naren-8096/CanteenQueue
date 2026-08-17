const MenuItem = require('../models/MenuItem');

// GET /api/menu
const getMenu = async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, item_name: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) { next(err); }
};

// POST /api/menu  (staff)
const addMenuItem = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.stock !== undefined && payload.stock !== null) {
      payload.stock = Number(payload.stock);
      if (isNaN(payload.stock) || payload.stock < 0) payload.stock = 0;
      if (payload.stock === 0) payload.availability = false;
    }
    const item = await MenuItem.create(payload);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

// PUT /api/menu/:id  (staff)
const updateMenuItem = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.stock !== undefined && payload.stock !== null) {
      payload.stock = Number(payload.stock);
      if (isNaN(payload.stock) || payload.stock < 0) payload.stock = 0;
      if (payload.stock === 0) payload.availability = false;
      if (payload.stock > 0 && payload.availability === undefined) {
        payload.availability = true;
      }
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

// DELETE /api/menu/:id  (staff)
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, message: 'Menu item deleted.' });
  } catch (err) { next(err); }
};

// POST /api/menu/:id/reviews (authenticated customer)
const addReviewToItem = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });

    // Check if user already reviewed this item
    const existingIndex = item.reviews.findIndex(r => r.user_id.toString() === req.user._id.toString());
    const userName = req.user.name || 'Student';

    if (existingIndex !== -1) {
      item.reviews[existingIndex].rating = numRating;
      item.reviews[existingIndex].comment = comment || '';
      item.reviews[existingIndex].user_name = userName;
      item.reviews[existingIndex].createdAt = new Date();
    } else {
      item.reviews.push({
        user_id: req.user._id,
        user_name: userName,
        rating: numRating,
        comment: comment || '',
        createdAt: new Date(),
      });
    }

    // Recalculate average rating & count
    item.num_reviews = item.reviews.length;
    const sum = item.reviews.reduce((acc, r) => acc + r.rating, 0);
    item.average_rating = Math.round((sum / item.num_reviews) * 10) / 10;

    await item.save();

    res.json({
      success: true,
      message: 'Review submitted successfully!',
      data: {
        item_id: item._id,
        item_name: item.item_name,
        average_rating: item.average_rating,
        num_reviews: item.num_reviews,
        reviews: item.reviews,
      },
    });
  } catch (err) { next(err); }
};

// GET /api/menu/:id/reviews
const getItemReviews = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });

    const sortedReviews = (item.reviews || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      success: true,
      data: {
        item_id: item._id,
        item_name: item.item_name,
        average_rating: item.average_rating || 0,
        num_reviews: item.num_reviews || 0,
        reviews: sortedReviews,
      },
    });
  } catch (err) { next(err); }
};

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, addReviewToItem, getItemReviews };
