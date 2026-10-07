const express = require('express');
const { 
  requestAdditionalWork, 
  getAdditionalWorkForBooking, 
  respondToAdditionalWork 
} = require('../controllers/additionalWorkController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('provider'), requestAdditionalWork);
router.get('/:bookingId', protect, getAdditionalWorkForBooking);
router.patch('/:id/respond', protect, authorize('customer'), respondToAdditionalWork);

module.exports = router;