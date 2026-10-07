const express = require('express');
const { 
  generateInvoice, 
  getInvoices, 
  payInvoice 
} = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('provider'), generateInvoice);
router.get('/', protect, getInvoices);
router.patch('/:id/pay', protect, authorize('customer'), payInvoice);

module.exports = router;