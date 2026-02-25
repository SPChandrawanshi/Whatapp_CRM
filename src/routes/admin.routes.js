const express = require('express');
const router = express.Router();
const { downloadReport, executeAction, updateWorkingHours, getSecuritySettings, updateSecuritySettings, getActiveSessions, revokeSession } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/reports/download', authorize('Admin', 'Super Admin'), downloadReport);
router.post('/execute', authorize('Admin', 'Super Admin'), executeAction);
router.put('/working-hours', authorize('Admin', 'Super Admin'), updateWorkingHours);

// Security
router.get('/security/settings', authorize('Admin', 'Super Admin'), getSecuritySettings);
router.put('/security/settings', authorize('Admin', 'Super Admin'), updateSecuritySettings);
router.get('/security/sessions', authorize('Admin', 'Super Admin'), getActiveSessions);
router.post('/security/sessions/:id/revoke', authorize('Admin', 'Super Admin'), revokeSession);

// Integrations
const { getIntegrations, addIntegration, deleteIntegration, testConnection } = require('../controllers/admin.controller');
router.get('/integrations', authorize('Admin', 'Super Admin'), getIntegrations);
router.post('/integrations', authorize('Admin', 'Super Admin'), addIntegration);
router.delete('/integrations/:id', authorize('Admin', 'Super Admin'), deleteIntegration);
router.post('/integrations/test', authorize('Admin', 'Super Admin'), testConnection);

module.exports = router;
