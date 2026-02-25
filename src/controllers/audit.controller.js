const prisma = require('../config/prisma');

// @desc    Get all audit logs
// @route   GET /api/audit
exports.getAuditLogs = async (req, res, next) => {
    try {
        const logs = await prisma.activityLog.findMany({
            include: {
                user: {
                    select: { name: true, role: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedLogs = logs.map(l => ({
            ...l,
            userName: l.user ? l.user.name : null,
            userRole: l.user ? l.user.role : null
        }));

        res.json({ success: true, data: formattedLogs });
    } catch (error) {
        next(error);
    }
};

// @desc    Export audit logs (placeholder for real CSV generator)
// @route   POST /api/audit/export
exports.exportLogs = async (req, res, next) => {
    try {
        // In a real app, this would generate a CSV and return a link or stream
        res.json({ success: true, message: 'Export started. Data will be available shortly.' });
    } catch (error) {
        next(error);
    }
};

// Utility function to log activity (can be used internally)
exports.logActivity = async (userId, action, module, details, status = 'Success', ip = '', device = '') => {
    try {
        await prisma.activityLog.create({
            data: {
                userId: userId ? parseInt(userId) : null,
                action,
                module,
                details,
                status: status || 'Success',
                ip,
                device
            }
        });
    } catch (error) {
        console.error('Failed to log activity:', error.message);
    }
};
