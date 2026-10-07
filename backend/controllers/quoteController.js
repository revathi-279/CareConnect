const Quote = require('../models/Quote');
const ServiceRequest = require('../models/ServiceRequest');

// @desc    Submit a quote for a service request
// @route   POST /api/quotes
// @access  Private (Provider only)
const createQuote = async (req, res, next) => {
  try {
    const { requestId, price, estimatedDuration, message, validUntil } = req.body;

    const request = await ServiceRequest.findById(requestId);

    if (!request) {
      res.status(404);
      return next(new Error('Service request not found'));
    }

    // Ensure the request is in a state that accepts quotes
    if (!['classified', 'quoted'].includes(request.status)) {
      res.status(400);
      return next(new Error(`Cannot submit a quote for a request with status: ${request.status}`));
    }

    // Create the quote
    const quote = await Quote.create({
      request: requestId,
      provider: req.user._id,
      customer: request.customer,
      price,
      estimatedDuration,
      message,
      validUntil,
    });

    // Update the request status to 'quoted' if it isn't already
    if (request.status === 'classified') {
      request.status = 'quoted';
      await request.save();
    }

    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    // Handle duplicate quote submission (MongoDB Unique Index error)
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('You have already submitted a quote for this request'));
    }
    next(error);
  }
};

// @desc    Get quotes (Filtered by request or provider)
// @route   GET /api/quotes
// @access  Private (Customer, Provider, Admin)
const getQuotes = async (req, res, next) => {
  try {
    let query = {};

    // Filter by request ID
    if (req.query.requestId) {
      query.request = req.query.requestId;
      
      // If user is a customer, ensure they own the request
      if (req.user.role === 'customer') {
        const request = await ServiceRequest.findById(req.query.requestId);
        if (request && request.customer.toString() !== req.user._id.toString()) {
          res.status(403);
          return next(new Error('Not authorized to view quotes for this request'));
        }
      }
    }

    // If user is a provider, they should only see their own quotes
    if (req.user.role === 'provider') {
      query.provider = req.user._id;
    }

    const quotes = await Quote.find(query)
      .populate('provider', 'name email')
      .populate('request', 'description status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: quotes.length, data: quotes });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quote status (Accept/Reject)
// @route   PATCH /api/quotes/:id/status
// @access  Private (Customer only)
const updateQuoteStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Customers can only accept or reject
    if (!['accepted', 'rejected'].includes(status)) {
      res.status(400);
      return next(new Error('Invalid status update. Can only be accepted or rejected.'));
    }

    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      res.status(404);
      return next(new Error('Quote not found'));
    }

    // Ensure the customer updating the quote is the one who owns it
    if (quote.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this quote'));
    }

    quote.status = status;
    await quote.save();

    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

module.exports = { createQuote, getQuotes, updateQuoteStatus };