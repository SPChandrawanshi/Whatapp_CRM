const express = require('express');
const router = express.Router();
const { getAuditLogs, exportLogs } = require('../controllers/audit.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAuditLogs);
router.post('/export', exportLogs);

module.exports = router;
