const prisma = require('../config/prisma');

// @desc    Get all subscriptions/billing data
// @route   GET /api/billing
exports.getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await prisma.subscription.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};

// @desc    Upgrade a client plan
// @route   PUT /api/billing/:id/upgrade
exports.upgradePlan = async (req, res, next) => {
    try {
        const { plan } = req.body;
        const subId = parseInt(req.params.id);

        const updated = await prisma.subscription.update({
            where: { id: subId },
            data: {
                plan,
                status: 'Active'
            }
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

// @desc    Suspend a client
// @route   PUT /api/billing/:id/suspend
exports.suspendClient = async (req, res, next) => {
    try {
        const subId = parseInt(req.params.id);
        await prisma.subscription.update({
            where: { id: subId },
            data: { status: 'Suspended' }
        });
        res.json({ success: true, message: 'Client subscription suspended' });
    } catch (error) {
        next(error);
    }
};

// @desc    Add new plan/subscription
// @route   POST /api/billing
exports.addSubscription = async (req, res, next) => {
    try {
        const { clientName, plan, renewalDate } = req.body;
        const newSub = await prisma.subscription.create({
            data: {
                clientName,
                plan,
                renewalDate: renewalDate ? new Date(renewalDate) : null,
                status: 'Active'
            }
        });

        res.status(201).json({ success: true, data: newSub });
    } catch (error) {
        next(error);
    }
};
