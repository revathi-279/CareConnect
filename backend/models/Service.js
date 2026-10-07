const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a service name'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Service must belong to a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a service description'],
    },
    pricingModel: {
      type: String,
      enum: ['fixed', 'hourly', 'inspection_only'],
      default: 'fixed',
    },
    basePrice: {
      type: Number,
      required: [true, 'Please add a base price'],
    },
    estimatedDuration: {
      type: Number, // in minutes
      required: [true, 'Please add an estimated duration in minutes'],
    },
    includedTasks: {
      type: [String],
      default: [],
    },
    excludedTasks: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);