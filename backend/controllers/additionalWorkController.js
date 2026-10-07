const AdditionalWork = require('../models/AdditionalWork');
const Booking = require('../models/Booking');

// @desc    Request additional work
// @route   POST /api/additional-work
// @access  Private (Provider only)
const requestAdditionalWork = async (req, res, next) => {
  try {
    const { bookingId, description, reason, additionalPrice, estimatedExtraTime } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to request additional work for this booking'));
    }

    // Usually, additional work is discovered when 'in_progress' or 'arrived'
    if (!['arrived', 'in_progress'].includes(booking.status)) {
      res.status(400);
      return next(new Error(`Cannot request additional work when booking status is ${booking.status}`));
    }

    const extraWork = await AdditionalWork.create({
      booking: bookingId,
      provider: req.user._id,
      customer: booking.customer,
      description,
      reason,
      additionalPrice,
      estimatedExtraTime,
    });

    res.status(201).json({ success: true, data: extraWork });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all additional work requests for a booking
// @route   GET /api/additional-work/:bookingId
// @access  Private
const getAdditionalWorkForBooking = async (req, res, next) => {
  try {
    const extraWork = await AdditionalWork.find({ booking: req.params.bookingId })
      .populate('provider', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: extraWork.length, data: extraWork });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to an additional work request (Approve/Reject)
// @route   PATCH /api/additional-work/:id/respond
// @access  Private (Customer only)
const respondToAdditionalWork = async (req, res, next) => {
  try {
    const { status } = req.body;
    const extraWorkId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400);
      return next(new Error('Status must be either approved or rejected'));
    }

    const extraWork = await AdditionalWork.findById(extraWorkId);

    if (!extraWork) {
      res.status(404);
      return next(new Error('Additional work request not found'));
    }

    if (extraWork.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to respond to this request'));
    }

    if (extraWork.status !== 'pending') {
      res.status(400);
      return next(new Error(`This request has already been ${extraWork.status}`));
    }

    extraWork.status = status;
    await extraWork.save();

    // If approved, update the Booking's additionalWorkAmount and history
    if (status === 'approved') {
      const booking = await Booking.findById(extraWork.booking);
      
      booking.additionalWorkAmount += extraWork.additionalPrice;
      
      booking.statusHistory.push({
        status: booking.status, // stays the same
        note: `Customer approved additional work: ${extraWork.description} (+ $${extraWork.additionalPrice})`,
        timestamp: Date.now()
      });

      await booking.save();
    }

    res.status(200).json({ success: true, data: extraWork });
  } catch (error) {
    next(error);
  }
};

module.exports = { requestAdditionalWork, getAdditionalWorkForBooking, respondToAdditionalWork };