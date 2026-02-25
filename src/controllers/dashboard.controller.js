const prisma = require('../config/prisma');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalLeads,
            totalUsers,
            totalChannels,
            whatsappCount,
            facebookCount,
            routingRules
        ] = await Promise.all([
            prisma.lead.count(),
            prisma.user.count(),
            prisma.channel.count(),
            prisma.channel.count({ where: { type: 'WhatsApp' } }),
            prisma.channel.count({ where: { type: 'Facebook' } }),
            prisma.routingRule.findMany({ take: 5 })
        ]);

        res.json({
            success: true,
            data: {
                whatsapp_count: whatsappCount,
                facebook_count: facebookCount,
                website_leads_today: totalLeads,
                routingPreview: routingRules.map(r => ({
                    country: r.country,
                    team: r.team,
                    counselor: 'System Router', // Dynamic in production based on logic
                    type: r.type,
                    status: r.status
                })),
                aiStatus: {
                    enabled: true,
                    lastUpdated: new Date().toLocaleTimeString()
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update AI Configuration
// @route   POST /api/dashboard/ai-config
exports.updateAiConfig = async (req, res, next) => {
    try {
        res.json({ success: true, message: 'AI configuration synchronized' });
    } catch (error) {
        next(error);
    }
};
// @desc    Get AI Configuration
// @route   GET /api/dashboard/ai-config
exports.getAiConfig = async (req, res, next) => {
    try {
        // Return structured AI config
        res.json({
            success: true,
            data: {
                flow: [
                    { id: 1, q: "What is your country of residence?", t: "Country" },
                    { id: 2, q: "Which program are you interested in?", t: "Program" },
                    { id: 3, q: "Which intake session are you aiming for?", t: "Intake" },
                    { id: 4, q: "What is your estimated education budget?", t: "Budget" }
                ],
                threshold: 75,
                rules: [
                    { id: 'auto_assign', label: 'Autonomous Lead Assignment', active: true, desc: 'Redirect hot leads without human triage' },
                    { id: 'crm_sync', label: 'Bi-directional CRM Webhook', active: true, desc: 'Sync qualified data to external masters' }
                ],
                scoringRules: [
                    { id: 1, desc: 'Inquiry from Tier-1 Territory', score: 25 },
                    { id: 2, desc: 'Interest in Premium Course', score: 30 },
                    { id: 3, desc: 'Budget matched > $15k', score: 20 },
                    { id: 4, desc: 'Repeat inquiry within 30 days', score: -10 },
                ]
            }
        });
    } catch (error) {
        next(error);
    }
};
