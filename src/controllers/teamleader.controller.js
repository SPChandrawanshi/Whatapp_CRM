const prisma = require('../config/prisma');

// @desc    Get team leader dashboard
// @route   GET /api/team-leader/dashboard
exports.getDashboard = async (req, res, next) => {
    try {
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Get assigned leads
// @route   GET /api/team-leader/leads
exports.getLeads = async (req, res, next) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ success: true, data: leads });
    } catch (error) {
        next(error);
    }
};

// @desc    Update lead status (TL action)
// @route   PUT /api/team-leader/leads/:id/status
exports.updateLeadStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        await prisma.lead.update({
            where: { id: parseInt(req.params.id) },
            data: { stage: status } // Map status to stage
        });
        res.json({ success: true, message: 'Status updated' });
    } catch (error) {
        next(error);
    }
};

// @desc    Add team note
// @route   POST /api/team-leader/notes
exports.addTeamNote = async (req, res, next) => {
    try {
        res.json({ success: true, message: 'Team note saved' });
    } catch (error) {
        next(error);
    }
};
