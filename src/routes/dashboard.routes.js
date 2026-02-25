const express = require('express');
const router = express.Router();
const { getDashboardStats, updateAiConfig, getAiConfig } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/stats', protect, getDashboardStats);
router.get('/ai-config', protect, getAiConfig);
router.post('/ai-config', protect, updateAiConfig);

module.exports = router;
