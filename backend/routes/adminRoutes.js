const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/admin/analytics
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue from completed jobs
    const completedBookings = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce((sum, b) => {
      return sum + (b.basePrice || 0) + (b.additionalWorkAmount || 0);
    }, 0);

    res.status(200).json({ success: true, data: { totalUsers, totalBookings, totalRevenue } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load analytics' });
  }
});

// GET /api/admin/audit
router.get('/audit', protect, authorize('admin'), async (req, res) => {
  // Providing a mocked response here to ensure the UI renders without crashing
  res.status(200).json({
    success: true,
    data: [
      { _id: '1', action: 'Platform Infrastructure Created', entityType: 'System', createdAt: new Date() },
      { _id: '2', action: 'Admin Access Granted', entityType: 'Auth', createdAt: new Date() }
    ]
  });
});

module.exports = router;