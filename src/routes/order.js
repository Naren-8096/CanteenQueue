const express = require('express');
const router = express.Router();
const { createOrder, getOrderStatus, verifyOTP, updateOrderStatus, batchUpdateStatus, getMyOrders, getAllOrders, getCompletedOrders, confirmPickup, submitFeedback } = require('../controllers/orderController');
const { protect, staffOnly } = require('../middleware/auth');

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, staffOnly, getAllOrders);
router.get('/completed', protect, staffOnly, getCompletedOrders);
router.get('/status/:id', protect, getOrderStatus);
router.put('/batch-status', protect, staffOnly, batchUpdateStatus);
router.post('/verify-otp', protect, staffOnly, verifyOTP);
router.post('/confirm-pickup', protect, confirmPickup);
router.post('/feedback/:id', protect, submitFeedback);
router.put('/status/:id', protect, staffOnly, updateOrderStatus);

module.exports = router;
