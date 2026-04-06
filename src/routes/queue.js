const express = require('express');
const router = express.Router();
const { getQueue, getQueuePosition, getItemQueuePositions, getItemCounts } = require('../controllers/queueController');
const { protect, staffOnly } = require('../middleware/auth');

router.get('/', protect, staffOnly, getQueue);
router.get('/item-counts', protect, getItemCounts);
router.get('/position/:orderId', protect, getQueuePosition);
router.get('/item-positions/:orderId', protect, getItemQueuePositions);

module.exports = router;
