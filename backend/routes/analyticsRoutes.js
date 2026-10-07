const express = require('express');
const { getPlatformAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'operations'), getPlatformAnalytics);

module.exports = router;