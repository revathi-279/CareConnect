const express = require('express');
const { getServices, createService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const advancedResults = require('../middleware/advancedResults'); // ADD THIS
const Service = require('../models/Service'); // ADD THIS

const router = express.Router();

// Inject advancedResults middleware. 
// Base match: { isActive: true } ensures customers only see active services.
router.get('/', advancedResults(Service, 'category', { isActive: true }), getServices);

router.post('/', protect, authorize('admin', 'operations'), createService);

module.exports = router;