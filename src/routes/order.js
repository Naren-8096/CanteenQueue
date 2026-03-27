const express = require('express');
const router = express.Router();
const { createOrder, getOrderStatus, verifyOTP, updateOrderStatus, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect, staffOnly } = require('../middleware/auth');

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, staffOnly, getAllOrders);
router.get('/status/:id', protect, getOrderStatus);
router.post('/verify-otp', protect, staffOnly, verifyOTP);
router.put('/status/:id', protect, staffOnly, updateOrderStatus);

module.exports = router;
