const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a notification title'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a notification message'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Optional reference to a booking or request so the frontend can make it clickable later
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);