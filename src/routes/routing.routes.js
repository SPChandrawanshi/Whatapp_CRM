const express = require('express');
const router = express.Router();
const { getRules, addRule, toggleRule, deleteRule } = require('../controllers/routing.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/', getRules);
router.post('/', addRule);
router.put('/:id/toggle', toggleRule);
router.delete('/:id', deleteRule);

module.exports = router;
