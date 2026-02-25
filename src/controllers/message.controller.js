const prisma = require('../config/prisma');

// @desc    Get messages for a lead
// @route   GET /api/messages/:leadId
exports.getMessages = async (req, res, next) => {
    try {
        const leadId = parseInt(req.params.leadId);
        const messages = await prisma.message.findMany({
            where: { leadId },
            orderBy: {
                timestamp: 'asc'
            }
        });

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send a message
// @route   POST /api/messages
exports.sendMessage = async (req, res, next) => {
    try {
        const { leadId, channel, message, sender } = req.body;

        const newMessage = await prisma.message.create({
            data: {
                leadId: parseInt(leadId),
                channel,
                message,
                sender
            }
        });

        // Emit socket event if io is available
        const io = req.app.get('io');
        if (io) {
            io.emit('new_message', newMessage);
        }

        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        next(error);
    }
};
