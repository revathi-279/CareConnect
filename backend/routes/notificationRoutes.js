const express = require('express');
const { 
  getMyNotifications, 
  markAsRead, 
  createSystemNotification 
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// User routes
router.get('/', protect, getMyNotifications);
router.patch('/:id/read', protect, markAsRead);

// Admin tool to broadcast/send manual notifications
router.post('/broadcast', protect, authorize('admin'), createSystemNotification);

module.exports = router;    