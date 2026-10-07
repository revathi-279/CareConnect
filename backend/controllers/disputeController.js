const Dispute = require('../models/Dispute');
const Booking = require('../models/Booking');

// @desc    Raise a new dispute
// @route   POST /api/disputes
// @access  Private (Customer or Provider)
const createDispute = async (req, res, next) => {
  try {
    const { bookingId, reason, description } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Determine roles and authorization
    let againstUserId;
    if (booking.customer.toString() === req.user._id.toString()) {
      // Customer is raising dispute against Provider
      againstUserId = booking.provider;
    } else if (booking.provider.toString() === req.user._id.toString()) {
      // Provider is raising dispute against Customer
      againstUserId = booking.customer;
    } else {
      res.status(403);
      return next(new Error('Not authorized to raise a dispute for this booking'));
    }

    // Create the dispute
    const dispute = await Dispute.create({
      booking: bookingId,
      raisedBy: req.user._id,
      against: againstUserId,
      reason,
      description,
    });

    // Update the booking status to reflect the dispute
    booking.status = 'disputed';
    booking.statusHistory.push({
      status: 'disputed',
      note: `Dispute raised: ${reason}`,
      timestamp: Date.now()
    });
    
    await booking.save();

    res.status(201).json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all disputes (Filtered by role)
// @route   GET /api/disputes
// @access  Private
const getDisputes = async (req, res, next) => {
  try {
    let query = {};

    // Customers and Providers only see disputes they are involved in
    if (req.user.role === 'customer' || req.user.role === 'provider') {
      query = {
        $or: [{ raisedBy: req.user._id }, { against: req.user._id }],
      };
    }
    // Admins and Support agents bypass the if-block and see everything

    // Optional status filter from URL (e.g., ?status=open)
    if (req.query.status) query.status = req.query.status;

    const disputes = await Dispute.find(query)
      .populate('raisedBy', 'name email role')
      .populate('against', 'name email role')
      .populate('booking', 'status basePrice additionalWorkAmount')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: disputes.length, data: disputes });
  } catch (error) {
    next(error);
  }
};

// @desc    Update dispute status and add resolution
// @route   PATCH /api/disputes/:id
// @access  Private (Admin, Support, Operations only)
const updateDispute = async (req, res, next) => {
  try {
    const { status, resolution } = req.body;

    if (!['under_review', 'resolved', 'rejected', 'refunded'].includes(status)) {
      res.status(400);
      return next(new Error('Invalid dispute status transition'));
    }

    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      res.status(404);
      return next(new Error('Dispute not found'));
    }

    dispute.status = status;
    if (resolution) dispute.resolution = resolution;

    await dispute.save();

    // If resolved, we could theoretically transition the Booking back to 'completed',
    // but for now, we will just update the Booking history to note the resolution.
    if (status === 'resolved' || status === 'refunded' || status === 'rejected') {
      const booking = await Booking.findById(dispute.booking);
      if (booking) {
        booking.statusHistory.push({
          status: booking.status, // stays 'disputed' or moves based on your specific business rules
          note: `Dispute ${status}. Admin note: ${resolution || 'No note provided'}`,
          timestamp: Date.now()
        });
        await booking.save();
      }
    }

    res.status(200).json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDispute, getDisputes, updateDispute };