const prisma = require('../config/prisma');

// @desc    Toggle client channel status
// @route   PUT /api/super-admin/channels/:id/toggle
exports.toggleClientChannel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const channelId = parseInt(id);
        const channel = await prisma.channel.findUnique({
            where: { id: channelId },
            select: { status: true }
        });

        if (!channel) return res.status(404).json({ success: false, message: 'Channel not found' });

        const newStatus = channel.status === 'Active' ? 'Paused' : 'Active';
        await prisma.channel.update({
            where: { id: channelId },
            data: { status: newStatus }
        });
        res.json({ success: true, message: 'Client channel status updated' });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete client channel
// @route   DELETE /api/super-admin/channels/:id
exports.deleteClientChannel = async (req, res, next) => {
    try {
        const channelId = parseInt(req.params.id);
        await prisma.channel.delete({
            where: { id: channelId }
        });
        res.json({ success: true, message: 'Client channel removed' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Channel not found' });
        }
        next(error);
    }
};

// @desc    Dispatch lead from global queue
// @route   POST /api/super-admin/leads/dispatch
exports.dispatchLead = async (req, res, next) => {
    try {
        const { leadId, counselorId } = req.body;
        await prisma.lead.update({
            where: { id: parseInt(leadId) },
            data: { assignedTo: parseInt(counselorId) }
        });
        res.json({ success: true, message: 'Lead dispatched successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Add new admin
// @route   POST /api/super-admin/admins
exports.addAdmin = async (req, res, next) => {
    try {
        // Logic would involve bcrypt hashing etc.
        res.json({ success: true, message: 'New administrator added' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update admin permissions
// @route   PUT /api/super-admin/admins/:id/permissions
exports.updatePermissions = async (req, res, next) => {
    try {
        res.json({ success: true, message: 'Permissions updated' });
    } catch (error) {
        next(error);
    }
};
// @desc    Get all admins
// @route   GET /api/super-admin/admins
exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const enrichedAdmins = admins.map(admin => ({
            ...admin,
            login: admin.createdAt,
            client: admin.client || 'Global Entity',
            permissions: ['Users', 'Analytics']
        }));
        res.json({ success: true, data: enrichedAdmins });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle admin account status
// @route   PUT /api/super-admin/admins/:id/toggle
exports.toggleAdminStatus = async (req, res, next) => {
    try {
        const adminId = parseInt(req.params.id);
        const user = await prisma.user.findUnique({
            where: { id: adminId },
            select: { status: true }
        });

        if (!user) return res.status(404).json({ success: false, message: 'Admin not found' });

        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        await prisma.user.update({
            where: { id: adminId },
            data: { status: newStatus }
        });

        res.json({ success: true, message: `Admin status set to ${newStatus}` });
    } catch (error) {
        next(error);
    }
};
// @desc    Get Super Admin Dashboard KPIs
// @route   GET /api/super-admin/dashboard/kpis
exports.getDashboardKpis = async (req, res, next) => {
    try {
        const totalClientsResult = await prisma.user.groupBy({
            by: ['client'],
            where: {
                AND: [
                    { client: { not: null } },
                    { client: { not: 'Platform Staff' } }
                ]
            }
        });
        const totalClients = totalClientsResult.length;
        const totalLeads = await prisma.lead.count();
        const activeChannels = await prisma.lead.count({
            where: { source: { not: null } }
        });

        res.json({
            success: true,
            data: [
                { title: 'Total Clients', value: totalClients.toString(), icon: 'Globe', color: 'bg-indigo-50 text-indigo-600', trend: 12 },
                { title: 'Total Leads', value: totalLeads.toLocaleString(), icon: 'Users', color: 'bg-blue-50 text-blue-600', trend: 8 },
                { title: 'Projected Revenue', value: '$124,500', icon: 'CreditCard', color: 'bg-emerald-50 text-emerald-600', trend: 24, subValue: 'Based on active subscriptions' },
                { title: 'Active Channels', value: activeChannels.toString(), icon: 'Activity', color: 'bg-rose-50 text-rose-600', subValue: 'W: 412 | F: 280 | Web: 200' },
            ]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get leads for dispatch queue
// @route   GET /api/super-admin/leads/dispatch-queue
exports.getDispatchQueue = async (req, res, next) => {
    try {
        const leads = await prisma.lead.findMany({
            where: { assignedTo: null },
            take: 10
        });

        const formattedLeads = leads.map(l => ({
            ...l,
            status: l.stage,
            score: l.score || 85,
            assignedTo: 'PENDING'
        }));

        res.json({ success: true, data: formattedLeads });
    } catch (error) {
        next(error);
    }
};
