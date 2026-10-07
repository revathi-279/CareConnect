const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Please provide a short reason for the dispute'],
    },
    description: {
      type: String,
      required: [true, 'Please provide full details of the issue'],
    },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'rejected', 'refunded'],
      default: 'open',
    },
    resolution: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispute', disputeSchema);