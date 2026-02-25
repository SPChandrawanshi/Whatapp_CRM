const express = require('express');
const router = express.Router();
const { getDashboard, getLeads, updateLeadStatus, addTeamNote } = require('../controllers/teamleader.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('Team Leader', 'Manager', 'Admin', 'Super Admin'));

router.get('/dashboard', getDashboard);
router.get('/leads', getLeads);
router.put('/leads/:id/status', updateLeadStatus);
router.post('/notes', addTeamNote);

module.exports = router;
