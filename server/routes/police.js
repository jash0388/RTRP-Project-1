const express = require('express');
const router = express.Router();
const { protect, policeOrAdmin } = require('../middleware/auth');
const Report = require('../models/Report');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get reports for police review (no user details like email exposed)
// @route   GET /api/police/reports
router.get('/reports', protect, policeOrAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.violationType) where.violationType = req.query.violationType;

    const { count, rows } = await Report.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    // Police get NO user info for anonymity
    const reports = rows.map(r => {
      // Pass null or an empty object to toAPIFormat to ensure no user data is included
      const formatted = r.toAPIFormat(); 
      if (formatted.user) {
        delete formatted.user; // Completely strip the reporter's user object
      }
      return formatted;
    });

    res.json({
      reports,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update report status (police can approve/reject)
// @route   PUT /api/police/reports/:id
router.put('/reports/:id', protect, policeOrAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    await report.save();

    const formatted = report.toAPIFormat();
    if (formatted.user) {
      delete formatted.user; // Completely strip the reporter's user object
    }

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get report stats for police (limited analytics)
// @route   GET /api/police/stats
router.get('/stats', protect, policeOrAdmin, async (req, res) => {
  try {
    const totalReports = await Report.count();
    const pendingReports = await Report.count({ where: { status: 'pending' } });
    const approvedReports = await Report.count({ where: { status: 'approved' } });
    const rejectedReports = await Report.count({ where: { status: 'rejected' } });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyCount = await Report.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } });

    res.json({
      totalReports,
      pendingReports,
      approvedReports,
      rejectedReports,
      weeklyCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
