const express = require('express');
const router = express.Router();
const { assignLead, createLead, bulkAssign, getDashboard, getNewLeads, getAssignmentList, getAiStatus } = require('../controllers/support.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/dashboard', authorize('Customer Support', 'Admin', 'Super Admin'), getDashboard);
router.get('/leads/queue', authorize('Customer Support', 'Admin', 'Super Admin'), getNewLeads);
router.get('/assignment-list', authorize('Customer Support', 'Admin', 'Super Admin'), getAssignmentList);
router.post('/assign', authorize('Customer Support', 'Admin', 'Super Admin'), assignLead);
router.post('/leads', authorize('Customer Support', 'Admin', 'Super Admin'), createLead);
router.post('/leads/bulk-assign', authorize('Customer Support', 'Admin', 'Super Admin'), bulkAssign);
router.get('/ai-status', authorize('Customer Support', 'Admin', 'Super Admin'), getAiStatus);

module.exports = router;
