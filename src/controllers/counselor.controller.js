const prisma = require('../config/prisma');

// @desc    Add a note to a lead
// @route   POST /api/counselor/notes
exports.addNote = async (req, res, next) => {
    try {
        const { leadId, text } = req.body;
        const note = await prisma.counselorNote.create({
            data: {
                leadId: parseInt(leadId),
                authorId: req.user.id,
                text
            },
            include: {
                author: {
                    select: { name: true }
                }
            }
        });

        const formattedNote = {
            ...note,
            authorName: note.author.name
        };
        delete formattedNote.author;

        res.status(201).json({ success: true, data: formattedNote });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all notes (for directory)
// @route   GET /api/counselor/notes
exports.getAllNotes = async (req, res, next) => {
    try {
        const notes = await prisma.counselorNote.findMany({
            include: {
                lead: { select: { name: true } },
                author: { select: { name: true } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedNotes = notes.map(n => ({
            ...n,
            leadName: n.lead.name,
            authorName: n.author.name
        }));

        res.json({ success: true, data: formattedNotes });
    } catch (error) {
        next(error);
    }
};

// @desc    Get notes for a lead
// @route   GET /api/counselor/notes/:leadId
exports.getNotes = async (req, res, next) => {
    try {
        const leadId = parseInt(req.params.leadId);
        const notes = await prisma.counselorNote.findMany({
            where: { leadId },
            include: {
                author: { select: { name: true } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedNotes = notes.map(n => ({
            ...n,
            authorName: n.author.name
        }));

        res.json({ success: true, data: formattedNotes });
    } catch (error) {
        next(error);
    }
};

// @desc    Update lead stage (from counselor context)
// @route   PUT /api/counselor/stage
exports.updateStage = async (req, res, next) => {
    try {
        const { leadId, stage } = req.body;
        await prisma.lead.update({
            where: { id: parseInt(leadId) },
            data: { stage }
        });
        res.json({ success: true, message: 'Stage updated successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get counselor dashboard stats
// @route   GET /api/counselor/dashboard
exports.getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const [assignedLeads, hotLeads, followUps] = await Promise.all([
            prisma.lead.count({ where: { assignedTo: userId } }),
            prisma.lead.count({
                where: {
                    assignedTo: userId,
                    stage: { in: ['Qualified', 'Pending'] }
                }
            }),
            prisma.lead.count({
                where: {
                    assignedTo: userId,
                    stage: 'Follow Up' // The original used status='Follow Up' but schema says stage. Fixing to stage.
                }
            })
        ]);

        res.json({
            success: true,
            data: { assignedLeads, hotLeads, followUps }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get counselor leads
// @route   GET /api/counselor/leads
exports.getLeads = async (req, res, next) => {
    try {
        const leads = await prisma.lead.findMany({
            where: { assignedTo: req.user.id },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        res.json({ success: true, data: leads });
    } catch (error) {
        next(error);
    }
};
