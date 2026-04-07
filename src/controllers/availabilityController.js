const MenuItem = require('../models/MenuItem');

// PUT /api/availability/update
const updateAvailability = async (req, res, next) => {
  try {
    const { item_id, availability, stock } = req.body;
    if (!item_id) {
      return res.status(400).json({ success: false, message: 'item_id is required.' });
    }

    const update = {};
    if (typeof availability === 'boolean') update.availability = availability;
    if (stock !== undefined) {
      if (stock === null || stock === '') {
        update.stock = null;
      } else {
        const stockCount = Number(stock);
        if (isNaN(stockCount) || stockCount < 0) {
          return res.status(400).json({ success: false, message: 'Stock must be a non-negative number.' });
        }
        update.stock = stockCount;
        if (stockCount === 0) update.availability = false;
        else if (update.availability === undefined) update.availability = true;
      }
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' });
    }

    const item = await MenuItem.findByIdAndUpdate(item_id, update, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, message: `${item.item_name} is now ${item.availability ? 'available' : 'unavailable'}.`, data: item });
  } catch (err) { next(err); }
};

module.exports = { updateAvailability };
