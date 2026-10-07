const express = require('express');
const { createBooking, getBookings, reportDispute, addChatMessage, resolveDispute} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('customer'), createBooking);
router.get('/', protect, getBookings); // Handles logic for Customer, Provider, and Admin internally
router.post('/:id/dispute', protect, authorize('customer'), reportDispute);
router.post('/:id/chat', protect, addChatMessage);
router.patch('/:id/resolve', protect, authorize('admin'), resolveDispute);

module.exports = router;