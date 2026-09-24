const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile (Name & Phone)
// @route   PATCH /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.phone) user.phone = req.body.phone.trim();

    // Prevent direct role escalation
    if (req.body.role && req.body.role !== user.role) {
      return res.status(400).json({
        success: false,
        message: 'Changing roles via profile update is not permitted'
      });
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile };