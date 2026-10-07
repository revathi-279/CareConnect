const Service = require('../models/Service');
const Category = require('../models/Category');


// @desc    Get all active services (with search, filter, pagination)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    // The advancedResults middleware has already processed the query!
    res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const { category } = req.body;

    // Verify the category exists before creating the service
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(404);
      return next(new Error(`No category found with id of ${category}`));
    }

    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

module.exports = { getServices, createService };