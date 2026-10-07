const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema(
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
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    type: {
      type: String,
      enum: ['before', 'during', 'after', 'other'],
      required: [true, 'Please specify the evidence type'],
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Evidence', evidenceSchema);