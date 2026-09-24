const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Provider name is required']
  },
  phone: {
    type: String,
    required: [true, 'Provider phone is required']
  },
  skills: [{
    type: String,
    required: true
  }],
  serviceCategories: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: true,
    default: 2
  },
  rating: {
    type: Number,
    default: 4.8
  }
});

module.exports = mongoose.model('Provider', providerSchema);