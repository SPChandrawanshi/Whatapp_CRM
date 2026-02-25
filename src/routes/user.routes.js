const express = require('express');
const router = express.Router();
const { getUsers, updateUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/', getUsers);
router.put('/:id', updateUser);

module.exports = router;
