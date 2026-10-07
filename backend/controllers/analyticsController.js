const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const ServiceRequest = require('../models/ServiceRequest');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const Dispute = require('../models/Dispute');

// @desc    Get overall platform analytics
// @route   GET /api/analytics
// @access  Private (Admin/Operations only)
const getPlatformAnalytics = async (req, res, next) => {
  try {
    // Run all count queries in parallel using Promise.all for speed
    const [
      totalUsers,
      totalCustomers,
      totalProviders,
      verifiedProviders,
      totalRequests,
      pendingRequests,
      totalBookings,
      activeJobs,
      completedBookings,
      totalDisputes,
      openDisputes
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'provider' }),
      ProviderProfile.countDocuments({ verificationStatus: 'verified' }),
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: 'pending' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['scheduled', 'on_the_way', 'arrived', 'in_progress'] } }),
      Booking.countDocuments({ status: 'completed' }),
      Dispute.countDocuments(),
      Dispute.countDocuments({ status: 'open' })
    ]);

    // Aggregate total revenue from PAID invoices
    const revenueAggregation = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          customers: totalCustomers,
          providers: totalProviders,
          verifiedProviders
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests
        },
        bookings: {
          total: totalBookings,
          active: activeJobs,
          completed: completedBookings
        },
        disputes: {
          total: totalDisputes,
          open: openDisputes
        },
        financials: {
          totalRevenuePaid: totalRevenue
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlatformAnalytics };