const express = require('express');
const router = express.Router();
const { getAllReports, updateReport, getAllUsers, deleteReport } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin-only routes — full system management
router.get('/reports', protect, adminOnly, getAllReports);
router.put('/reports/:id', protect, adminOnly, updateReport);
router.delete('/reports/:id', protect, adminOnly, deleteReport);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
