const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/:leadId', getMessages);
router.post('/', sendMessage);

module.exports = router;
