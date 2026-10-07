const express = require('express');
const { 
  upsertMyProfile, 
  getMyProfile, 
  getProviders, 
  updateVerificationStatus 
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const advancedResults = require('../middleware/advancedResults'); // ADD THIS
const ProviderProfile = require('../models/ProviderProfile'); // ADD THIS

const router = express.Router();

// Inject middleware. Base match ensures we ONLY show verified providers!
router.get('/', advancedResults(ProviderProfile, ['user', 'categories'], { verificationStatus: 'verified' }), getProviders);

// Provider specific routes
router.post('/profile', protect, authorize('provider'), upsertMyProfile);
router.get('/profile/me', protect, authorize('provider'), getMyProfile);

// Admin/Ops specific routes
router.patch('/:id/verify', protect, authorize('admin', 'operations'), updateVerificationStatus);

module.exports = router;