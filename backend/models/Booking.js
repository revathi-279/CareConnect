const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  address: {
    type: String,
    required: [true, 'Service address is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: [
      '09:00 AM - 11:00 AM',
      '11:00 AM - 01:00 PM',
      '02:00 PM - 04:00 PM',
      '04:00 PM - 06:00 PM'
    ]
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);