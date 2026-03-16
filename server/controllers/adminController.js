const Report = require('../models/Report');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get all reports (admin)
// @route   GET /api/admin/reports
exports.getAllReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Build filter
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.violationType) where.violationType = req.query.violationType;
    if (req.query.startDate || req.query.endDate) {
      where.createdAt = {};
      if (req.query.startDate) where.createdAt[Op.gte] = new Date(req.query.startDate);
      if (req.query.endDate) where.createdAt[Op.lte] = new Date(req.query.endDate);
    }

    const { count, rows } = await Report.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    // Get users for all reports
    const userIds = [...new Set(rows.map(r => r.userId))];
    const users = await User.findAll({ where: { id: userIds } });
    const userMap = {};
    users.forEach(u => { userMap[u.id] = u; });

    const reports = rows.map(r => r.toAPIFormat(userMap[r.userId]));

    res.json({
      reports,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update report status (admin)
// @route   PUT /api/admin/reports/:id
exports.updateReport = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    await report.save();

    const user = await User.findByPk(report.userId);
    res.json(report.toAPIFormat(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    // Get report counts per user
    const usersWithCounts = await Promise.all(
      rows.map(async (user) => {
        const reportCount = await Report.count({ where: { userId: user.id } });
        return {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          reportCount
        };
      })
    );

    res.json({
      users: usersWithCounts,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete report (admin)
// @route   DELETE /api/admin/reports/:id
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    await report.destroy();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
