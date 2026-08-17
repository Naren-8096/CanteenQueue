const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, addReviewToItem, getItemReviews } = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getMenu);
router.get('/:id/reviews', getItemReviews);
router.post('/:id/reviews', protect, addReviewToItem);
router.post('/', protect, adminOnly, addMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
