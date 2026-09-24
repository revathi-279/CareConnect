const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Provider = require('../models/Provider');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res, next) => {
  try {
    const { service: serviceId, address, phone, date, timeSlot, notes } = req.body;

    if (!serviceId || !address || !phone || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: service, address, phone, date, and timeSlot'
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Match provider by service category
    const provider = await Provider.findOne({
      serviceCategories: service.category
    });

    if (!provider) {
      return res.status(400).json({
        success: false,
        message: `No active service provider is currently available for category: ${service.category}`
      });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      provider: provider._id,
      service: service._id,
      address,
      phone,
      date,
      timeSlot,
      notes: notes || '',
      status: 'Pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'name startingPrice duration image category')
      .populate('provider', 'name phone rating experience');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in customer's bookings
// @route   GET /api/bookings/my
// @access  Private (Customer)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('service', 'name startingPrice duration image category')
      .populate('provider', 'name phone rating')
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

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private (Owner or Assigned Provider)
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('provider')
      .populate('customer', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Authorization: Must be booking owner customer or assigned provider user
    const isOwner = booking.customer._id.toString() === req.user._id.toString();
    let isAssignedProvider = false;

    if (req.user.role === 'provider') {
      const providerDoc = await Provider.findOne({ user: req.user._id });
      if (providerDoc && booking.provider._id.toString() === providerDoc._id.toString()) {
        isAssignedProvider = true;
      }
    }

    if (!isOwner && !isAssignedProvider) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Customer)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'Completed' || booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already marked as ${booking.status}`
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking };