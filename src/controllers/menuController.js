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
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

// PUT /api/menu/:id  (staff)
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };
