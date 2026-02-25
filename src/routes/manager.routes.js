const express = require('express');
const router = express.Router();
const { getDashboard, getFunnelReport, getCountryAnalytics, refreshData } = require('../controllers/manager.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('Manager', 'Admin', 'Super Admin'));

router.get('/dashboard', getDashboard);
router.get('/funnel', getFunnelReport);
router.get('/country-analytics', getCountryAnalytics);
router.post('/refresh', refreshData);

module.exports = router;
