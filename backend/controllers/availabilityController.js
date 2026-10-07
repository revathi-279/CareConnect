const Availability = require('../models/Availability');

// @desc    Add provider availability block
// @route   POST /api/availability
// @access  Private (Provider only)
const addAvailability = async (req, res, next) => {
  try {
    const { date, startTime, endTime } = req.body;

    // 1. Basic logical validation
    if (startTime >= endTime) {
      res.status(400);
      return next(new Error('Start time must be before end time'));
    }

    // 2. Prevent Overlapping blocks for the same provider on the same date
    // Overlap formula: (NewStart < ExistingEnd) AND (NewEnd > ExistingStart)
    const overlappingBlock = await Availability.findOne({
      provider: req.user._id,
      date,
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    });

    if (overlappingBlock) {
      res.status(409); // 409 Conflict
      return next(new Error(`Time block overlaps with existing availability: ${overlappingBlock.startTime} - ${overlappingBlock.endTime}`));
    }

    // 3. Create the block
    const availability = await Availability.create({
      provider: req.user._id,
      date,
      startTime,
      endTime,
    });

    res.status(201).json({ success: true, data: availability });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my availability blocks
// @route   GET /api/availability/me
// @access  Private (Provider only)
const getMyAvailability = async (req, res, next) => {
  try {
    // Optionally filter by date via query string: /api/availability/me?date=2026-10-01
    const query = { provider: req.user._id };
    if (req.query.date) query.date = req.query.date;

    const availability = await Availability.find(query).sort({ date: 1, startTime: 1 });
    res.status(200).json({ success: true, count: availability.length, data: availability });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific provider's availability (for Customers)
// @route   GET /api/availability/:providerId
// @access  Public
const getProviderAvailability = async (req, res, next) => {
  try {
    const query = { provider: req.params.providerId };
    if (req.query.date) query.date = req.query.date;

    // Ensure future dates only (basic check)
    const today = new Date().toISOString().split('T')[0];
    query.date = query.date || { $gte: today }; // If no date specified, show future/today only

    const availability = await Availability.find(query).sort({ date: 1, startTime: 1 });
    res.status(200).json({ success: true, count: availability.length, data: availability });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an availability block
// @route   DELETE /api/availability/:id
// @access  Private (Provider only)
const deleteAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.findById(req.params.id);

    if (!availability) {
      res.status(404);
      return next(new Error('Availability block not found'));
    }

    // Ensure the provider deleting it actually owns it
    if (availability.provider.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this availability block'));
    }

    await availability.deleteOne();
    res.status(200).json({ success: true, message: 'Availability block removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addAvailability, getMyAvailability, getProviderAvailability, deleteAvailability };