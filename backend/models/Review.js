const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // Strictly ONE review per booking
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    comment: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Static method to get the average rating and save it to the ProviderProfile
reviewSchema.statics.getAverageRating = async function (providerId) {
  // Aggregate is a MongoDB feature that processes data records and returns computed results
  const obj = await this.aggregate([
    {
      $match: { provider: providerId },
    },
    {
      $group: {
        _id: '$provider',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    const ProviderProfile = mongoose.model('ProviderProfile');
    await ProviderProfile.findOneAndUpdate(
      { user: providerId },
      {
        // Round to 1 decimal place (e.g., 4.5)
        rating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      }
    );
  } catch (error) {
    console.error('Error updating provider rating:', error);
  }
};

// Call getAverageRating AFTER a review is saved
reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.provider);
});

module.exports = mongoose.model('Review', reviewSchema);