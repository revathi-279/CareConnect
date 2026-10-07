const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');

// @desc    Generate an invoice and mark job as completed
// @route   POST /api/invoices
// @access  Private (Provider only)
const generateInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Ensure the provider generating the invoice is the assigned provider
    if (booking.provider.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to generate an invoice for this booking'));
    }

    // Ensure the job is currently in progress
    if (booking.status !== 'in_progress') {
      res.status(400);
      return next(new Error(`Cannot complete job and generate invoice from status: ${booking.status}. Job must be 'in_progress'.`));
    }

    // Calculate Final Total
    const baseAmount = booking.basePrice;
    const additionalAmount = booking.additionalWorkAmount || 0;
    const totalAmount = baseAmount + additionalAmount;

    // Create the Invoice
    const invoice = await Invoice.create({
      booking: booking._id,
      customer: booking.customer,
      provider: booking.provider,
      baseAmount,
      additionalAmount,
      totalAmount,
    });

    // Automatically transition the booking state to 'completed'
    booking.status = 'completed';
    booking.statusHistory.push({
      status: 'completed',
      note: 'Job completed and invoice generated.',
      timestamp: Date.now()
    });
    
    await booking.save();

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    // Handle duplicate invoice generation (unique constraint on booking)
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('An invoice has already been generated for this booking'));
    }
    next(error);
  }
};

// @desc    Get all invoices for logged in user
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'provider') {
      query.provider = req.user._id;
    }

    const invoices = await Invoice.find(query)
      .populate('provider', 'name email')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate paying an invoice
// @route   PATCH /api/invoices/:id/pay
// @access  Private (Customer only)
const payInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      res.status(404);
      return next(new Error('Invoice not found'));
    }

    // Ensure only the customer who owns the invoice can pay it
    if (invoice.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to pay this invoice'));
    }

    if (invoice.status === 'paid') {
      res.status(400);
      return next(new Error('Invoice is already paid'));
    }

    invoice.status = 'paid';
    invoice.paidAt = Date.now();
    await invoice.save();

    res.status(200).json({ success: true, message: 'Payment successful', data: invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateInvoice, getInvoices, payInvoice };