// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private (Admin/Operations only)
const getAuditLogs = async (req, res, next) => {
  try {
    // Relying completely on the advancedResults middleware!
    res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLogs };