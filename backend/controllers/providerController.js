const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// @desc    Get all bookings assigned to the authenticated provider
// @route   GET /api/provider/bookings
// @access  Private (Provider)
const getProviderBookings = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found for this user'
      });
    }

    const bookings = await Booking.find({ provider: provider._id })
      .populate('service', 'name startingPrice duration image category')
      .populate('customer', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status by provider
// @route   PATCH /api/provider/bookings/:id/status
// @access  Private (Provider)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Confirmed', 'In Progress', 'Completed'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed transitions: ${allowedStatuses.join(', ')}`
      });
    }

    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.provider.toString() !== provider._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This job is not assigned to you'
      });
    }

    // Disallow transitions on dead-end states
    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of a cancelled booking'
      });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already marked as Completed'
      });
    }

    // Enforce sequential workflow: Pending -> Confirmed -> In Progress -> Completed
    if (status === 'In Progress' && booking.status === 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Job must be Confirmed before moving to In Progress'
      });
    }

    if (status === 'Completed' && booking.status !== 'In Progress') {
      return res.status(400).json({
        success: false,
        message: 'Job must be In Progress before it can be marked Completed'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProviderBookings, updateBookingStatus };