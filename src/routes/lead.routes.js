const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead, exportLeads } = require('../controllers/lead.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, getLeads);
router.post('/', protect, createLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteLead);

module.exports = router;
