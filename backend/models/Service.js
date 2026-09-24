const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required']
  },
  image: {
    type: String,
    required: [true, 'Service image URL is required']
  },
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
    min: 0
  },
  duration: {
    type: String,
    required: [true, 'Estimated duration is required']
  },
  included: [{
    type: String,
    required: true
  }],
  notIncluded: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);