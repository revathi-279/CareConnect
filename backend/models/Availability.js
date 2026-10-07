const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide a date in YYYY-MM-DD format'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    startTime: {
      type: String,
      required: [true, 'Please provide a start time in HH:mm format'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be valid 24-hour HH:mm'],
    },
    endTime: {
      type: String,
      required: [true, 'Please provide an end time in HH:mm format'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be valid 24-hour HH:mm'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);