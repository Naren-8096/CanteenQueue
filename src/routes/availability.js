const express = require('express');
const router = express.Router();
const { updateAvailability } = require('../controllers/availabilityController');
const { protect, staffOnly } = require('../middleware/auth');

router.put('/update', protect, staffOnly, updateAvailability);

module.exports = router;
