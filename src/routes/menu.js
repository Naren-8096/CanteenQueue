const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, staffOnly } = require('../middleware/auth');

router.get('/', getMenu);
router.post('/', protect, staffOnly, addMenuItem);
router.put('/:id', protect, staffOnly, updateMenuItem);
router.delete('/:id', protect, staffOnly, deleteMenuItem);

module.exports = router;
