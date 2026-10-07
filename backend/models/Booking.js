const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
    },
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
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
    date: {
      type: String,
      required: [true, 'Please provide a booking date (YYYY-MM-DD)'],
    },
    startTime: {
      type: String,
      required: [true, 'Please provide a start time (HH:mm)'],
    },
    endTime: {
      type: String,
      required: [true, 'Please provide an end time (HH:mm)'],
    },
    address: {
      type: String,
      required: [true, 'Please provide the service address'],
    },
    basePrice: {
      type: Number,
      required: true,
    },
    additionalWorkAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['scheduled', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled', 'disputed'],
      default: 'scheduled',
    },
    // --- NEW: Job Tracking History ---
    statusHistory: [
      {
        status: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        note: {
          type: String,
          default: ''
        }
      }
    ],
    // Add these fields inside your mongoose.Schema({ ... })
  isDisputed: {
    type: Boolean,
    default: false
  },
  disputeReason: {
    type: String,
    default: ''
  },

  chatHistory: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);