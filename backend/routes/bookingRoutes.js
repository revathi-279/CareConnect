const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, authorize('customer'), getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, authorize('customer'), cancelBooking);

module.exports = router;