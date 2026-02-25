const express = require('express');
const router = express.Router();
const { getChannels, toggleChannel, addChannel, deleteChannel } = require('../controllers/channel.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/', getChannels);
router.post('/', addChannel);
router.put('/:id/toggle', toggleChannel);
router.delete('/:id', deleteChannel);

module.exports = router;
