const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('Super Admin', 'Admin'));

router.get('/summary', getSummary);

module.exports = router;
