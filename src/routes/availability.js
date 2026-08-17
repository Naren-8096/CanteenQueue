const express = require('express');
const router = express.Router();
const { updateAvailability } = require('../controllers/availabilityController');
const { protect, adminOnly } = require('../middleware/auth');

router.put('/update', protect, adminOnly, updateAvailability);

module.exports = router;
