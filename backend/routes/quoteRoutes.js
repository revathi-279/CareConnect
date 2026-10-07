const express = require('express');
const { 
  createQuote, 
  getQuotes, 
  updateQuoteStatus 
} = require('../controllers/quoteController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('provider'), createQuote);
router.get('/', protect, getQuotes); // Logic inside controller handles role-based filtering
router.patch('/:id/status', protect, authorize('customer'), updateQuoteStatus);

module.exports = router;