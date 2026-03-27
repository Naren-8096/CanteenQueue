const express = require('express');
const router = express.Router();
const { getQueue, getQueuePosition } = require('../controllers/queueController');
const { protect, staffOnly } = require('../middleware/auth');

router.get('/', protect, staffOnly, getQueue);
router.get('/position/:orderId', protect, getQueuePosition);

module.exports = router;
