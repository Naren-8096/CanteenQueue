const express = require('express');
const router = express.Router();
const { createOrder, getOrderStatus, verifyOTP, updateOrderStatus, batchUpdateStatus, getMyOrders, getAllOrders, getCompletedOrders, confirmPickup, submitFeedback } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/completed', protect, adminOnly, getCompletedOrders);
router.get('/status/:id', protect, getOrderStatus);
router.put('/batch-status', protect, adminOnly, batchUpdateStatus);
router.post('/verify-otp', protect, adminOnly, verifyOTP);
router.post('/confirm-pickup', protect, confirmPickup);
router.post('/feedback/:id', protect, submitFeedback);
router.put('/status/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
