const express = require('express');
const router = express.Router();
const { createReport, getMyReports, getReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('media', 5), createReport);
router.get('/my', protect, getMyReports);
router.get('/:id', protect, getReport);

module.exports = router;
