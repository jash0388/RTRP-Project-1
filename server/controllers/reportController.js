const Report = require('../models/Report');
const User = require('../models/User');

// @desc    Create violation report
// @route   POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { violationType, description, latitude, longitude, address } = req.body;

    if (!violationType || !latitude || !longitude) {
      return res.status(400).json({ message: 'Violation type and location are required' });
    }

    // Process uploaded files
    const media = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const isVideo = file.mimetype.startsWith('video');
        media.push({
          url: `/uploads/${file.filename}`,
          type: isVideo ? 'video' : 'image'
        });
      });
    }

    const report = await Report.create({
      userId: req.user.id,
      violationType,
      description: description || '',
      media,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || ''
    });

    const user = await User.findByPk(req.user.id);
    res.status(201).json(report.toAPIFormat(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's reports
// @route   GET /api/reports/my
exports.getMyReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Report.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    const user = await User.findByPk(req.user.id);
    const reports = rows.map(r => r.toAPIFormat(user));

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

// @desc    Get single report
// @route   GET /api/reports/:id
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Users can only see their own reports (admins can see all)
    if (req.user.role !== 'admin' && report.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    const user = await User.findByPk(report.userId);
    res.json(report.toAPIFormat(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
