const express = require('express');
const router = express.Router();
const { toggleClientChannel, deleteClientChannel, dispatchLead, addAdmin, updatePermissions, getAdmins, toggleAdminStatus, getDashboardKpis, getDispatchQueue } = require('../controllers/superadmin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('Super Admin'));

router.get('/dashboard/kpis', getDashboardKpis);
router.get('/leads/dispatch-queue', getDispatchQueue);
router.get('/admins', getAdmins);
router.post('/admins', addAdmin);
router.put('/admins/:id/permissions', updatePermissions);
router.put('/admins/:id/toggle', toggleAdminStatus);

module.exports = router;
