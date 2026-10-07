const ProviderProfile = require('../models/ProviderProfile');
const Availability = require('../models/Availability');

const ServiceRequest = require('../models/ServiceRequest');
const { classifyRequestText } = require('../services/aiService');

// @desc    Create a new service request
// @route   POST /api/requests
// @access  Private (Customer only)
const createRequest = async (req, res, next) => {
  try {
    const { description, address, preferredDate, preferredTime, urgency } = req.body;

    const request = await ServiceRequest.create({
      customer: req.user._id,
      description,
      address,
      preferredDate,
      preferredTime,
      urgency
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in customer's requests
// @route   GET /api/requests/me
// @access  Private (Customer only)
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user._id })
      .populate('category', 'name')
      .populate('service', 'name basePrice')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests (for Ops/Admin to monitor)
// @route   GET /api/requests
// @access  Private (Admin/Operations)
const getAllRequests = async (req, res, next) => {
  try {
    // Optionally filter by status (e.g., /api/requests?status=pending)
    const query = {};
    if (req.query.status) query.status = req.query.status;

    const requests = await ServiceRequest.find(query)
      .populate('customer', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Run AI Classification on a pending request
// @route   PATCH /api/requests/:id/classify
// @access  Private (Admin/Operations)
const classifyServiceRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      res.status(404);
      return next(new Error('Service request not found'));
    }

    if (request.status !== 'pending') {
      res.status(400);
      return next(new Error(`Cannot classify a request with status: ${request.status}`));
    }

    // Call our AI Service
    const classification = await classifyRequestText(request.description);

    if (classification.serviceId) {
      request.category = classification.categoryId;
      request.service = classification.serviceId;
      request.aiConfidenceScore = classification.confidence;
      request.status = 'classified';
      
      const updatedRequest = await request.save();

      // Populate for a nice response
      await updatedRequest.populate('category', 'name');
      await updatedRequest.populate('service', 'name basePrice');

      res.status(200).json({
        success: true,
        message: 'Request successfully classified',
        data: updatedRequest
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'AI could not confidently classify this request. Manual intervention required.',
        data: request
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get matching providers for a specific service request
// @route   GET /api/requests/:id/matches
// @access  Private (Customer who owns it, or Admin/Ops)
const getMatchingProviders = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      res.status(404);
      return next(new Error('Service request not found'));
    }

    // Authorization: Only the owner or an admin/ops can see matches
    if (
      request.customer.toString() !== req.user._id.toString() &&
      !['admin', 'operations'].includes(req.user.role)
    ) {
      res.status(403);
      return next(new Error('Not authorized to view matches for this request'));
    }

    // Rule: We can only match a request if it has been classified
    if (!['classified', 'quoted', 'booked'].includes(request.status)) {
      res.status(400);
      return next(new Error(`Cannot match providers. Current request status is: ${request.status}`));
    }

    // Step 1: Find all verified providers who work in this category
    const categoryMatches = await ProviderProfile.find({
      verificationStatus: 'verified',
      categories: request.category,
    }).populate('user', 'name email');

    // Step 2: If the customer specified a date, filter by availability
    let finalMatches = categoryMatches;
    
    if (request.preferredDate) {
      // Find all availability blocks for that specific date for our category-matched providers
      const providerUserIds = categoryMatches.map((profile) => profile.user._id);
      
      const availabilities = await Availability.find({
        date: request.preferredDate,
        provider: { $in: providerUserIds },
      });

      // Extract just the user IDs of providers who are actually working that day
      const availableProviderIds = availabilities.map((a) => a.provider.toString());

      // Filter our matched profiles down to only those who are available
      finalMatches = categoryMatches.filter((profile) =>
        availableProviderIds.includes(profile.user._id.toString())
      );
    }

    res.status(200).json({
      success: true,
      count: finalMatches.length,
      data: finalMatches,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRequest, getMyRequests, getAllRequests, classifyServiceRequest,getMatchingProviders };