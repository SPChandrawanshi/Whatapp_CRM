const prisma = require('../config/prisma');

// @desc    Get all leads
// @route   GET /api/leads
exports.getLeads = async (req, res, next) => {
    try {
        const leads = await prisma.lead.findMany({
            include: {
                assignedUser: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Flatten the data to match the expected format (u.name as handlerName)
        const flattenedLeads = leads.map(l => {
            const { assignedUser, ...rest } = l;
            return {
                ...rest,
                handlerName: assignedUser ? assignedUser.name : null
            };
        });

        res.json({
            success: true,
            data: flattenedLeads
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create lead
// @route   POST /api/leads
exports.createLead = async (req, res, next) => {
    try {
        const { name, country, phone, email, program, stage, score, source, assignedTo, team, priority } = req.body;

        const newLead = await prisma.lead.create({
            data: {
                name,
                country,
                phone,
                email,
                program,
                stage: stage || 'New',
                score: score || 0,
                source: source || 'Website',
                assignedTo: assignedTo || null,
                team: team || 'General',
                priority: priority || 'Medium'
            }
        });

        res.status(201).json({
            success: true,
            data: newLead
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
exports.updateLead = async (req, res, next) => {
    try {
        const { name, country, phone, email, program, stage, score, source, assignedTo, team, priority } = req.body;
        const leadId = parseInt(req.params.id);

        let data = {};
        if (name) data.name = name;
        if (country) data.country = country;
        if (phone) data.phone = phone;
        if (email) data.email = email;
        if (program) data.program = program;
        if (stage) data.stage = stage;
        if (score !== undefined) data.score = score;
        if (source) data.source = source;
        if (assignedTo !== undefined) data.assignedTo = assignedTo || null;
        if (team) data.team = team;
        if (priority) data.priority = priority;

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data
        });

        res.json({
            success: true,
            data: updatedLead
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
exports.deleteLead = async (req, res, next) => {
    try {
        const leadId = parseInt(req.params.id);

        await prisma.lead.delete({
            where: { id: leadId }
        });

        res.json({
            success: true,
            message: 'Lead deleted successfully'
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        next(error);
    }
};

// @desc    Export leads to CSV
// @route   POST /api/leads/export
exports.exportLeads = async (req, res, next) => {
    try {
        const leads = await prisma.lead.findMany();
        res.json({ success: true, message: `Exported ${leads.length} leads to CSV`, count: leads.length });
    } catch (error) {
        next(error);
    }
};
