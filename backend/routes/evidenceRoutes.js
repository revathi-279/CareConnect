const express = require('express');
const { addEvidence, getEvidenceForBooking } = require('../controllers/evidenceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('provider'), addEvidence);
router.get('/:bookingId', protect, getEvidenceForBooking);

module.exports = router;