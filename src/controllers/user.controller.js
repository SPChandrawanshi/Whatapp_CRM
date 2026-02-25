const prisma = require('../config/prisma');

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true
            }
        });

        // Enrichment with metadata (until the schema is updated)
        const enrichedUsers = users.map(u => ({
            ...u,
            client: 'EduCorp Inc.',
            country: 'India',
            team: 'Operations',
            assignedChannels: Math.floor(Math.random() * 5)
        }));
        res.json({ success: true, data: enrichedUsers });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user status/role
// @route   PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
    try {
        const { role, status } = req.body;
        const userId = parseInt(req.params.id);

        let data = {};
        if (role) data.role = role;

        if (status) {
            if (status === 'TOGGLE') {
                const currentUser = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { status: true }
                });
                data.status = currentUser.status === 'Active' ? 'Inactive' : 'Active';
            } else {
                data.status = status;
            }
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true
            }
        });

        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};
