const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/authMiddleware');
const advancedResults = require('../middleware/advancedResults');
const AuditLog = require('../models/AuditLog');

const router = express.Router();

// Only Admins and Ops can view audit logs. 
// We use advancedResults and populate the 'actor' so we can see their name.
router.get('/', 
  protect, 
  authorize('admin', 'operations'), 
  advancedResults(AuditLog, 'actor'), 
  getAuditLogs
);

module.exports = router;