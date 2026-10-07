const express = require('express');
const { 
  addAvailability, 
  getMyAvailability, 
  getProviderAvailability, 
  deleteAvailability 
} = require('../controllers/availabilityController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Provider Routes
router.post('/', protect, authorize('provider'), addAvailability);
router.get('/me', protect, authorize('provider'), getMyAvailability);
router.delete('/:id', protect, authorize('provider'), deleteAvailability);

// Public / Customer Routes
router.get('/:providerId', getProviderAvailability);

module.exports = router;