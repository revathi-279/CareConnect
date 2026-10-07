const Booking = require('../models/Booking');
const Quote = require('../models/Quote');
const ServiceRequest = require('../models/ServiceRequest');

// @desc    Create a booking from an accepted quote
// @route   POST /api/bookings
// @access  Private (Customer only)
const createBooking = async (req, res, next) => {
  try {
    const { quoteId, date, startTime, endTime } = req.body;

    // 1. Fetch the quote and related request
    const quote = await Quote.findById(quoteId).populate('request');

    if (!quote) {
      res.status(404);
      return next(new Error('Quote not found'));
    }

    // 2. Validate Authorization and Status
    if (quote.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to book this quote'));
    }

    if (quote.status !== 'accepted') {
      res.status(400);
      return next(new Error('Quote must be accepted before booking'));
    }

    // 3. Time logic validation
    if (startTime >= endTime) {
      res.status(400);
      return next(new Error('Start time must be before end time'));
    }


    // Check if the provider already has a booking that overlaps with these times
   // 4. Prevent Double Booking for the Provider
    const overlappingBooking = await Booking.findOne({
      provider: quote.provider,
      date: date,
      status: { $nin: ['cancelled', 'disputed'] }, // Don't block if the other booking was cancelled
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    });

    if (overlappingBooking) {
      res.status(409); // Conflict
      return next(new Error(`Provider is already booked on ${date} between ${overlappingBooking.startTime} and ${overlappingBooking.endTime}`));
    }

    // 5. Create the Booking
    const booking = await Booking.create({
      request: quote.request._id,
      quote: quote._id,
      provider: quote.provider,
      customer: req.user._id,
      date,
      startTime,
      endTime,
      address: quote.request.address, // Inherited from the original request
      basePrice: quote.price,         // Inherited from the quote
    });

    // 6. Update the original request status to 'booked'
    const request = await ServiceRequest.findById(quote.request._id);
    request.status = 'booked';
    await request.save();

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for the logged-in user (Customer or Provider)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    let query = {};

    // Filter based on role
    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'provider') {
      query.provider = req.user._id;
    }
    // Admins will bypass the if/else and get all bookings (empty query)

    // Optional query parameters for filtering
    if (req.query.status) query.status = req.query.status;

    const bookings = await Booking.find(query)
      .populate('provider', 'name email')
      .populate('customer', 'name email')
      .populate('request', 'description')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }

};


 const reportDispute = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Freeze the job and record the dispute
    booking.isDisputed = true;
    booking.disputeReason = reason;
    booking.status = 'disputed';

    booking.statusHistory.push({
      status: 'disputed',
      note: `Reported Issue: ${reason}`,
      timestamp: Date.now()
    });

    await booking.save();
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

const addChatMessage = async (req, res, next) => {
  try {
    const { senderId, senderName, text } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const newMessage = { senderId, senderName, text };
    booking.chatHistory.push(newMessage);
    await booking.save();

    res.status(200).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
};

const resolveDispute = async (req, res, next) => {
  try {
    const { resolutionNotes, action } = req.body; // action could be 'refund', 'warning', 'dismissed'
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'completed'; // Unfreeze the job
    booking.isDisputed = false;
    
    booking.statusHistory.push({
      status: 'resolved',
      note: `Admin Resolution (${action}): ${resolutionNotes}`,
      timestamp: Date.now()
    });

    await booking.save();
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookings, reportDispute, addChatMessage, resolveDispute};