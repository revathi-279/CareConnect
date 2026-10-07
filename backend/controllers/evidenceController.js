const Evidence = require('../models/Evidence');
const Booking = require('../models/Booking');

// @desc    Add evidence (photo/note) to a booking
// @route   POST /api/evidence
// @access  Private (Provider only)
const addEvidence = async (req, res, next) => {
  try {
    const { bookingId, imageUrl, type, description } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Ensure only the assigned provider can upload evidence
    if (booking.provider.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to add evidence to this booking'));
    }

    const evidence = await Evidence.create({
      booking: bookingId,
      provider: req.user._id,
      imageUrl,
      type,
      description,
    });

    res.status(201).json({ success: true, data: evidence });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all evidence for a specific booking
// @route   GET /api/evidence/:bookingId
// @access  Private (Customer, Provider, Admin)
const getEvidenceForBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Access Control: Customers can only see their own booking evidence
    if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to view this evidence'));
    }

    // Access Control: Providers can only see evidence for jobs they are assigned to
    if (req.user.role === 'provider' && booking.provider.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to view this evidence'));
    }

    const evidenceList = await Evidence.find({ booking: bookingId }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: evidenceList.length, data: evidenceList });
  } catch (error) {
    next(error);
  }
};

module.exports = { addEvidence, getEvidenceForBooking };