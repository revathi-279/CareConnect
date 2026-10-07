const AuditLog = require('../models/AuditLog');

/**
 * Logs an action to the AuditLog collection.
 * @param {Object} req - The Express request object (used to extract the actor)
 * @param {String} action - The name of the action (e.g., 'VERIFY_PROVIDER')
 * @param {String} resource - The model affected (e.g., 'ProviderProfile')
 * @param {String} resourceId - The ID of the affected document
 * @param {Object} metadata - Any additional context (e.g., { previous: 'pending', new: 'verified' })
 */
const logAction = async (req, action, resource, resourceId, metadata = {}) => {
  try {
    if (!req.user) {
      console.error('Audit Logger Error: No user found in request.');
      return;
    }

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action,
      resource,
      resourceId,
      metadata,
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

module.exports = logAction