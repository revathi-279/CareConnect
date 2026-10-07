const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 });

    // Calculate how many are unread for a badge icon on the UI
    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.status(200).json({ 
      success: true, 
      count: notifications.length, 
      unreadCount,
      data: notifications 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      return next(new Error('Notification not found'));
    }

    // Ensure the user owns this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this notification'));
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a system notification (Internal/Admin tool)
// @route   POST /api/notifications/broadcast
// @access  Private (Admin only)
const createSystemNotification = async (req, res, next) => {
  try {
    const { email, title, message, relatedId } = req.body;

    // Find recipient by email to make testing easier
    const recipientUser = await User.findOne({ email });

    if (!recipientUser) {
      res.status(404);
      return next(new Error('Recipient user not found with that email'));
    }

    const notification = await Notification.create({
      recipient: recipientUser._id,
      title,
      message,
      relatedId
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyNotifications, markAsRead, createSystemNotification };