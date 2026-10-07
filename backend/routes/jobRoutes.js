const express = require('express');
const { updateJobStatus } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Providers use this to progress the job
router.patch('/:id/status', protect, authorize('provider', 'admin'), updateJobStatus);

module.exports = router;