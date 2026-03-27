const MenuItem = require('../models/MenuItem');

// PUT /api/availability/update
const updateAvailability = async (req, res, next) => {
  try {
    const { item_id, availability } = req.body;
    if (!item_id || typeof availability !== 'boolean') {
      return res.status(400).json({ success: false, message: 'item_id and availability (boolean) required.' });
    }
    const item = await MenuItem.findByIdAndUpdate(item_id, { availability }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, message: `${item.item_name} is now ${availability ? 'available' : 'unavailable'}.`, data: item });
  } catch (err) { next(err); }
};

module.exports = { updateAvailability };
