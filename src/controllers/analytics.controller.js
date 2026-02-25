const prisma = require('../config/prisma');

// @desc    Get system-wide analytics summary
// @route   GET /api/analytics/summary
exports.getSummary = async (req, res, next) => {
    try {
        // Leads by Country
        const leadsByCountry = await prisma.$queryRaw`
            SELECT country as 'Country Zone', COUNT(*) as 'Total Leads Generated', 
            SUM(CASE WHEN stage = 'Qualified' THEN 1 ELSE 0 END) as 'Qualified Pipelines'
            FROM leads 
            GROUP BY country
        `;

        // Leads by Source
        const leadsBySource = await prisma.$queryRaw`
            SELECT source as 'Ingress Channel', COUNT(*) as 'Total Leads',
            SUM(CASE WHEN stage = 'Converted' THEN 1 ELSE 0 END) as 'Successful Conversions'
            FROM leads
            GROUP BY source
        `;

        // Active Users by Role
        const activeUsers = await prisma.$queryRaw`
            SELECT role as 'Operational Tier', COUNT(*) as 'Allocated Seats',
            SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as 'Online Today'
            FROM users
            GROUP BY role
        `;

        res.json({
            success: true,
            data: { leadsByCountry, leadsBySource, activeUsers }
        });
    } catch (error) {
        next(error);
    }
};
