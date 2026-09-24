const Service = require('../models/Service');

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({}).sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single service by ID or Slug
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let service;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getServices, getServiceById };