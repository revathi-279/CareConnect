const ProviderProfile = require('../models/ProviderProfile');
const logAction = require('../utils/auditLogger');

// @desc    Create or Update my provider profile
// @route   POST /api/providers/profile
// @access  Private (Provider only)
const upsertMyProfile = async (req, res, next) => {
  try {
    const { bio, experienceYears, categories, serviceAreas } = req.body;

    const profileFields = {
      user: req.user._id,
      bio,
      experienceYears,
      categories,
      serviceAreas
    };

    // upsert: true means it will update if found, or create if it doesn't exist.
    // new: true returns the newly updated document.
    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my provider profile
// @route   GET /api/providers/profile/me
// @access  Private (Provider only)
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.user._id })
      .populate('user', 'name email')
      .populate('categories', 'name');

    if (!profile) {
      res.status(404);
      return next(new Error('Profile not found'));
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all VERIFIED providers
// @route   GET /api/providers
// @access  Public
const getProviders = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or Reject a provider
// @route   PATCH /api/providers/:id/verify
// @access  Private (Admin/Operations)
const updateVerificationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      res.status(400);
      return next(new Error('Invalid status'));
    }

    // Grab the old profile first so we know what the status WAS before changing it
    const oldProfile = await ProviderProfile.findById(req.params.id);

    if (!oldProfile) {
      res.status(404);
      return next(new Error('Provider profile not found'));
    }

    const previousStatus = oldProfile.verificationStatus;

    // Update the profile
    oldProfile.verificationStatus = status;
    const updatedProfile = await oldProfile.save();

    // --- NEW: FIRE THE AUDIT LOGGER ---
    await logAction(req, 'UPDATE_PROVIDER_STATUS', 'ProviderProfile', updatedProfile._id, {
      previousStatus,
      newStatus: status
    });
    // ----------------------------------

    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    next(error);
  }
};

module.exports = { upsertMyProfile, getMyProfile, getProviders, updateVerificationStatus };