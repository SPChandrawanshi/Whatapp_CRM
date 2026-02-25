const express = require('express');
const router = express.Router();
const { getTemplates, addTemplate, updateTemplate, deleteTemplate } = require('../controllers/template.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getTemplates);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), addTemplate);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), updateTemplate);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), deleteTemplate);

module.exports = router;
