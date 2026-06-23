const express = require('express');
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:productId').get(getReviews).post(protect, createReview);
router.route('/:reviewId/delete').delete(protect, admin, deleteReview);

module.exports = router;
