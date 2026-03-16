const express = require('express');
const router = express.Router();
const { getSummary, getHeatmapData, getAreaStats } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/summary', protect, adminOnly, getSummary);
router.get('/heatmap', protect, adminOnly, getHeatmapData);
router.get('/areas', protect, adminOnly, getAreaStats);

module.exports = router;
