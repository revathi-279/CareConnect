const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
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
    price: {
      type: Number,
      required: [true, 'Please provide a quote price'],
    },
    estimatedDuration: {
      type: Number, // in minutes
      required: [true, 'Please provide an estimated duration in minutes'],
    },
    message: {
      type: String,
      default: '',
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired', 'withdrawn'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Prevent a provider from submitting multiple quotes for the same request
quoteSchema.index({ request: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('Quote', quoteSchema);