const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe what you need help with'],
    },
    address: {
      type: String,
      required: [true, 'Please provide the service address'],
    },
    preferredDate: {
      type: String,
      // Optional: The customer might just say "ASAP" in the description
    },
    preferredTime: {
      type: String, // e.g., "Morning", "Afternoon", or a specific time
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'classified', 'matched', 'quoted', 'booked', 'cancelled'],
      default: 'pending',
    },
    // --- Fields for Phase 7 (AI Classification) & Phase 8 (Matching) ---
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    aiConfidenceScore: {
      type: Number,
    },
  aiInsights: {
    type: Object, // Stores the category, rankedProviders array, and reasoning
    default: null
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);