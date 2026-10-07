const express = require('express');
const { 
  createRequest, 
  getMyRequests, 
  getAllRequests,
  classifyServiceRequest,
  getMatchingProviders // ADD THIS
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer routes
router.post('/', protect, authorize('customer'), createRequest);
router.get('/me', protect, authorize('customer'), getMyRequests);
router.get('/:id/matches', protect, getMatchingProviders); // ADD THIS (No strict role auth here, logic inside controller handles it)

// Admin/Ops routes
router.get('/', protect, authorize('admin', 'operations', 'provider'), getAllRequests);
router.patch('/:id/classify', protect, authorize('admin', 'operations'), classifyServiceRequest);

module.exports = router;