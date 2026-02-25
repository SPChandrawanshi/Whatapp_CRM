const express = require('express');
const router = express.Router();
const { addNote, getNotes, getAllNotes, updateStage, getDashboard, getLeads } = require('../controllers/counselor.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/leads', getLeads);
router.get('/notes', getAllNotes);
router.get('/notes/:leadId', getNotes);
router.post('/notes', addNote);
router.put('/stage', updateStage);

module.exports = router;
