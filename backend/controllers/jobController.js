const Booking = require('../models/Booking');

// @desc    Update the status of an active job
// @route   PATCH /api/jobs/:id/status
// @access  Private (Provider and Admin)
const updateJobStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      return next(new Error('Job/Booking not found'));
    }

    // 1. ADMIN BYPASS: Allow if user is admin OR the assigned provider
    const isAdmin = req.user.role === 'admin';
    if (booking.provider.toString() !== req.user._id.toString() && !isAdmin) {
      res.status(403);
      return next(new Error('Not authorized to update this job'));
    }

    // STATE MACHINE: Define valid transitions
    const validTransitions = {
      'scheduled': ['on_the_way', 'cancelled'],
      'on_the_way': ['arrived', 'cancelled'],
      'arrived': ['in_progress', 'cancelled'],
      'in_progress': ['completed'],
      'completed': [], 
      'cancelled': [],
      'disputed': [] 
    };

    const allowedNextStates = validTransitions[booking.status] || [];

    // 2. ADMIN BYPASS: Admins can force status changes (like resolving a dispute)
    if (!allowedNextStates.includes(status) && !isAdmin) {
      res.status(400);
      return next(new Error(`Invalid status transition. Cannot move from '${booking.status}' to '${status}'.`));
    }

    // Update the main status
    booking.status = status;

    // Push the event to the history array for auditing and timeline tracking
    booking.statusHistory.push({
      status: status,
      note: note || (isAdmin ? 'Forced status update by Admin' : ''),
      timestamp: Date.now()
    });

    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateJobStatus };