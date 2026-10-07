const mongoose = require('mongoose');

const additionalWorkSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe the additional work'],
    },
    reason: {
      type: String,
      required: [true, 'Please explain why this is necessary'],
    },
    additionalPrice: {
      type: Number,
      required: [true, 'Please provide the cost for the additional work'],
    },
    estimatedExtraTime: {
      type: Number, // in minutes
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdditionalWork', additionalWorkSchema);