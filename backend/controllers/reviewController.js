const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Add a review for a completed booking
// @route   POST /api/reviews
// @access  Private (Customer only)
const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Ensure the customer owns this booking
    if (booking.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to review this booking'));
    }

    // Ensure the job is actually completed before reviewing
    if (booking.status !== 'completed') {
      res.status(400);
      return next(new Error(`Cannot review a booking that is ${booking.status}. It must be completed.`));
    }

    // Create the review
    const review = await Review.create({
      booking: bookingId,
      customer: req.user._id,
      provider: booking.provider,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    // Handle duplicate review submission (unique index on booking ID)
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('You have already reviewed this booking'));
    }
    next(error);
  }
};

// @desc    Get reviews for a specific provider
// @route   GET /api/reviews/:providerId
// @access  Public
const getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate('customer', 'name') // Only show customer name, keep email private
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getProviderReviews };