const express = require('express');
const { 
  createDispute, 
  getDisputes, 
  updateDispute 
} = require('../controllers/disputeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createDispute);
router.get('/', protect, getDisputes);

// Only platform staff can resolve a dispute
router.patch('/:id', protect, authorize('admin', 'operations', 'support'), updateDispute);

module.exports = router;