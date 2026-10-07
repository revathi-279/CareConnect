const express = require('express');
const { createReview, getProviderReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('customer'), createReview);
router.get('/:providerId', getProviderReviews); // Public: Anyone can read reviews

module.exports = router;