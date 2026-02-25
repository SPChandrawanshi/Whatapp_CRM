const express = require('express');
const router = express.Router();
const { getSubscriptions, upgradePlan, suspendClient, addSubscription } = require('../controllers/billing.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'));

router.get('/', getSubscriptions);
router.post('/', addSubscription);
router.put('/:id/upgrade', upgradePlan);
router.put('/:id/suspend', suspendClient);

module.exports = router;
