const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware'); // Adjust path if your auth middleware is elsewhere

// Set up Multer to store files in memory (up to 5MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error('Please provide an image file'));
    }

    // Convert buffer to Base64 string for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'careconnect_evidence',
      resource_type: 'auto',
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;