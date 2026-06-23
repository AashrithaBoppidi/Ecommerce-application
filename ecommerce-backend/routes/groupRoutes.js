const express = require('express');
const { joinGroupCart, addToGroupCart, getGroupCart } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getGroupCart);
router.route('/join').post(protect, joinGroupCart);
router.route('/add').post(protect, addToGroupCart);

module.exports = router;