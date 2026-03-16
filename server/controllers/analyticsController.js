const Report = require('../models/Report');
const { sequelize } = require('../config/db');
const { Op, fn, col, literal } = require('sequelize');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
exports.getSummary = async (req, res) => {
  try {
    const totalReports = await Report.count();
    const pendingReports = await Report.count({ where: { status: 'pending' } });
    const approvedReports = await Report.count({ where: { status: 'approved' } });
    const rejectedReports = await Report.count({ where: { status: 'rejected' } });

    // Violations by type
    const violationsByTypeRaw = await Report.findAll({
      attributes: [
        'violationType',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['violationType'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true
    });
    const violationsByType = violationsByTypeRaw.map(v => ({
      _id: v.violationType,
      count: parseInt(v.count)
    }));

    // Daily reports for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyReportsRaw = await Report.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true
    });
    const dailyReports = dailyReportsRaw.map(d => ({
      _id: d.date,
      count: parseInt(d.count)
    }));

    // Weekly stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyCount = await Report.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } });

    // Monthly stats
    const monthlyCount = await Report.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });

    // Vehicle type distribution
    const vehicleTypesRaw = await Report.findAll({
      attributes: [
        'aiVehicleType',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { aiVehicleType: { [Op.ne]: '' } },
      group: ['aiVehicleType'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true
    });
    const vehicleTypes = vehicleTypesRaw.map(v => ({
      _id: v.aiVehicleType,
      count: parseInt(v.count)
    }));

    res.json({
      totalReports,
      pendingReports,
      approvedReports,
      rejectedReports,
      weeklyCount,
      monthlyCount,
      violationsByType,
      dailyReports,
      vehicleTypes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get heatmap data
// @route   GET /api/analytics/heatmap
exports.getHeatmapData = async (req, res) => {
  try {
    const reports = await Report.findAll({
      attributes: ['latitude', 'longitude', 'violationType', 'createdAt'],
      raw: true
    });

    const heatmapData = reports.map(r => ({
      lat: parseFloat(r.latitude),
      lng: parseFloat(r.longitude),
      violationType: r.violationType,
      date: r.createdAt
    }));

    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get area-wise statistics
// @route   GET /api/analytics/areas
exports.getAreaStats = async (req, res) => {
  try {
    const areaStatsRaw = await Report.findAll({
      attributes: [
        'address',
        [fn('COUNT', col('id')), 'count'],
        [fn('GROUP_CONCAT', col('violationType')), 'violations']
      ],
      where: { address: { [Op.ne]: '' } },
      group: ['address'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 20,
      raw: true
    });

    const areaStats = areaStatsRaw.map(a => ({
      _id: a.address,
      count: parseInt(a.count),
      violations: a.violations ? a.violations.split(',') : []
    }));

    res.json(areaStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
