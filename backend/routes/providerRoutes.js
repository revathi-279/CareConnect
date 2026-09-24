const express = require('express');
const router = express.Router();
const { getProviderBookings, updateBookingStatus } = require('../controllers/providerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('provider'));

router.get('/bookings', getProviderBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

module.exports = router;